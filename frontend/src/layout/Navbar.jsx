import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import HamburgerMenu from "../components/HamburgerMenu";

function Navbar({ onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(
    () => [
      { to: "/new", label: "New" },
      { to: "/products", label: "Products" },
      { to: "/limited", label: "Limited" }
    ],
    []
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="bg-black py-2 text-center text-[10px] uppercase tracking-[0.22em] text-white">
        Flash Sale: Limited Capsule up to 30% Off
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)} aria-label="menu">
            <Menu size={18} />
          </button>
        </div>

        <Link to="/" className="text-sm uppercase tracking-[0.44em]">
          Bomboclat Clothing
        </Link>

        <button onClick={onCartOpen} aria-label="cart" className="relative">
          <ShoppingBag size={18} />
        </button>
      </div>

      <nav className="mx-auto hidden max-w-7xl gap-7 px-4 pb-4 md:flex">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-black">
            {link.label}
          </NavLink>
        ))}
      </nav>

      <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
    </header>
  );
}

export default Navbar;
