import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

if (process.env.NODE_ENV === "production") {
  // The Replit deployment path routes requests through a variable number of
  // platform-managed proxy/load-balancer hops before reaching Node. Trusting
  // exactly 1 hop (the previous default) causes req.ip to resolve to the last
  // internal intermediary instead of the real client address when there are
  // multiple hops, collapsing many unrelated viewers into a single rate-limit
  // bucket. We set "trust proxy" to true so Express parses the full
  // X-Forwarded-For chain; getClientIP() in the auth route then applies the
  // rightmost-public-IP algorithm to extract a trustworthy client identity
  // instead of relying on req.ip directly.
  app.set("trust proxy", true);
}

const allowedOrigins = new Set<string>();

function addAllowedOrigins(raw: string | undefined): void {
  for (const value of (raw ?? "").split(",")) {
    const trimmed = value.trim();
    if (!trimmed) continue;

    try {
      const origin = trimmed.includes("://")
        ? new URL(trimmed).origin
        : new URL(`https://${trimmed}`).origin;
      allowedOrigins.add(origin);
    } catch {
      logger.warn({ origin: trimmed }, "Ignoring invalid allowed origin");
    }
  }
}

addAllowedOrigins(process.env.REPLIT_DOMAINS);
addAllowedOrigins(process.env.REPLIT_DEV_DOMAIN);
addAllowedOrigins(process.env.ALLOWED_ORIGINS);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      if (
        process.env.NODE_ENV !== "production" &&
        (origin.startsWith("http://localhost") ||
          origin.startsWith("http://127.0.0.1"))
      ) {
        return callback(null, true);
      }
      callback(null, false);
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const tgDir = path.resolve(__dirname, "../../telegram-call/dist/public");
app.use("/telegram-call", express.static(tgDir));
app.get("/telegram-call/*path", (_req, res) => {
  res.sendFile(path.join(tgDir, "index.html"));
});

if (process.env.NODE_ENV === "production") {
  const staticDir = path.resolve(__dirname, "../../nafsam/dist/public");
  app.use(express.static(staticDir));
  app.get("*path", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
