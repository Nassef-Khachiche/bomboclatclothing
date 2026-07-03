import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/client";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { currency } from "../utils/currency";

function AdminDashboardPage() {
  const { token, logout } = useAuthStore();
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: 1,
    outfitIds: "",
    newOutfitName: ""
  });
  const [outfitForm, setOutfitForm] = useState({ name: "", productIds: "" });

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const load = async () => {
      const [dashboardRes, ordersRes, customersRes, inventoryRes, productsRes, outfitsRes] = await Promise.all([
        api.get("/admin/dashboard", { headers }),
        api.get("/admin/orders", { headers }),
        api.get("/admin/customers", { headers }),
        api.get("/admin/inventory", { headers }),
        api.get("/products?pageSize=100", { headers }),
        api.get("/outfits", { headers })
      ]);

      setDashboard(dashboardRes.data);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setInventory(inventoryRes.data);
      setProducts(productsRes.data.items);
      setOutfits(outfitsRes.data);
    };

    load();
  }, [token, headers]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const createProduct = async (event) => {
    event.preventDefault();

    const existingOutfitIds = form.outfitIds
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item));

    const created = await api.post(
      "/products",
      {
        name: form.name,
        description: "Admin-created product",
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        sizes: ["S", "M", "L"],
        colors: ["Black", "White"],
        imageUrls: [
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
        ],
        outfitIds: existingOutfitIds
      },
      { headers }
    );

    if (form.newOutfitName.trim()) {
      await api.post(
        "/outfits",
        {
          name: form.newOutfitName,
          description: "Admin-created outfit",
          heroImage:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
          productIds: [created.data.id]
        },
        { headers }
      );
    }

    setOpenModal(false);
    const productsRes = await api.get("/products?pageSize=100");
    const outfitsRes = await api.get("/outfits", { headers });
    setProducts(productsRes.data.items);
    setOutfits(outfitsRes.data);
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`, { headers });
    setProducts((current) => current.filter((entry) => entry.id !== id));
  };

  const updateStatus = async (orderNumber, status) => {
    await api.put(`/orders/${orderNumber}/status`, { status }, { headers });
    const ordersRes = await api.get("/admin/orders", { headers });
    setOrders(ordersRes.data);
  };

  const createOutfit = async (event) => {
    event.preventDefault();

    const productIds = outfitForm.productIds
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item));

    await api.post(
      "/outfits",
      {
        name: outfitForm.name,
        description: "Admin outfit",
        heroImage:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
        productIds
      },
      { headers }
    );

    const outfitsRes = await api.get("/outfits", { headers });
    setOutfits(outfitsRes.data);
    setOutfitForm({ name: "", productIds: "" });
  };

  const deleteOutfit = async (id) => {
    await api.delete(`/outfits/${id}`, { headers });
    setOutfits((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-sm uppercase tracking-[0.24em]">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenModal(true)}>Create Product</Button>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={dashboard?.totals.products || 0} />
        <StatCard label="Outfits" value={dashboard?.totals.outfits || 0} />
        <StatCard label="Orders" value={dashboard?.totals.orders || 0} />
        <StatCard label="Customers" value={dashboard?.totals.customers || 0} />
      </section>

      <section>
        <h2 className="mb-4 text-xs uppercase tracking-[0.2em]">Products (Create / Edit / Delete)</h2>
        <div className="overflow-auto border border-zinc-200">
          <table className="min-w-full text-left text-sm">
            <thead><tr className="border-b"><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Action</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{currency(product.price)}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <Button variant="outline" onClick={() => deleteProduct(product.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs uppercase tracking-[0.2em]">Orders (Update Status)</h2>
        <div className="space-y-3">
          {orders.slice(0, 12).map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 border border-zinc-200 p-3">
              <p className="text-xs uppercase tracking-[0.16em]">{order.orderNumber} - {order.customerName}</p>
              <div className="flex items-center gap-2">
                <select
                  className="border border-zinc-300 px-2 py-2 text-xs"
                  value={order.status}
                  onChange={(event) => updateStatus(order.orderNumber, event.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.2em]">Outfits (Create / Edit / Delete)</h2>
        <form className="grid gap-2 md:grid-cols-[1fr_1fr_auto]" onSubmit={createOutfit}>
          <input
            className="border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Outfit Name"
            required
            value={outfitForm.name}
            onChange={(e) => setOutfitForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Product IDs (comma-separated)"
            required
            value={outfitForm.productIds}
            onChange={(e) => setOutfitForm((prev) => ({ ...prev, productIds: e.target.value }))}
          />
          <Button type="submit">Create Outfit</Button>
        </form>

        <div className="overflow-auto border border-zinc-200">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Products</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {outfits.map((outfit) => (
                <tr key={outfit.id} className="border-b">
                  <td className="p-3">{outfit.name}</td>
                  <td className="p-3">{outfit.products?.length || 0}</td>
                  <td className="p-3">
                    <Button variant="outline" onClick={() => deleteOutfit(outfit.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Panel title="Customers" items={customers.map((customer) => `${customer.name} (${customer.orders} orders)`).slice(0, 8)} />
        <Panel title="Collections" items={outfits.map((outfit) => outfit.name).slice(0, 8)} />
        <Panel title="Inventory" items={inventory.map((item) => `${item.name} - ${item.stock}`).slice(0, 8)} />
      </section>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Create Product">
        <form className="space-y-3" onSubmit={createProduct}>
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Name" required onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Price" required onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Stock" required onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Category ID" required onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Existing Outfit IDs (comma-separated)" onChange={(e) => setForm((p) => ({ ...p, outfitIds: e.target.value }))} />
          <input className="w-full border border-zinc-300 px-3 py-2 text-sm" placeholder="Or Create New Outfit Name" onChange={(e) => setForm((p) => ({ ...p, newOutfitName: e.target.value }))} />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="border border-zinc-200 p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl">{value}</p>
    </article>
  );
}

function Panel({ title, items }) {
  return (
    <article className="border border-zinc-200 p-4">
      <h3 className="mb-3 text-xs uppercase tracking-[0.2em]">{title}</h3>
      <div className="space-y-2 text-sm text-zinc-600">
        {items.map((item) => <p key={item}>{item}</p>)}
      </div>
    </article>
  );
}

export default AdminDashboardPage;
