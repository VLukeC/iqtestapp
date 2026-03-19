import { Link } from "react-router";
import "../styles/styles.css";

export function HistoryPage() {
    return (
        <main>
            <div className="navBar">
                <>
                <Link to='/'className="navButton">Home</Link>
                <Link to='/account'className="navButton">Account</Link>
                <Link to='/quiz'className="navButton">Take Quiz</Link>
                </>
            </div>
        </main>
    );

}