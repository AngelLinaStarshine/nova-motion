// Cross-app URLs for studio site + shop (custom domains via Vite env vars).

function trimUrl(url) {
  return (url || "").replace(/\/$/, "");
}

/** Studio website origin, e.g. https://novamotion.ca */
export const STUDIO_URL = trimUrl(import.meta.env.VITE_STUDIO_URL);

/** Shop app URL. Defaults to /collection when apps run together. */
export const SHOP_URL = trimUrl(import.meta.env.VITE_SHOP_URL) || "/collection";

export function isExternalUrl(url) {
  return /^https?:\/\//i.test(url);
}

export function isShopExternal() {
  return isExternalUrl(SHOP_URL);
}

export function isStudioExternal() {
  return isExternalUrl(STUDIO_URL);
}

/** Link target for the studio from the shop app. */
export function studioHref() {
  return STUDIO_URL || "/";
}

/** Link target for the shop from the studio site. */
export function shopHref() {
  return SHOP_URL;
}
