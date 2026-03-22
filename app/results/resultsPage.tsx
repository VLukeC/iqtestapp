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
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="navBar">
                <Link to="/" className="text-white font-semibold text-lg">
                IQ Test App
                </Link>
                <div className="flex gap-6">
                    <Link to='/' className="text-gray-300 hover:text-white transition">Home</Link>
                </div>
            </div>

            <section className="mx-auto mt-16 max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/60 px-8 py-10 text-center shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Quiz Summary
                </p>
                <h1 className="text-5xl font-bold text-center mt-6">
                    IQ Score: {iqScore}
                </h1>
                <h2 className="text-3xl font-bold text-center mt-10">
                    Test Score: {correctAnswerCount}/{totalQuestionCount}
                </h2>
                <p className="mt-4 text-slate-300">
                    Accuracy: {scorePercent}%
                </p>
                <p className="mx-auto mt-10 max-w-2xl text-center leading-7 text-slate-200">
                    {explanationText}
                </p>
                <p className="text-center mt-6 text-sm text-gray-500">
                    {saveMessage}
                </p>
            </section>

            <div className="flex justify-center items-center mt-20">
                <Link to="/">
                    <button type="button" className="transition px-6 py-2 rounded-lg bg-[#214f4b] hover:bg-[#1a3f3c]">
                        Finish
                    </button>
                </Link>
            </div>
        </main>
    );

}
