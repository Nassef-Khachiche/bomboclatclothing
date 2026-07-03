import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/client";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!query.trim()) {
        setResults(null);
        return;
      }
      const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    }, 260);

    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center gap-2 border-b border-black px-1 py-2">
        <Search size={16} />
        <input
          className="w-full bg-transparent text-sm outline-none"
          placeholder="Search products, outfits, categories"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {results && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 border border-zinc-200 bg-white p-3 shadow-lg">
          <div className="space-y-2 text-xs uppercase tracking-[0.15em]">
            {results.products?.map((item) => (
              <Link key={`p-${item.id}`} className="block hover:text-zinc-500" to={`/products/${item.slug}`}>
                {item.name}
              </Link>
            ))}
            {results.outfits?.map((item) => (
              <Link key={`o-${item.id}`} className="block hover:text-zinc-500" to={`/outfits/${item.slug}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
