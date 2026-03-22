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
        <main>
            <div className="navBar">
                <>
                    <Link to='/' className='navButton'>Home</Link>
                </>
            </div>

            <div>
                <h1 className="text-5xl font-bold text-center mt-20">
                    IQ Score: {iqScore}
                </h1>
                <h2 className="text-3xl font-bold text-center mt-10">
                    Test Score: {correctAnswerCount}/{totalQuestionCount}
                </h2>
                <p className="text-center mt-20">
                    {explanationText}
                </p>
                <p className="text-center mt-6 text-sm text-gray-500">
                    {saveMessage}
                </p>
            </div>

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
