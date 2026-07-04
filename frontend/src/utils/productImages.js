export const PRODUCT_PLACEHOLDER_IMAGES = [
  "https://lemuta.com/cdn/shop/files/Sweater-5b.png?v=1704286393&width=800",
  "https://lemuta.com/cdn/shop/files/Sweater-8-Kopie.png?v=1704289688&width=800",
  "https://lemuta.com/cdn/shop/files/Hoodiewashedblack.jpg?v=1717147978&width=800",
  "https://lemuta.com/cdn/shop/files/Hoodiewashedblack2.jpg?v=1717147978&width=800",
  "https://lemuta.com/cdn/shop/files/Hoodiewashedblack3.jpg?v=1717147978&width=800"
];

export function getDisplayProductImages(product) {
  return PRODUCT_PLACEHOLDER_IMAGES.map((url, index) => ({
    id: `${product?.id || "placeholder"}-${index}`,
    url
  }));
}
