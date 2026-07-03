import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import useCartStore from "../store/cartStore";
import { currency } from "../utils/currency";
import { useToast } from "../components/ToastContext";

function OutfitDetailsPage() {
  const { id } = useParams();
  const [outfit, setOutfit] = useState(null);
  const { addToCart } = useCartStore();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/outfits/${id}`);
      setOutfit(data);
    };

    load();
  }, [id]);

  if (!outfit) {
    return <p>Loading...</p>;
  }

  const buyCompleteOutfit = async () => {
    for (const item of outfit.products) {
      await addToCart(item.product.id, 1);
    }
    toast.push("Complete outfit added to cart");
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <img src={outfit.heroImage} alt={outfit.name} className="h-[420px] w-full object-cover" />
        <div className="space-y-4">
          <h1 className="text-2xl uppercase tracking-[0.14em]">{outfit.name}</h1>
          <p className="text-sm text-zinc-600">{outfit.description}</p>
          <p className="text-sm uppercase tracking-[0.2em]">Total Price: {currency(outfit.totalPrice)}</p>
          <Button onClick={buyCompleteOutfit}>Buy Complete Outfit</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-sm uppercase tracking-[0.2em]">Products Included</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outfit.products.map((entry) => <ProductCard key={entry.product.id} product={entry.product} />)}
        </div>
      </section>
    </div>
  );
}

export default OutfitDetailsPage;
