function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  if (pages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        className="border border-black px-3 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-30"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="text-xs uppercase tracking-[0.2em]">{page} / {pages}</span>
      <button
        className="border border-black px-3 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-30"
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
