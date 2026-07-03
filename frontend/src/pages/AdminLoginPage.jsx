import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bomboclat.com");
  const [password, setPassword] = useState("admin12345");
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/admin/login", { email, password });
      setAuth(data);
      navigate("/admin");
    } catch (requestError) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="mx-auto max-w-md border border-zinc-200 p-6">
      <h1 className="mb-5 text-sm uppercase tracking-[0.25em]">Admin Login</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full border border-zinc-300 px-3 py-2 text-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border border-zinc-300 px-3 py-2 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
