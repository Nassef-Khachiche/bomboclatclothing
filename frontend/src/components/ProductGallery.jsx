import { useState } from "react";

function ProductGallery({ images = [] }) {
  const [active, setActive] = useState(0);
  const image = images[active]?.url || images[0]?.url;

  return (
    <div className="space-y-3">
      <img src={image} alt="Product" className="h-[460px] w-full object-cover" loading="lazy" />
      <div className="grid grid-cols-4 gap-2">
        {images.map((item, index) => (
          <button key={item.id || index} onClick={() => setActive(index)}>
            <img src={item.url} alt="thumb" className="h-20 w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
