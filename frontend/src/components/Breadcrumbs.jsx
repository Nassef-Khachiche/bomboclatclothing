import { Link } from "react-router-dom";

function Breadcrumbs({ items }) {
  return (
    <nav className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
