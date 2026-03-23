import { useState } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    console.log("User:", data.user);

    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <nav className="flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
          IQ Test App
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            Home
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="flex justify-center items-center mt-24 px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/10">

          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Create Account
          </h1>

          <p className="text-center text-slate-400 mb-8 text-sm">
            Start your IQ journey today 🚀
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold shadow-lg shadow-green-600/30 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </main>
  );

}