import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase";


export function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [popupType, setPopupType] = useState("Email");
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupText, setPopupText] = useState("");
    const navigate = useNavigate();

    const initUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!user) {
            alert(error?.message);
            navigate("/");
        }
        else {
            setUser(user);
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

    useEffect(() => {
        initUser()
    }, [])

    return (
        <main>
            <div className="navBar">
                <>
                    <Link to='/' className='navButton'>Home</Link>
                </>
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
