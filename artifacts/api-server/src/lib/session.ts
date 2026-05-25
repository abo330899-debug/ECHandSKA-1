import crypto from "crypto";
import type { Request, Response, NextFunction, RequestHandler } from "express";

const COOKIE_NAME = "nafsam_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const s = process.env.NAFSAM_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NAFSAM_SESSION_SECRET env var is required in production");
  }
  return "dev-only-insecure-session-secret-change-me";
}

function getPasswordVersion(): string {
  const raw = process.env.NAFSAM_PASSWORDS ?? "";
  return crypto.createHash("sha256").update(raw).digest("base64url").slice(0, 16);
}

function sign(payload: string): string {
  const h = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${h}`;
}

/**
 * Server-side revocation store: maps jti → expiresAt (ms).
 *
 * Design assumption: this archive runs as a single-process, single-instance
 * deployment (Replit Autoscale at minimum-1 / maximum-1 instance). Under
 * that topology this in-memory store is sufficient — all requests are served
 * by the same process so every logout is immediately visible to every
 * subsequent auth check.
 *
 * If the deployment is ever scaled to multiple concurrent instances, or if
 * process restarts within the 30-day session TTL must still honour revocation,
 * this store must be replaced with a shared durable backend (e.g. a
 * "revoked_sessions" table in PostgreSQL keyed by jti with a TTL index, or
 * a Redis SET with EXPIREAT). Until then, a process restart clears the
 * denylist and any revoked tokens issued before the restart become replayable
 * again for their remaining TTL.
 *
 * Entries are purged lazily (during verify()) and on a periodic hourly sweep
 * so the map does not grow without bound over the 30-day session lifetime.
 */
const revokedSessions = new Map<string, number>();

function purgeExpiredRevocations(): void {
  const now = Date.now();
  for (const [jti, expiresAt] of revokedSessions) {
    if (expiresAt <= now) {
      revokedSessions.delete(jti);
    }
  }
}

setInterval(purgeExpiredRevocations, 60 * 60 * 1000).unref();

interface ParsedToken {
  jti: string;
  expiresAt: number;
}

function verify(token: string | undefined): { valid: boolean } & Partial<ParsedToken> {
  if (!token) return { valid: false };
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return { valid: false };
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { valid: false };
  }
  const parts = payload.split(":");
  if (parts.length !== 3) return { valid: false };
  const [expiresAtStr, embeddedVersion, jti] = parts;
  if (embeddedVersion !== getPasswordVersion()) {
    return { valid: false };
  }
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return { valid: false };
  }
  const revokedExpiry = revokedSessions.get(jti);
  if (revokedExpiry !== undefined) {
    if (revokedExpiry <= Date.now()) {
      revokedSessions.delete(jti);
    } else {
      return { valid: false };
    }
  }
  return { valid: true, jti, expiresAt };
}

export function issueSession(res: Response): void {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const jti = crypto.randomBytes(16).toString("base64url");
  const payload = `${String(expiresAt)}:${getPasswordVersion()}:${jti}`;
  const token = sign(payload);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export function clearSession(req: Request, res: Response): void {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies ?? {};
  const token = cookies[COOKIE_NAME];
  if (token) {
    const result = verify(token);
    if (result.valid && result.jti && result.expiresAt) {
      revokedSessions.set(result.jti, result.expiresAt);
    }
  }
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function isAuthed(req: Request): boolean {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies ?? {};
  const token = cookies[COOKIE_NAME];
  return verify(token).valid;
}

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!isAuthed(req)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
};
