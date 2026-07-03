import { useEffect, useMemo, useState } from "react";
import ProductsPage from "./ProductsPage";

function LimitedPage() {
  const [deadline] = useState(() => Date.now() + 72 * 60 * 60 * 1000);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = useMemo(() => {
    const diff = Math.max(0, deadline - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [deadline, now]);

  return (
    <div className="space-y-6">
      <div className="border border-black bg-black p-3 text-center text-xs uppercase tracking-[0.23em] text-white">
        Limited Drop Ends In: {countdown}
      </div>
      <ProductsPage title="Limited Collection" presetFilters={{ limited: "true" }} />
    </div>
  );
}

export default LimitedPage;
