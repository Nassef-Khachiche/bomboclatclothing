import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import QuantitySelector from "../components/QuantitySelector";
import Button from "../components/Button";
import useCartStore from "../store/cartStore";
import { useToast } from "../components/ToastContext";
import { getDisplayProductImages } from "../utils/productImages";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showPurchase, setShowPurchase] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const { addToCart } = useCartStore();
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setSize(data.sizes?.[0] || "");
      setColor(data.colors?.[0] || "");
    };
    load();
  }, [id]);

  useEffect(() => {
    const onScroll = () => setShowPurchase(window.scrollY > 520);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addProduct = async () => {
    await addToCart(product.id, quantity);
    toast.push(`Added ${quantity} x ${product.name}`);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const images = getDisplayProductImages(product);
  const activeImageUrl = images[activeImage]?.url || images[0]?.url;

  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <div className="h-[78vh] min-h-[560px] w-full overflow-hidden bg-white">
          <img src={activeImageUrl} alt={product.name} className="h-full w-full object-contain" loading="eager" />
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-7">
          {images.map((item, index) => (
            <button key={item.id || index} onClick={() => setActiveImage(index)} className="overflow-hidden bg-white">
              <img src={item.url} alt={`${product.name} ${index + 1}`} className="h-32 w-full object-contain" loading="lazy" />
            </button>
          ))}
        </div>
        <h1 className="pt-3 text-sm uppercase tracking-[0.28em]">{product.name}</h1>
      </section>

      <section className="grid gap-3 md:max-w-3xl">
        <Accordion title="Description">
          <p className="text-sm leading-relaxed text-zinc-600">{product.description}</p>
        </Accordion>
        <Accordion title="Details">
          <p className="text-sm text-zinc-600">Category: {product.category?.name}</p>
          <p className="text-sm text-zinc-600">Collection: {product.collection?.name || "Core"}</p>
          <p className="text-sm text-zinc-600">Stock: {product.stock > 0 ? "Available" : "Sold Out"}</p>
        </Accordion>
        <Accordion title="Shipping">
          <p className="text-sm leading-relaxed text-zinc-600">
            Global delivery in 5-10 business days. Signature required for limited drops.
          </p>
        </Accordion>
      </section>

      <div
        className={`fixed bottom-6 right-6 z-40 w-full max-w-xs bg-white/95 p-4 shadow-xl transition ${
          showPurchase ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-zinc-500">Purchase</p>
        <div className="mb-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em]">Size</p>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((item) => (
              <button
                key={item}
                onClick={() => setSize(item)}
                className={`px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
                  size === item ? "bg-black text-white" : "bg-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em]">Color</p>
          <div className="flex flex-wrap gap-1">
            {product.colors.map((item) => (
              <button
                key={item}
                onClick={() => setColor(item)}
                className={`px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
                  color === item ? "bg-black text-white" : "bg-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
        <Button onClick={addProduct} className="w-full">Add to Cart</Button>
      </div>
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200 pb-3">
      <button
        className="flex w-full items-center justify-between py-3 text-left text-xs uppercase tracking-[0.24em]"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && <div className="space-y-1 pb-2">{children}</div>}
    </div>
  );
}

export default ProductDetailsPage;
