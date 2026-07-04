import { Link } from "react-router-dom";
import { X } from "lucide-react";

function HamburgerMenu({ open, setOpen }) {
  const links = [
    { to: "/", label: "Home" },
    { to: "/new", label: "New" },
    { to: "/products", label: "Products" },
    { to: "/limited", label: "Limited" },
    { to: "/track-order", label: "Track Order" }
  ];

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/70 transition duration-300 ease-out ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute left-0 top-0 h-dvh w-full bg-black p-8 text-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="grid h-full gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] md:gap-8">
          <section className="min-w-0 flex h-full flex-col">
            <div className="mb-10 flex justify-end md:mb-16">
              <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/60">Bomboclat Clothing</p>
            <nav className="space-y-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm uppercase tracking-[0.28em] text-white/85 transition hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="mt-auto pt-8 text-xs uppercase tracking-[0.2em] text-white/50">
              Archive of premium street fits.
            </p>
          </section>

          <section className="relative hidden h-full min-w-0 overflow-hidden rounded-sm bg-zinc-950 md:block">
            <video
              className="h-full w-full object-cover opacity-85"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/images/menu/bomboclatclothing.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-black/10" />
          </section>
        </div>
      </div>
    </div>
  );
}

export default HamburgerMenu;
