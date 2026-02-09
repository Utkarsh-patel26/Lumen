import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { authApi } from "../services/api/authApi.js";
import { useAuthStore } from "../store/authStore.js";
import { useUiStore } from "../store/uiStore.js";
import useAuthRedirect from "../hooks/useAuthRedirect.js";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const loginStore = useAuthStore((state) => state.login);
  const addToast = useUiStore((state) => state.addToast);

  useAuthRedirect();

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({ email: form.email, password: form.password });
      loginStore({ token: data.token, role: data.role, user: data.user });
      addToast({ title: "Welcome back" });
    } catch (err) {
      addToast({ title: "Login failed", message: "Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="text-sm text-slate-300">Log in to reach your dashboard.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@studio.com"
            value={form.email}
            onChange={onChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={onChange}
            required
          />
          <Button className="w-full" size="lg" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-sm text-slate-400">
          New here? <Link to="/signup" className="text-emerald-200">Create an account</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
