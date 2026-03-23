import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import "../styles/styles.css";
import { supabase } from "../supabase";

export function IndexPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        document.title = "IQ Test App";

        const session = supabase.auth.getSession();

        session.then(({ data }: { data: { session: Session | null } }) => {
            setUser(data.session?.user ?? null);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
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
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">


            <nav className="flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
                <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
                    IQ Test App
                </Link>

                <div className="flex items-center gap-8 text-sm font-medium">
                    {user && (
                        <Link to="/history" className="text-gray-300 hover:text-white transition">
                            History
                        </Link>
                    )}

                    {user && <Link to="/quiz" className="text-gray-300 hover:text-white transition">
                        Take Quiz
                    </Link>}

                    {user && (
                        <Link to="/account" className="text-gray-300 hover:text-white transition">
                            Account
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            <section className="flex flex-col items-center justify-center text-center px-6 mt-32">
                <h1 className="text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Test Your Intelligence
                </h1>

                <p className="mt-6 text-lg text-gray-400 max-w-2xl">
                    A smart, AI-powered IQ testing platform that generates unique challenges,
                    tracks your performance, and helps you improve over time. Create an account to begin!
                </p>

                <div className="flex gap-4 mt-10">
                    {user && <Link
                        to="/quiz"
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30"
                    >
                        Start Quiz
                    </Link>}

                    {!user && (
                        <Link
                            to="/login"
                            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
                        >
                            Create Account
                        </Link>
                    )}
                </div>
            </section>

            <section className="mt-32 px-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    {
                        title: "AI Generated Tests",
                        desc: "Every quiz is unique and adapts to your level.",
                    },
                    {
                        title: "Track Progress",
                        desc: "View your history and see improvement over time.",
                    },
                    {
                        title: "Challenge Yourself",
                        desc: "Push your limits with increasingly difficult questions.",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition"
                    >
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                ))}
            </section>
        </main>
    );
}
