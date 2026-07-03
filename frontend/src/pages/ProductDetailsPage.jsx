import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import ProductGallery from "../components/ProductGallery";
import QuantitySelector from "../components/QuantitySelector";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import useCartStore from "../store/cartStore";
import { currency } from "../utils/currency";
import { useToast } from "../components/ToastContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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

  const completeLookProducts = useMemo(() => {
    const firstOutfit = product?.outfits?.[0]?.outfit;
    if (!firstOutfit) {
      return [];
    }
    return firstOutfit.products
      .map((item) => item.product)
      .filter((item) => item.id !== product.id);
  }, [product]);

  const addProduct = async () => {
    await addToCart(product.id, quantity);
    toast.push(`Added ${quantity} x ${product.name}`);
  };

  const buyCompleteOutfit = async () => {
    const firstOutfit = product?.outfits?.[0]?.outfit;
    if (!firstOutfit) {
      return;
    }
    for (const item of firstOutfit.products) {
      await addToCart(item.product.id, 1);
    }
    toast.push("Complete outfit added to cart");
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const stockStatus = product.stock > 0 ? "In Stock" : "Sold Out";

  return (
    <div className="space-y-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: product.name }
            ]}
          />
          <h1 className="text-2xl uppercase tracking-[0.12em]">{product.name}</h1>
          <p className="mt-2 text-lg">{currency(product.price)}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">{product.description}</p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em]">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`border px-3 py-2 text-xs uppercase tracking-[0.2em] ${
                      size === item ? "border-black bg-black text-white" : "border-zinc-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em]">Color</p>
              <div className="flex gap-2">
                {product.colors.map((item) => (
                  <button
                    key={item}
                    onClick={() => setColor(item)}
                    className={`border px-3 py-2 text-xs uppercase tracking-[0.2em] ${
                      color === item ? "border-black bg-black text-white" : "border-zinc-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.2em]">Stock Status: {stockStatus}</p>
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button onClick={addProduct}>Add to Cart</Button>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.25em]">Complete the Look</h2>
          <Button variant="outline" onClick={buyCompleteOutfit}>Buy Complete Outfit</Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completeLookProducts.map((entry) => (
            <ProductCard key={entry.id} product={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetailsPage;
