/** Production picture/audio files live on GitHub so the host deploy stays small. */
export const ASSET_CDN = import.meta.env.PROD
  ? "https://cdn.jsdelivr.net/gh/jwlionking/olivias-shelf@main/public"
  : "";

export function cdn(path: string): string {
  if (!path) return path;
  if (
    path.startsWith("blob:") ||
    path.startsWith("data:") ||
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }
  if (!ASSET_CDN) return path.startsWith("/") ? path : `/${path}`;
  return `${ASSET_CDN}${path.startsWith("/") ? path : `/${path}`}`;
}
