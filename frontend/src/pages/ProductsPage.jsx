import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";

function ProductsPage({ presetFilters = {}, title = "All Products" }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ sort: "newest", ...presetFilters });

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "12",
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    });
    return params.toString();
  }, [page, filters]);

  useEffect(() => {
    setFilters((previous) => ({ ...previous, ...presetFilters }));
  }, [presetFilters]);

  useEffect(() => {
    const load = async () => {
      const [productsRes, searchRes] = await Promise.all([
        api.get(`/products?${queryString}`),
        api.get("/search?q=")
      ]);
      setProducts(productsRes.data.items);
      setTotal(productsRes.data.total);
      setCategories(searchRes.data.categories || []);
    };

    load();
  }, [queryString]);

  return (
    <div className="soft-reveal space-y-8">
      <header className="soft-reveal soft-reveal-delay-1 flex items-center justify-between">
        <h1 className="text-sm uppercase tracking-[0.26em]">{title}</h1>
        <button
          className="text-xs uppercase tracking-[0.26em] text-zinc-700 transition hover:text-black"
          onClick={() => setFilterOpen(true)}
        >
          Filter
        </button>
      </header>

      <div className="soft-reveal soft-reveal-delay-2 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      <Pagination page={page} pageSize={12} total={total} onChange={setPage} />

      <div className={`fixed inset-0 z-50 ${filterOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/25 transition duration-300 ease-out ${filterOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setFilterOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white transition-transform duration-300 ease-out ${
            filterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-6 md:px-8">
            <h2 className="text-xs uppercase tracking-[0.26em]">Filter</h2>
            <button className="text-xs uppercase tracking-[0.2em]" onClick={() => setFilterOpen(false)}>
              Close
            </button>
          </div>
          <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />
        </aside>
      </div>
    </div>
  );
}

export default ProductsPage;
