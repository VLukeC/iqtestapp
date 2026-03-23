import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../styles/styles.css";
import { supabase } from "../supabase";
import { saveQuizResult } from "../lib/database";

interface ResultProps {
    iqScore: number;
    correctAnswerCount: number;
    totalQuestionCount: number;
    explanationText: string;
}

export function ResultsPage({ iqScore, correctAnswerCount, totalQuestionCount, explanationText }: ResultProps) {
    const [saveMessage, setSaveMessage] = useState("Save pending.");
    const hasAttemptedSave = useRef(false);
    const scorePercent = Math.round((correctAnswerCount / totalQuestionCount) * 100);

    useEffect(() => {
        const persistResult = async () => {
            if (hasAttemptedSave.current) {
                return;
            }

            hasAttemptedSave.current = true;

            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                setSaveMessage("Log in to save this result.");
                return;
            }

            try {
                await saveQuizResult(data.user.id, {
                    iqScore,
                    correctAnswerCount,
                    totalQuestionCount,
                    explanationText,
                });
                setSaveMessage("Result saved to your account.");
            }
            catch (saveError) {
                const message = saveError instanceof Error
                    ? saveError.message
                    : "Failed to save result.";
                setSaveMessage(message);
            }
        };

        persistResult();
    }, [correctAnswerCount, explanationText, iqScore, totalQuestionCount]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            <nav className="flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
                <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
                    IQ Test App
                </Link>

                <div className="flex gap-8 text-sm font-medium">
                    <Link to="/" className="text-gray-300 hover:text-white transition">
                        Home
                    </Link>
                </div>
            </nav>

            <section className="mx-auto mt-20 max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl px-8 py-12 shadow-2xl text-center">

                <p className="text-xs uppercase tracking-widest text-slate-400">
                    Quiz Summary
                </p>

                <h1 className="text-5xl font-extrabold mt-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    IQ {iqScore}
                </h1>

                <div className="grid grid-cols-2 gap-6 mt-10">

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <p className="text-sm text-slate-400">Score</p>
                        <p className="text-2xl font-bold text-blue-400">
                            {correctAnswerCount}/{totalQuestionCount}
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <p className="text-sm text-slate-400">Accuracy</p>
                        <p className="text-2xl font-bold text-purple-400">
                            {scorePercent}%
                        </p>
                    </div>
                </div>

                <p className="mt-10 max-w-2xl mx-auto text-slate-300 leading-relaxed">
                    {explanationText}
                </p>

                {saveMessage && (
                    <p className="mt-6 text-sm text-green-400">
                        {saveMessage}
                    </p>
                )}

                <div className="mt-10">
                    <Link to="/">
                        <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30 active:scale-95">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </section>
        </main>
);

}
