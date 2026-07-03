function QuantitySelector({ value, onChange }) {
  return (
    <div className="inline-flex items-center border border-zinc-300">
      <button className="px-3 py-2" onClick={() => onChange(Math.max(1, value - 1))}>
        -
      </button>
      <span className="px-3 py-2 text-sm">{value}</span>
      <button className="px-3 py-2" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
