function FilterSidebar({ filters, setFilters, categories = [] }) {
  return (
    <aside className="space-y-5 p-6 md:p-8">
      <h3 className="text-xs uppercase tracking-[0.26em]">Filter</h3>
      <input
        className="w-full border-b border-zinc-300 px-0 py-2 text-sm outline-none"
        placeholder="Search"
        value={filters.q || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
      />
      <input
        className="w-full border-b border-zinc-300 px-0 py-2 text-sm outline-none"
        placeholder="Collection / Drop"
        value={filters.collection || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, collection: event.target.value }))}
      />
      <select
        className="w-full border-b border-zinc-300 bg-white px-0 py-2 text-sm outline-none"
        value={filters.category || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
      >
        <option value="">Category</option>
        {categories.map((item) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        ))}
      </select>
      <input
        className="w-full border-b border-zinc-300 px-0 py-2 text-sm outline-none"
        placeholder="Size"
        value={filters.size || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, size: event.target.value }))}
      />
      <input
        className="w-full border-b border-zinc-300 px-0 py-2 text-sm outline-none"
        placeholder="Color"
        value={filters.color || ""}
        onChange={(event) => setFilters((prev) => ({ ...prev, color: event.target.value }))}
      />
      <select
        className="w-full border-b border-zinc-300 bg-white px-0 py-2 text-sm outline-none"
        value={filters.sort || "newest"}
        onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
      >
        <option value="newest">Sort: Newest</option>
        <option value="price_asc">Sort: Price Low to High</option>
        <option value="price_desc">Sort: Price High to Low</option>
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
