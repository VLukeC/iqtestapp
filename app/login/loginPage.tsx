import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router";
import { initializeUserData } from "../lib/database";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESULT:", { data, error });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Logged in!");

    navigate("/"); 
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
        <Link to="/signup" className="text-gray-300 hover:text-white transition">
          Signup
        </Link>
      </div>
    </div>

    <div className="flex justify-center items-center mt-20">
      <div className="bg-slate-800/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 border border-slate-700">
        
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Welcome Back
        </h1>

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
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            Login
          </button>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Start testing your IQ
        </p>
      </div>
    </div>
  </main>
);
}
