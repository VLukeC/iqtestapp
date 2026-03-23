import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../styles/styles.css";
import { supabase } from "../supabase";
import { getQuizResults, type QuizResultRecord } from "../lib/database";

export function HistoryPage() {
    const [results, setResults] = useState<QuizResultRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadResults = async () => {
            const { data, error: authError } = await supabase.auth.getUser();

            if (authError || !data.user) {
                setError("Log in to view saved quiz results.");
                setLoading(false);
                return;
            }

            try {
                const storedResults = await getQuizResults(data.user.id);
                setResults(storedResults);
            }
            catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load quiz history."
                );
            }
            finally {
                setLoading(false);
            }
        };

        loadResults();
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* NAVBAR */}
            <nav className="flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
                <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
                    IQ Test App
                </Link>

                <div className="flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
                    <Link to="/quiz" className="text-gray-300 hover:text-white transition">Take Quiz</Link>
                    <Link to="/account" className="text-gray-300 hover:text-white transition">Account</Link>
                </div>
            </nav>

            <section className="max-w-6xl mx-auto px-6 py-16">

                <div className="mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Saved Results
                    </h1>
                    <p className="text-slate-400 mt-4 max-w-xl">
                        Review your previous IQ test attempts and track your improvement over time.
                    </p>
                </div>
                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-slate-300 animate-pulse">
                        Loading quiz history...
                    </div>

                ) : error ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
                        {error}
                    </div>

                ) : results.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-slate-300">
                        No saved results yet. Finish a quiz while logged in to populate this page.
                    </div>

                ) : (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">

                        <div className="grid grid-cols-[1.3fr_0.7fr_0.9fr_2fr] gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <span>Date</span>
                            <span>IQ</span>
                            <span>Score</span>
                            <span>Explanation</span>
                        </div>

                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="grid grid-cols-[1.3fr_0.7fr_0.9fr_2fr] gap-4 px-6 py-5 text-sm text-slate-200 border-b border-white/5 last:border-none hover:bg-white/5 transition"
                            >
                                <span className="text-slate-400">
                                    {new Date(result.createdAt).toLocaleString()}
                                </span>

                                <span className="font-bold text-blue-400">
                                    {result.iqScore}
                                </span>

                                <span className="text-purple-400 font-medium">
                                    {result.correctAnswerCount}/{result.totalQuestionCount}
                                </span>

                                <span className="text-slate-300 leading-relaxed">
                                    {result.explanationText}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );

}
