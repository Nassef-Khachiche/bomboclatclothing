import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import OutfitCard from "../components/OutfitCard";
import Button from "../components/Button";
import useCartStore from "../store/cartStore";
import { useToast } from "../components/ToastContext";

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [limited, setLimited] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const { addToCart } = useCartStore();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const [productsRes, limitedRes, outfitsRes] = await Promise.all([
        api.get("/products?pageSize=8&sort=newest"),
        api.get("/products?limited=true&pageSize=4"),
        api.get("/outfits")
      ]);

      setFeatured(productsRes.data.items.slice(0, 4));
      setNewArrivals(productsRes.data.items.slice(4, 8));
      setLimited(limitedRes.data.items);
      setOutfits(outfitsRes.data.slice(0, 3));
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
    <div className="space-y-16">
      <section className="grid items-end gap-5 bg-[linear-gradient(120deg,#f7f7f7,#ffffff)] p-8 md:grid-cols-2 md:p-12">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Premium Street Essentials</p>
          <h1 className="text-4xl uppercase tracking-[0.1em] leading-tight md:text-6xl">
            Minimal Luxury for Daily Rotation
          </h1>
          <p className="max-w-md text-sm text-zinc-600">
            Designed in monochrome palettes, cut with oversized silhouettes, and built to mix across complete outfits.
          </p>
          <div className="flex gap-3">
            <Link to="/products"><Button>Shop Now</Button></Link>
            <Link to="/outfits"><Button variant="outline">Explore Outfits</Button></Link>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
          alt="Bomboclat hero"
          className="h-[420px] w-full object-cover"
          loading="eager"
        />
      </section>

      <section>
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">New Arrivals</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">Limited Collection</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {limited.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">Featured Outfits</h2>
        <div className="space-y-4">
          {outfits.map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} onBuy={buyOutfit} />)}
        </div>
      </section>

      <section className="border border-zinc-200 p-6 text-center">
        <h2 className="text-sm uppercase tracking-[0.25em]">Newsletter</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600">
          Join Bomboclat updates for first access to new drops and limited capsule releases.
        </p>
        <form className="mx-auto mt-4 flex max-w-md flex-col gap-3 sm:flex-row">
          <input type="email" placeholder="Email Address" className="w-full border border-zinc-300 px-3 py-2 text-sm" />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}

export default HomePage;
