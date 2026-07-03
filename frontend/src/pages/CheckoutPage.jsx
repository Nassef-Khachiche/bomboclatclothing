import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import useCartStore from "../store/cartStore";
import Button from "../components/Button";
import { currency } from "../utils/currency";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clear } = useCartStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [orderNumber, setOrderNumber] = useState("");

  const items = cart?.items || [];

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const taxes = subtotal * 0.12;
  const shipping = subtotal > 250 ? 0 : 15;
  const total = subtotal + taxes + shipping;

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone
      },
      shipping: {
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country
      },
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    };

    const { data } = await api.post("/orders/checkout", payload);
    setOrderNumber(data.orderNumber);
    await clear();
  };

  if (orderNumber) {
    return (
      <div className="max-w-xl space-y-4 border border-zinc-200 p-6">
        <h1 className="text-lg uppercase tracking-[0.2em]">Order Confirmed</h1>
        <p className="text-sm text-zinc-600">Your order number is {orderNumber}.</p>
        <Button onClick={() => navigate(`/track-order`)}>Track Your Order</Button>
      </div>
    );
  }

  return (
    <form className="grid gap-8 lg:grid-cols-2" onSubmit={submit}>
      <div className="space-y-5">
        <h1 className="text-sm uppercase tracking-[0.24em]">Checkout</h1>

        <section className="space-y-3 border border-zinc-200 p-4">
          <h2 className="text-xs uppercase tracking-[0.2em]">Customer</h2>
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Name" required onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Email" type="email" required onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Phone" required onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
        </section>

        <section className="space-y-3 border border-zinc-200 p-4">
          <h2 className="text-xs uppercase tracking-[0.2em]">Shipping</h2>
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Address" required onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="City" required onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Postal Code" required onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Country" required onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
        </section>

        <section className="space-y-3 border border-zinc-200 p-4">
          <h2 className="text-xs uppercase tracking-[0.2em]">Payment</h2>
          <p className="text-sm text-zinc-600">Mock payment enabled for demo.</p>
        </section>

        <Button type="submit">Place Order</Button>
      </div>

      <aside className="border border-zinc-200 p-4">
        <h2 className="mb-4 text-xs uppercase tracking-[0.2em]">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.product.name} x {item.quantity}</span>
              <span>{currency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-zinc-200 pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Taxes</span><span>{currency(taxes)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{currency(shipping)}</span></div>
          <div className="flex justify-between font-medium"><span>Total</span><span>{currency(total)}</span></div>
        </div>
      </aside>
    </form>
  );
}

export default CheckoutPage;
