import { Link } from "react-router-dom";
import { X } from "lucide-react";

function HamburgerMenu({ open, setOpen }) {
  const links = [
    { to: "/", label: "Home" },
    { to: "/new", label: "New" },
    { to: "/products", label: "Products" },
    { to: "/outfits", label: "Outfits" },
    { to: "/limited", label: "Limited" },
    { to: "/track-order", label: "Track Order" }
  ];

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute left-0 top-0 h-full w-[290px] bg-white p-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex justify-end">
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-xs uppercase tracking-[0.24em]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default HamburgerMenu;
