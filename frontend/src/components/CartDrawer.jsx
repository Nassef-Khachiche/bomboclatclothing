import { X } from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { currency } from "../utils/currency";
import { getDisplayProductImages } from "../utils/productImages";
import QuantitySelector from "./QuantitySelector";
import Button from "./Button";

function CartDrawer({ open, setOpen }) {
  const { cart, removeItem, updateQuantity } = useCartStore();
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxes = subtotal * 0.12;
  const shipping = subtotal > 250 ? 0 : 15;
  const total = subtotal + taxes + shipping;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition duration-300 ease-out ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-5 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.2em]">Your Cart</h3>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="max-h-[58vh] space-y-4 overflow-auto pr-2">
          {items.length === 0 && (
            <div className="space-y-3 py-6 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Your cart is empty</p>
              <Link to="/products" onClick={() => setOpen(false)} className="text-xs uppercase tracking-[0.2em] underline">
                Browse Fits
              </Link>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[80px_1fr] gap-3 border-b border-zinc-100 pb-3 transition duration-300 hover:bg-zinc-50/60">
              <Link to={`/products/${item.product.slug || item.product.id}`} onClick={() => setOpen(false)}>
                <img
                  src={getDisplayProductImages(item.product)[0].url}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-sm object-cover transition duration-300 hover:scale-[1.03]"
                  loading="lazy"
                />
              </Link>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.14em]">{item.product.name}</p>
                <p className="text-sm">{currency(item.product.price)}</p>
                <div className="flex items-center justify-between">
                  <QuantitySelector value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} />
                  <button className="text-xs uppercase tracking-[0.18em]" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Taxes</span><span>{currency(taxes)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{currency(shipping)}</span></div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 font-medium"><span>Total</span><span>{currency(total)}</span></div>
        </div>

        <Link to="/checkout" onClick={() => setOpen(false)}>
          <Button className="mt-5 w-full">Checkout</Button>
        </Link>
      </aside>
    </div>
  );
}

export default CartDrawer;
