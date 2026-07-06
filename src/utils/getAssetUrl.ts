import { assetUrl } from "./env";

export function getAssetUrl(path: string) {
  if (!path) return "";

  // Already an absolute URL
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${assetUrl}/${path}`;
}