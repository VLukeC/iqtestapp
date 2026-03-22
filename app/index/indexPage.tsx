import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "../styles/styles.css";
import { supabase } from "../supabase";

export function IndexPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const session = supabase.auth.getSession();

        session.then(({ data }) => {
            setUser(data.session?.user ?? null);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/");
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="flex justify-between items-center px-8 py-4">
                <Link to="/" className="text-white font-semibold text-lg">
                IQ Test App
                </Link>
                <div className="flex gap-6">
                    <Link to="/history" className="text-gray-300 hover:text-white transition">History</Link>
                    <Link to="/quiz" className="text-gray-300 hover:text-white transition">Take Quiz</Link>
                    {user && <Link to="/account" className="text-gray-300 hover:text-white transition">Account</Link>}
                    {user ? (
                    <button onClick={handleLogout} className="text-gray-300 hover:text-white transition cursor-pointer">
                        Logout
                    </button>
                    ) : (
                    <Link to="/login" className="text-gray-300 hover:text-white transition">
                        Login/Register
                    </Link>
                )}
                </div>
            </div>

            <div>
                <h1 className="text-5xl font-bold text-center mt-20">
                    IQ Test App
                </h1>
                <p className="text-center mt-5">
                    An LLM based web application for procedurally generating IQ tests,
                    keeping track of test history, and more!
                </p>
            </div>
        </main>
    );
}
