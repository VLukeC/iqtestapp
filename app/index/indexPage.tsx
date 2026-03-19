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
        </main>
    )
}