import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../components/CartDrawer";
import CookieConsent from "../components/CookieConsent";
import useCartStore from "../store/cartStore";

function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { init } = useCartStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
      <CookieConsent />
    </div>
  );
}

export default AppLayout;
