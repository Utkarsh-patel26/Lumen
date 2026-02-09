import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { authApi } from "../services/api/authApi.js";
import { useAuthStore } from "../store/authStore.js";
import { useUiStore } from "../store/uiStore.js";
import useAuthRedirect from "../hooks/useAuthRedirect.js";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    role: "student"
  });
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
      await authApi.signup({
        name: form.name,
        email: form.email,
        password: form.password,
        age: Number(form.age),
        role: form.role
      });

      const loginData = await authApi.login({ email: form.email, password: form.password });
      loginStore({ token: loginData.token, role: loginData.role, user: loginData.user });
      addToast({ title: "Account created" });
    } catch (err) {
      addToast({ title: "Signup failed", message: "Please check the form." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Start your journey</h2>
          <p className="text-sm text-slate-300">Create your student or admin workspace.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Full name"
            name="name"
            placeholder="Alex Rivera"
            value={form.name}
            onChange={onChange}
            required
          />
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
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Age"
              name="age"
              type="number"
              placeholder="22"
              value={form.age}
              onChange={onChange}
              required
            />
            <label className="block text-sm text-slate-200">
              <span className="mb-2 block font-medium">Role</span>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <Button className="w-full" size="lg" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-slate-400">
          Already onboard? <Link to="/login" className="text-emerald-200">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
