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
    <div className="grid gap-8 md:grid-cols-[260px_1fr]">
      <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />
      <div>
        <h1 className="mb-6 text-sm uppercase tracking-[0.26em]">{title}</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <Pagination page={page} pageSize={12} total={total} onChange={setPage} />
      </div>
    </div>
  );
}

export default ProductsPage;
