import { useState } from "react";
import api from "../api/client";
import Button from "../components/Button";

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.get(`/track/${orderNumber}?email=${encodeURIComponent(email)}`);
      setData(response.data);
    } catch (requestError) {
      setData(null);
      setError("Order not found. Check your order number and email.");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-sm uppercase tracking-[0.25em]">Track Order</h1>

      <form className="grid max-w-xl gap-4" onSubmit={submit}>
        <input
          className="border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Order Number"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          required
        />
        <input
          type="email"
          className="border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit">Track Order</Button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3 border border-zinc-200 p-4">
            <h2 className="text-xs uppercase tracking-[0.2em]">Tracking Timeline</h2>
            {data.timeline.map((step) => (
              <div key={step.status} className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${step.completed ? "bg-black" : "bg-zinc-300"}`} />
                <span className={`text-sm ${step.active ? "font-semibold" : "text-zinc-500"}`}>{step.status}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border border-zinc-200 p-4">
            <h2 className="text-xs uppercase tracking-[0.2em]">Shipping Address</h2>
            <p className="text-sm text-zinc-600">
              {data.shippingAddress.address}, {data.shippingAddress.city}, {data.shippingAddress.postalCode}, {" "}
              {data.shippingAddress.country}
            </p>
            <h3 className="mt-3 text-xs uppercase tracking-[0.2em]">Purchased Items</h3>
            {data.items.map((item) => (
              <p key={item.id} className="text-sm text-zinc-700">
                {item.product.name} x {item.quantity}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default TrackOrderPage;
