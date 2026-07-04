import { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [limited, setLimited] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [productsRes, limitedRes] = await Promise.all([
        api.get("/products?pageSize=12&sort=newest"),
        api.get("/products?limited=true&pageSize=6")
      ]);

      setFeatured(productsRes.data.items.slice(0, 6));
      setNewArrivals(productsRes.data.items.slice(6, 12));
      setLimited(limitedRes.data.items);
    };

    load();
  }, []);

  return (
    <div className="space-y-16">
      <section className="soft-reveal relative -mx-4 overflow-hidden md:-mx-6">
        <div className="h-[78vh] min-h-[520px] w-full bg-black">
          <video className="h-full w-full object-cover opacity-90" autoPlay muted loop playsInline>
            <source src="/images/menu/bomboclatclothing-home.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-end p-8 md:items-center md:p-12">
          <h1 className="text-4xl font-bold uppercase tracking-[0.2em] text-white md:text-7xl">Bomboclat Clothing</h1>
        </div>
      </section>

      <section className="soft-reveal soft-reveal-delay-1">
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="soft-reveal soft-reveal-delay-2">
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">New Arrivals</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="soft-reveal soft-reveal-delay-3">
        <h2 className="mb-5 text-sm uppercase tracking-[0.25em]">Limited Collection</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {limited.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="soft-reveal border border-zinc-200 p-6 text-center">
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
