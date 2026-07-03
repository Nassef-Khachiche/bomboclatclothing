import { useEffect, useState } from "react";
import api from "../api/client";
import OutfitCard from "../components/OutfitCard";
import useCartStore from "../store/cartStore";
import { useToast } from "../components/ToastContext";

function OutfitsPage() {
  const [outfits, setOutfits] = useState([]);
  const { addToCart } = useCartStore();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/outfits");
      setOutfits(data);
    };
    load();
  }, []);

  const buyOutfit = async (outfit) => {
    for (const item of outfit.products || []) {
      await addToCart(item.product.id, 1);
    }
    toast.push("Complete outfit added to cart");
  };

  return (
    <div>
      <h1 className="mb-6 text-sm uppercase tracking-[0.26em]">Complete Outfits</h1>
      <div className="space-y-4">
        {outfits.map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} onBuy={buyOutfit} />)}
      </div>
    </div>
  );
}

export default OutfitsPage;
