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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <div className="flex justify-between items-center px-8 py-4">
        <Link to="/" className="text-white font-semibold text-lg">
          IQ Test App
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            Home
          </Link>
          <Link to="/login" className="text-gray-300 hover:text-white transition">
            Login
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center mt-16">
        <div className="bg-slate-800/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-[380px] border border-slate-700">

          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Create Account
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">


            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
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