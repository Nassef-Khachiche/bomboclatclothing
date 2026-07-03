import { Link } from "react-router-dom";
import Button from "./Button";
import { currency } from "../utils/currency";

function OutfitCard({ outfit, onBuy }) {
  return (
    <article className="grid gap-4 border border-zinc-200 p-4 md:grid-cols-[220px_1fr_auto] md:items-center">
      <img src={outfit.heroImage} alt={outfit.name} className="h-36 w-full object-cover" loading="lazy" />
      <div>
        <h3 className="text-sm uppercase tracking-[0.2em]">{outfit.name}</h3>
        <p className="mt-2 text-sm text-zinc-600">{currency(outfit.totalPrice)}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
          {outfit.products?.length || 0} Products Included
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Link to={`/outfits/${outfit.slug || outfit.id}`}>
          <Button variant="outline">View Outfit</Button>
        </Link>
        <Button onClick={() => onBuy(outfit)}>Buy Complete Outfit</Button>
      </div>
    </article>
  );
}

export default OutfitCard;
