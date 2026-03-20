import { Link } from "react-router";
import "../styles/styles.css";

// TODO: add conditonal that checks if user in logged in before displaying account
export function IndexPage() {
    return (
        <main>
            <div className="navBar">
                <>
                    <Link to='/history' className="navButton">History</Link>
                    <Link to='/account' className="navButton">Account</Link>
                    <Link to='/login' className="navButton">Login/Register</Link>
                    <Link to='/quiz' className="navButton">Take Quiz</Link>
                </>
            </div>
            <div>
                <h1 className="text-5xl font-bold text-center mt-20">
                    IQ Test App
                </h1>
                <p className="text-center mt-5">
                    An LLM based web application for procedurally generating IQ tests, keeping track of test history, and more!
                </p>
            </div>
        </main>
    )
}
