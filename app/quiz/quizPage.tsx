import { Link, useNavigate } from "react-router";
import { useState } from "react";

import "../styles/styles.css";
import { StartQuiz } from "./startQuiz";
import { QuizQuestion } from "./quizQuestion";
import type { Question } from './Question';

export function QuizPage() {
    const navigate = useNavigate();

    const [ questions, setQuestions ] = useState<Question[]>([]);

    const [ answers, setAnswers ] = useState<String[]>([]);

    const [ lengthInputted, setLengthInputted ] = useState(false);

    const [ currentIndex, setCurrentIndex ] = useState(0);

    const nextQuestion = (selectedQuestion: string) => {
        setAnswers((previousAnswers) => {
            const updatedAnswers = [...previousAnswers];
            updatedAnswers[currentIndex] = selectedQuestion;
            return updatedAnswers;
        });
        setCurrentIndex((previous) => previous + 1);
    }

    const prevQuestion = () => {
        setCurrentIndex((previous) => previous > 0 ? previous - 1 : 0);
    }

    const startQuiz = (quizLength: number) => {
        setLengthInputted(true);

        fetch(`http://localhost:5000/api/quiz/${quizLength}`)
        .then((results) => results.json())
        .then((data) => setQuestions(data.questionList))
        .catch((error) => console.error("Error obtaining quiz: ", error));
    }

    const submitQuiz = (selectedQuestion: string) => {
        const finalAnswers = [...answers];
        finalAnswers[currentIndex] = selectedQuestion;

        fetch('http://localhost:5000/api/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions: questions,
                userAnswers: questions.map((question, index) => ({
                    id: index,
                    selected: finalAnswers[index] ?? ""
                }))
            })
        })
        .then((results) => results.json())
        .then((data) => {
            const iqScore = data.iqScore;
            const correctAnswerCount = data.correctAnswerCount;
            const totalQuestionCount = questions.length;
            const explanationText = data.explanationText;
            navigate('/results', {
                state: {
                    iqScore,
                    correctAnswerCount,
                    totalQuestionCount,
                    explanationText
                }
            });
        })
        .catch((error) => console.error("Error obtaining results: ", error));
    }

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
            <div className="quizArea">
                {lengthInputted && questions.length > 0 ?
                <QuizQuestion
                    question={questions[currentIndex]}
                    onNext={nextQuestion} onPrevious={prevQuestion} onSubmit={submitQuiz}
                    hasNext={currentIndex < questions.length - 1} hasPrevious={currentIndex > 0}
                /> : lengthInputted ? 
                <p>Please Wait</p> :
                <StartQuiz
                    handleSubmit={startQuiz}
                />}
            </div>
        </main>
    );

}