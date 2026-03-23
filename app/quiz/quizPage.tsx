import { Link, useNavigate } from "react-router";
import { useState } from "react";

import "../styles/styles.css";
import { StartQuiz } from "./startQuiz";
import { QuizQuestion } from "./quizQuestion";
import type { Question } from './Question';

export function QuizPage() {
    const navigate = useNavigate();

    const [ questions, setQuestions ] = useState<Question[]>([]);

    const [ answers, setAnswers ] = useState<string[]>([]);

    const [ lengthInputted, setLengthInputted ] = useState(false);

    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

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
        setCurrentIndex(0);
        setAnswers([]);
        setIsSubmitting(false);

        fetch(`http://localhost:5000/api/quiz/${quizLength}`)
        .then((results) => results.json())
        .then((data) => setQuestions(data.questionList))
        .catch((error) => console.error("Error obtaining quiz: ", error));
    }

    const submitQuiz = (selectedQuestion: string) => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

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
        .catch((error) => console.error("Error obtaining results: ", error))
        .finally(() => setIsSubmitting(false));
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            <nav className="backdrop-blur-md bg-white/5 border-b border-white/10">
                <div className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
                    <Link
                        to="/"
                        className="text-xl font-bold tracking-wide hover:text-blue-400 transition"
                    >
                        IQ Test App
                    </Link>
                    <div className="flex gap-6 text-sm font-medium">
                        <Link to="/" className="text-gray-300 hover:text-white transition">
                            Home
                        </Link>
                    </div>

                </div>
            </nav>

            <div className="flex justify-center mt-16 px-4">
                <div className="w-full max-w-3xl">

                    {lengthInputted && questions.length > 0 ? (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
                            <QuizQuestion
                                key={questions[currentIndex].id ?? currentIndex}
                                question={questions[currentIndex]}
                                onNext={nextQuestion}
                                onPrevious={prevQuestion}
                                onSubmit={submitQuiz}
                                hasNext={currentIndex < questions.length - 1}
                                hasPrevious={currentIndex > 0}
                                selectedAnswer={answers[currentIndex] ?? ""}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                    ) : lengthInputted ? (
                        <div className="flex flex-col items-center mt-20 text-slate-400">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Generating your quiz...</p>
                        </div>

                    ) : (
                        <StartQuiz handleSubmit={startQuiz} />
                    )}

                </div>
            </div>
        </main>
    );

}
