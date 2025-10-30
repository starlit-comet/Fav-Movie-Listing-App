import { useState } from "react";
import AuthCard from "../../components/auth/AuthCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormField from "../../components/ui/FormField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data?.message || "Login failed");
        return;
      }
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
      window.location.hash = "#/";
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 p-4">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to continue"
        footer={
          <span>
            New here? {" "}
            <a className="font-semibold text-indigo-600 hover:underline" href="#/signup">
              Create an account
            </a>
          </span>
        }
      >
        <form onSubmit={onSubmit} className="space-y-3">
          {error ? (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          ) : null}
          <FormField label="Email">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Password">
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField>
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}
