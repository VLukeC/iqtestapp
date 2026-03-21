import { Link } from "react-router";
import "../styles/styles.css";
import { QuizQuestion } from "./quizQuestion";
import type {Question} from './Question';

const q1: Question = {
    statement: "What is 5 + 5?",
    answers: ["10", "13", "3", "9"]
};

export function QuizPage() {
    return (
        <main>
            <div className="navBar">
                <>
                <Link to='/' className='navButton'>Home</Link>
                </>
            </div>
            <div className="quizArea">
                <QuizQuestion statement={q1.statement} answers={q1.answers}/>
            </div>
        </main>
    );

}