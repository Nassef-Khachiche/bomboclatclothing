import { useEffect, useState } from "react";
import api from "../api/client";
import Button from "./Button";

const key = "bomboclat-cookie-consent";

function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (!saved) {
      setOpen(true);
    }
  }, []);

  const choose = async (decision) => {
    localStorage.setItem(key, decision);
    setOpen(false);
    await api.post("/cookie-consent", { decision });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 border border-zinc-300 bg-white p-4 shadow-xl md:left-auto md:w-[460px]">
      <p className="text-sm">
        We use cookies to improve your experience and measure storefront performance.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => choose("ACCEPTED")}>Accept</Button>
        <Button variant="outline" onClick={() => choose("DECLINED")}>Decline</Button>
        <Button variant="outline" onClick={() => choose("MANAGED")}>Manage Preferences</Button>
      </div>
    </div>
  );
}

export default CookieConsent;
