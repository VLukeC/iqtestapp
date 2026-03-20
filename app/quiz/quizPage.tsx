import { Link } from "react-router";
import "../styles/styles.css";
import { QuizQuestion } from "./quizQuestion";

export function QuizPage() {
    return (
        <main>
            <div className="navBar">
                <>
                <Link to='/' className='navButton'>Home</Link>
                </>
            </div>
            <div className="quizArea">
            </div>
        </main>
    );

}