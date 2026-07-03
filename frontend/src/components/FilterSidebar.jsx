function FilterSidebar({ filters, setFilters, categories = [] }) {
  return (
    <aside className="space-y-4 border border-zinc-200 p-4">
      <h3 className="text-xs uppercase tracking-[0.2em]">Filters</h3>
      <input
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        placeholder="Search"
        value={filters.q || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
      />
      <input
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        placeholder="Collection slug"
        value={filters.collection || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, collection: event.target.value }))}
      />
      <input
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        placeholder="Outfit slug"
        value={filters.outfit || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, outfit: event.target.value }))}
      />
      <select
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        value={filters.category || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
      >
        <option value="">Category</option>
        {categories.map((item) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        ))}
      </select>
      <select
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        value={filters.sort || "newest"}
        onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price Low to High</option>
        <option value="price_desc">Price High to Low</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          className="w-full border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Min $"
          value={filters.minPrice || ""}
          onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
        />
        <input
          className="w-full border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Max $"
          value={filters.maxPrice || ""}
          onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
        />
      </div>
      <input
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        placeholder="Size (e.g. M)"
        value={filters.size || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, size: event.target.value }))}
      />
      <input
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        placeholder="Color (e.g. Black)"
        value={filters.color || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, color: event.target.value }))}
      />
      <select
        className="w-full border border-zinc-300 px-3 py-2 text-sm"
        value={filters.availability || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, availability: event.target.value }))}
      >
        <option value="">Availability</option>
        <option value="in_stock">In Stock</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.limited === "true"}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, limited: event.target.checked ? "true" : "" }))
          }
        />
        Limited Edition
      </label>
    </aside>
  );
}

export default FilterSidebar;
