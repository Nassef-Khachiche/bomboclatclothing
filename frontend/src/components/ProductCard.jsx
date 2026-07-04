import { Link } from "react-router-dom";
import { getDisplayProductImages } from "../utils/productImages";

function ProductCard({ product }) {
  const images = getDisplayProductImages(product);

  return (
    <article className="group space-y-3">
      <Link to={`/products/${product.slug || product.id}`} className="block overflow-hidden bg-white">
        <div className="relative h-[58vh] min-h-[360px] w-full">
          <img
            src={images[0].url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
            loading="lazy"
          />
          {images[1]?.url && (
            <img
              src={images[1].url}
              alt={`${product.name} alternate`}
              className="absolute inset-0 z-10 h-full w-full object-contain opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      </Link>
      <h3 className="text-center text-[11px] uppercase tracking-[0.22em] text-zinc-700">{product.name}</h3>
    </article>
  );
}

export default ProductCard;
