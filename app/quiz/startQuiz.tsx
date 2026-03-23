import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";
import {
    getUserPreferences,
    type UserPreferences,
} from "../lib/database";

interface StartQuizProps {
    handleSubmit: (quizLength: number) => void
}

const defaultPreferences: UserPreferences = {
    preferredQuestionCount: 10,
    preferredCategory: "mixed",
    preferredTimeLimitSeconds: 900,
};

export function StartQuiz({ handleSubmit }: StartQuizProps) {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [preferencesLoading, setPreferencesLoading] = useState(true);
    const navigate = useNavigate();

    const initUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!user) {
            alert(error?.message);
            navigate("/");
        }
        else {
            setUser({ id: user.id, email: user.email });
            try {
                const loadedPreferences = await getUserPreferences(user.id);
                setPreferences(loadedPreferences);
                setQuizLength(loadedPreferences.preferredQuestionCount)
            }
            catch (preferencesError) {
                const message = preferencesError instanceof Error
                    ? preferencesError.message
                    : "Failed to load user preferences.";
                alert(message);
            }
            finally {
                setPreferencesLoading(false);
            }
        }
    }
    const [ quizLength, setQuizLength ] = useState(defaultPreferences.preferredQuestionCount);
    
    useEffect(() => {
        initUser()
    }, [])


    return (
        <div className="flex flex-col items-center text-center">

            <h2 className="text-3xl font-bold mb-2">
                Start Your Quiz
            </h2>

            <p className="text-slate-400 mb-8">
                Choose how many questions you want to answer
            </p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(quizLength);
                }}
                className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg space-y-6"
            >
                <div className="text-left">
                    <label className="block text-sm text-slate-400 mb-2">
                        Number of Questions
                    </label>

                    <input
                        name="quizLength"
                        type="number"
                        value={quizLength}
                        min="5"
                        max="30"
                        step="1"
                        onChange={(event) =>
                            setQuizLength(parseInt(event.target.value))
                        }
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="flex gap-2 justify-center">
                    {[5, 10, 15, 20].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setQuizLength(num)}
                            className={`px-3 py-1 rounded-lg text-sm transition
                            ${
                                quizLength === num
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/10 hover:bg-white/20 text-slate-300"
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30 active:scale-95"
                >
                    Start Quiz
                </button>
            </form>
        </div>
);
}