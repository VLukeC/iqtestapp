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
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="flex justify-between items-center px-8 py-4">
                <Link to="/" className="text-white font-semibold text-lg">
                IQ Test App
                </Link>
                <div className="flex gap-6">
                    <Link to='/' className="text-gray-300 hover:text-white transition">Home</Link>
                </div>
            </div>

            <h1 className="text-center text-5xl font-bold mb-15 mt-10">
                Account Info
            </h1>

            {/* To center the box */}
            <div className="flex flex-col w-full items-center justify-center">
                {/* To create the column of items with a border */}
                <div className="flex flex-col w-fit h-fit rounded-xl border border-gray-200 mx-5 px-5 mb-10">
                    {/* Row */}
                    <div className="flex w-full items-center space-x-3">
                        {/* Email field */}
                        <div className="flex items-center py-3 space-x-1">
                            <span className="font-bold text-1xl">Email:</span>
                            {user && <span>{user.email}</span>}
                        </div>
                        {/* Change email button */}
                        <div className="flex ml-auto">
                            <button
                                onClick={handleChangeEmail}
                                className="min-w-12 h-fit bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white rounded-lg font-semibold shadow-lg px-2 py-1"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                    {/* Row */}
                    <div className="flex w-full items-center space-x-3">
                        {/* Password field */}
                        <div className="flex items-center py-3 space-x-1">
                            <span className="font-bold text-1xl">Password:</span>
                            {user && <span>●●●●●●</span>}
                        </div>
                        {/* Change password button */}
                        <div className="flex ml-auto">
                            <button
                                onClick={handleChangePassword}
                                className="min-w-12 h-fit bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white rounded-lg font-semibold shadow-lg px-2 py-1"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete account button */}
                {false &&
                    <div>
                        <button
                            className="min-w-12 h-fit bg-red-600 hover:bg-red-700 active:scale-95 transition text-white rounded-lg font-semibold shadow-lg px-2 py-1"
                            onClick={() => deleteAccount()}
                        >
                            Delete Account
                        </button>
                    </div>
                }

                <div className="flex flex-col w-full max-w-md rounded-xl border border-gray-200 mx-5 px-5 py-5">
                    <h2 className="text-2xl font-bold mb-4">Quiz Preferences</h2>
                    <label className="mb-3">
                        <span className="block mb-2 font-semibold">Preferred question count</span>
                        <input
                            type="number"
                            min={5}
                            max={50}
                            className="w-full border p-2 rounded"
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
                    <label className="mb-3">
                        <span className="block mb-2 font-semibold">Preferred category</span>
                        <select
                            className="w-full border p-2 rounded"
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
                    <label className="mb-4">
                        <span className="block mb-2 font-semibold">Preferred time limit (seconds)</span>
                        <input
                            type="number"
                            min={60}
                            max={7200}
                            step={60}
                            className="w-full border p-2 rounded"
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
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white rounded-lg font-semibold shadow-lg px-4 py-2 disabled:opacity-60"
                        disabled={preferencesLoading || preferencesSaving}
                        onClick={savePreferences}
                    >
                        {preferencesLoading ? "Loading..." : preferencesSaving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </div>


            {/* Popup */}
            {popupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Dim */}
                    <div className="fixed w-screen h-screen z-40 inset=0 bg-black opacity-50" onClick={() => setPopupOpen(false)}></div>

                    <div className="bg-grey p-6 rounded-xl shadow-2xl w-80 z-41">
                        <h2 className="text-lg font-bold mb-4">Enter New {popupType}</h2>
                        <input
                            type={popupType === "Email" ? "text" : "password"}
                            className="w-full border p-2 rounded mb-4 focus:outline-blue-500"
                            value={popupText}
                            onChange={(e) => setPopupText(e.target.value)}
                        />
                        <div className="flex justify-center gap-2">
                            <button onClick={() => setPopupOpen(false)} className="text-gray-500 px-3">Cancel</button>
                            <button onClick={() => submitPopup()} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );

}
