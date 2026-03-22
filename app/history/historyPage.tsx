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
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="flex justify-between items-center px-8 py-4">
                <Link to="/" className="text-white font-semibold text-lg">
                IQ Test App
                </Link>
                <div className="flex gap-6">
                    <Link to='/'className="text-gray-300 hover:text-white transition">Home</Link>
                    <Link to='/account'className="text-gray-300 hover:text-white transition">Account</Link>
                    <Link to='/quiz'className="text-gray-300 hover:text-white transition">Take Quiz</Link>
                </div>
            </div>

            <section className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">Saved Results</h1>
                    <p className="text-slate-300 mt-3">
                        Review your previous IQ test attempts and compare the stored scores.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-slate-300">
                        Loading quiz history...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
                        {error}
                    </div>
                ) : results.length === 0 ? (
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-slate-300">
                        No saved results yet. Finish a quiz while logged in to populate this page.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60">
                        <div className="grid grid-cols-[1.2fr_0.7fr_0.8fr_2fr] gap-4 border-b border-slate-700 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
                            <span>Date</span>
                            <span>IQ Score</span>
                            <span>Test Score</span>
                            <span>Explanation</span>
                        </div>
                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="grid grid-cols-[1.2fr_0.7fr_0.8fr_2fr] gap-4 border-b border-slate-800 px-6 py-5 text-sm text-slate-200 last:border-b-0"
                            >
                                <span>{new Date(result.createdAt).toLocaleString()}</span>
                                <span className="font-semibold">{result.iqScore}</span>
                                <span>
                                    {result.correctAnswerCount}/{result.totalQuestionCount}
                                </span>
                                <span className="text-slate-300">{result.explanationText}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );

}
