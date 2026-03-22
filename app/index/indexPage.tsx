import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "../styles/styles.css";
import { supabase } from "../supabase";

export function IndexPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const session = supabase.auth.getSession();

        session.then(({ data }) => {
            setUser(data.session?.user ?? null);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
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
        <main>
            <div className="navBar">
                <Link to="/history" className="navButton">History</Link>
                <Link to="/quiz" className="navButton">Take Quiz</Link>
                {user && <Link to="/account" className="navButton">Account</Link>}
                {user ? (
                    <button onClick={handleLogout} className="navButton">
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="navButton">
                        Login/Register
                    </Link>
                )}
            </div>

            <div>
                <h1 className="text-5xl font-bold text-center mt-20">
                    IQ Test App
                </h1>
                <p className="text-center mt-5">
                    An LLM based web application for procedurally generating IQ tests,
                    keeping track of test history, and more!
                </p>
            </div>
        </main>
    );
}
