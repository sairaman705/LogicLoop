import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signupApi(form);
      login(res.data.token, res.data.user);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-slate-400 text-sm mb-8">
          Join LogicLoop — your AI news companion
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm mb-1.5 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 text-sm placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 text-sm placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              required
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 text-sm placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-slate-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
