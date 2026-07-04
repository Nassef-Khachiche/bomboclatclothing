import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [limited, setLimited] = useState([]);
  const trustPoints = [
    { title: "Fast shipping", description: "Quick dispatch on every new drop and restock." },
    { title: "Reliable quality", description: "Streetwear staples made for repeat wear, not one-off looks." },
    { title: "Secure checkout", description: "Straightforward ordering with trusted payment handling." }
  ];

  const reviews = [
    {
      name: "Jordan M.",
      rating: 5,
      text: "Shipping was fast, the fit was clean, and the fabric felt better than expected."
    },
    {
      name: "Tiana R.",
      rating: 5,
      text: "Ordered from the limited drop and everything arrived on time exactly as shown."
    },
    {
      name: "Chris D.",
      rating: 4,
      text: "Easy checkout, solid packaging, and the hoodie quality was properly heavyweight."
    }
  ];

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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex items-end p-8 md:items-center md:p-12">
          <div className="max-w-2xl space-y-5 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/75">New season essentials</p>
            <h1 className="text-4xl font-bold uppercase tracking-[0.2em] text-white md:text-7xl">Bomboclat Clothing</h1>
            <p className="max-w-xl text-sm leading-7 text-white/80 md:text-base">
              Heavyweight streetwear, limited drops, and everyday staples built to stand out long after the scroll stops.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-white px-5 py-3 text-xs uppercase tracking-[0.24em] text-black transition duration-300 ease-out hover:-translate-y-[1px] hover:bg-zinc-200"
              >
                Shop All
              </Link>
              <Link
                to="/limited"
                className="inline-flex items-center justify-center border border-white/70 px-5 py-3 text-xs uppercase tracking-[0.24em] text-white transition duration-300 ease-out hover:-translate-y-[1px] hover:border-white hover:bg-white hover:text-black"
              >
                View Limited Drop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="soft-reveal soft-reveal-delay-1 grid gap-4 md:grid-cols-3">
        {trustPoints.map((point) => (
          <div key={point.title} className="border border-zinc-200 bg-white p-5 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Why Shop Here</p>
            <h2 className="mt-3 text-base font-semibold uppercase tracking-[0.12em] text-black">{point.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{point.description}</p>
          </div>
        ))}
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

      <section className="soft-reveal soft-reveal-delay-2 border border-zinc-200 bg-[#f8f6f1] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Google Reviews</p>
            <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.12em] text-black md:text-3xl">
              Trusted by early customers
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl tracking-[0.18em] text-black">4.9</span>
              <span className="text-sm tracking-[0.2em] text-amber-500">★★★★★</span>
              <span className="text-sm text-zinc-600">Based on 128 reviews</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Placeholder review content for now. This block can be swapped with a real Google review widget once you pick the provider or embed method.
            </p>
          </div>

          <div className="grid flex-1 gap-4 md:grid-cols-3 lg:max-w-3xl">
            {reviews.map((review) => (
              <article key={review.name} className="border border-zinc-200 bg-white p-5 text-left shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-black">{review.name}</h3>
                  <span className="text-xs tracking-[0.18em] text-amber-500">{"★".repeat(review.rating)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{review.text}</p>
              </article>
            ))}
          </div>
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
