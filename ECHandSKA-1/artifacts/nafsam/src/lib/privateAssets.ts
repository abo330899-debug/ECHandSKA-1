import { mediaUrl, posterUrl, imageUrl } from "@/lib/r2";

export function privateMedia(file: string): string {
  return mediaUrl(file);
}

export function privatePoster(file: string): string {
  return posterUrl(file);
}

export function privateImage(rel: string): string {
  return imageUrl(rel);
}
