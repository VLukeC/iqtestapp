import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router";
import { initializeUserData } from "../lib/database";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        navigate("/");
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESULT:", { data, error });

    if (error) {
      setError(error.message);
      return;
    }


    navigate("/"); 
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
      // TODO: Change URL to real hosting
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the reset link.");
    }
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
            to="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Signup
          </Link>
        </div>
      </nav>

      <div className="flex justify-center items-center mt-24 px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/10">

          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>

          <p className="text-center text-slate-400 mb-8 text-sm">
            Sign in to continue your IQ journey
          </p>

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
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30 active:scale-95"
          >
            Login
          </button>

          {error && (
            <p className="text-center text-red-400 text-sm mt-4">
              {error}
            </p>
          )}

          {message && (
            <p className="text-center text-green-400 text-sm mt-3">
              {message}
            </p>
          )}

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-400 text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </p>

            <button
              onClick={handleForgotPassword}
              className="text-blue-400 text-sm hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            Start testing your IQ 🚀
          </p>
        </div>
      </div>
    </main>
  );

}
