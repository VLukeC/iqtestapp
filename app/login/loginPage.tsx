import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router";

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
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("Signed up:", data.user);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
