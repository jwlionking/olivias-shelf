/**
 * Pictures are served from this host. Set VITE_ASSET_CDN to a jsDelivr GitHub
 * URL only when the deploy itself cannot host the paintings (Vercel size caps).
 * jsDelivr's @main cache lags git, which is why the physics covers looked blank.
 */
export const ASSET_CDN = import.meta.env.VITE_ASSET_CDN || "";

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
