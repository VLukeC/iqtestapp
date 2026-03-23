import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSessionFromUrl = async () => {
        await supabase.auth.getSession();
    };

    getSessionFromUrl();
    }, []);

  const handleReset = async () => {
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <nav className="flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">
          IQ Test App
        </h1>
      </nav>

      <div className="flex justify-center items-center min-h-[85vh] px-4">

        <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/10">

          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Reset Password
          </h1>

          <p className="text-center text-slate-400 mb-8 text-sm">
            Enter your new password below
          </p>

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm text-center mt-4">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-400 text-sm text-center mt-3">
              {message}
            </p>
          )}

          <button
            onClick={handleReset}
            className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30 active:scale-95"
          >
            Update Password
          </button>

          <p className="text-center text-slate-500 text-xs mt-6">
            Make sure your password is secure 🔒
          </p>

        </div>
      </div>
    </main>
  );
}