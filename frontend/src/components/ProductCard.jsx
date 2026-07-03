import { Link } from "react-router-dom";
import Button from "./Button";
import { currency } from "../utils/currency";

function ProductCard({ product }) {
  return (
    <article className="group space-y-3">
      <div className="overflow-hidden bg-zinc-100">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="text-sm uppercase tracking-[0.17em]">{product.name}</h3>
      <p className="text-sm text-zinc-600">{currency(product.price)}</p>
      <Link to={`/products/${product.slug || product.id}`}>
        <Button variant="outline" className="w-full">View Product</Button>
      </Link>
    </article>
  );
}

export default ProductCard;
