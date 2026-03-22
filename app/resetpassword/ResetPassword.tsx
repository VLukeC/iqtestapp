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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-white font-semibold text-lg">
          IQ Test App
        </h1>
      </div>

      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-slate-800/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 border border-slate-700">

          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Reset Password
          </h1>

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm text-center mt-3">
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
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            Update Password
          </button>

        </div>
      </div>
    </main>
  );
}