import { Link, useNavigate } from "react-router";
import { useState } from "react";
import "../styles/styles.css";
import { QuizQuestion } from "./quizQuestion";
import type { Question } from './Question';

const questions: Question[] = [
    {
    statement: "What is 5 + 5?",
    answers: ["10", "13", "3", "9"],
    correctAnswer: "10",
    correctQuestion: false
},
{
    statement: "What is 3 + 5?",
    answers: ["10", "8", "3", "9"],
    correctAnswer: "8",
    correctQuestion: false
},
{
    statement: "What is 1 + 5?",
    answers: ["10", "13", "6", "9"],
    correctAnswer: "6",
    correctQuestion: false
},
{
    statement: "What is 2 + 5?",
    answers: ["10", "13", "3", "7"],
    correctAnswer: "7",
    correctQuestion: false
}
];

export function QuizPage() {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextQuestion = () => {
        setCurrentIndex((previous) => previous + 1);
    }

    const prevQuestion = () => {
        setCurrentIndex((previous) => previous > 0 ? previous - 1 : 0);
    }

    const submitQuiz = () => {
        const iqScore = 0;
        const correctAnswerCount = questions.filter(question => question.correctQuestion).length;
        const totalQuestionCount = questions.length;
        const explanationText = "To be implemented";

        navigate('/results', {
            state: {
                iqScore,
                correctAnswerCount,
                totalQuestionCount,
                explanationText
            }
        });
    }

    return (
        <main>
            <div className="navBar">
                <>
                <Link to='/' className='navButton'>Home</Link>
                </>
            </div>
            <div className="quizArea">
                <QuizQuestion
                question={questions[currentIndex]}
                onNext={nextQuestion} onPrevious={prevQuestion} onSubmit={submitQuiz}
                hasNext={currentIndex < questions.length - 1} hasPrevious={currentIndex > 0}
                />
            </div>
        </main>
    );

}