import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";
import {
    getUserPreferences,
    updateUserPreferences,
    type UserPreferences,
} from "../lib/database";

const defaultPreferences: UserPreferences = {
    preferredQuestionCount: 10,
    preferredCategory: "mixed",
    preferredTimeLimitSeconds: 900,
};

export function AccountPage() {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [popupType, setPopupType] = useState("Email");
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [preferencesLoading, setPreferencesLoading] = useState(true);
    const [preferencesSaving, setPreferencesSaving] = useState(false);
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

    const handleChangeEmail = () => {
        setPopupType("Email");
        setPopupOpen(true);
    }

    const handleChangePassword = () => {
        setPopupType("Password");
        setPopupOpen(true);
    }

    const logoutUser = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert(`Failed to logout: ${error.message}`);
        }

        navigate("/login");
    }

    const updateEmail = async (newEmail: string) => {
        const { error } = await supabase.auth.updateUser({
            email: newEmail
        })

        if (error) {
            alert(error.message);
        }
        else {
            alert("Check old and new email addresses for confirmation before logging back in.");
            logoutUser();
        }

    }

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            alert(`Failed to update password: ${error.message}`);
        }
        else {
            alert("Password successfully updated!");
            logoutUser();
        }

    }

    const submitPopup = () => {
        if (popupType === "Email") {
            updateEmail(popupText);
        }
        else if (popupType === "Password") {
            updatePassword(popupText);
        }
        else {
            alert("Invalid program state!");
        }
    }

    const deleteAccount = () => {
        // Needs external support (might not be implemented)
    }

    const savePreferences = async () => {
        if (!user) {
            return;
        }

        setPreferencesSaving(true);

        try {
            await updateUserPreferences(user.id, preferences);
            alert("Preferences saved.");
        }
        catch (preferencesError) {
            const message = preferencesError instanceof Error
                ? preferencesError.message
                : "Failed to save preferences.";
            alert(message);
        }
        finally {
            setPreferencesSaving(false);
        }
    }

    useEffect(() => {
        initUser()
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            <nav className="flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/5 border-b border-white/10">
                <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
                    IQ Test App
                </Link>

                <div className="flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
                    <Link to="/quiz" className="text-gray-300 hover:text-white transition">Take Quiz</Link>
                    <button
                        onClick={logoutUser}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="text-center mt-16">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Account Settings
                </h1>
                <p className="text-slate-400 mt-3">
                    Manage your account and personalize your quiz experience
                </p>
            </div>

            <div className="flex flex-col items-center mt-12 px-6 gap-10">

                <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg">

                    <h2 className="text-xl font-semibold mb-4">Account Info</h2>

                    <div className="flex items-center justify-between py-3 border-b border-white/10">
                        <div>
                            <p className="text-sm text-slate-400">Email</p>
                            <div>
                                {user === null || user.email === null ? (
                                    <p className="text-slate-500">Loading...</p>
                                ) : (
                                    <p className="font-medium">{user.email}</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleChangeEmail}
                            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white transition"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm text-slate-400">Password</p>
                            <p className="font-medium">••••••••</p>
                        </div>

                        <button
                            onClick={handleChangePassword}
                            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white transition"
                        >
                            Edit
                        </button>
                    </div>
                </div>

                <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg">

                    <h2 className="text-xl font-semibold mb-6">Quiz Preferences</h2>

                    <label className="block mb-5">
                        <span className="block text-sm text-slate-400 mb-2">
                            Preferred question count
                        </span>
                        <input
                            type="number"
                            min={5}
                            max={50}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={preferences.preferredQuestionCount}
                            disabled={preferencesLoading || preferencesSaving}
                            onChange={(e) =>
                                setPreferences((current) => ({
                                    ...current,
                                    preferredQuestionCount: Number(e.target.value),
                                }))
                            }
                        />
                    </label>

                    <label className="block mb-5">
                        <span className="block text-sm text-slate-400 mb-2">
                            Preferred category
                        </span>
                        <select
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={preferences.preferredCategory}
                            disabled={preferencesLoading || preferencesSaving}
                            onChange={(e) =>
                                setPreferences((current) => ({
                                    ...current,
                                    preferredCategory: e.target.value,
                                }))
                            }
                        >
                            <option value="mixed">Mixed</option>
                            <option value="logic">Logic</option>
                            <option value="numerical">Numerical</option>
                            <option value="verbal">Verbal</option>
                            <option value="spatial">Spatial</option>
                        </select>
                    </label>

                    <label className="block mb-6">
                        <span className="block text-sm text-slate-400 mb-2">
                            Preferred time limit (seconds)
                        </span>
                        <input
                            type="number"
                            min={60}
                            max={7200}
                            step={60}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={preferences.preferredTimeLimitSeconds}
                            disabled={preferencesLoading || preferencesSaving}
                            onChange={(e) =>
                                setPreferences((current) => ({
                                    ...current,
                                    preferredTimeLimitSeconds: Number(e.target.value),
                                }))
                            }
                        />
                    </label>

                    <button
                        type="button"
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/30 disabled:opacity-60"
                        disabled={preferencesLoading || preferencesSaving}
                        onClick={savePreferences}
                    >
                        {preferencesLoading
                            ? "Loading..."
                            : preferencesSaving
                                ? "Saving..."
                                : "Save Preferences"}
                    </button>
                </div>
            </div>

            {popupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">

                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setPopupOpen(false)}
                    ></div>

                    <div className="relative bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-80 z-10">
                        <h2 className="text-lg font-bold mb-4">
                            Enter New {popupType}
                        </h2>

                        <input
                            type={popupType === "Email" ? "text" : "password"}
                            className="w-full bg-white/5 border border-white/10 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={popupText}
                            onChange={(e) => setPopupText(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setPopupOpen(false)}
                                className="text-slate-400 hover:text-white transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitPopup}
                                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );

}
