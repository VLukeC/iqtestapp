import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";

import "../styles/styles.css";
import { StartQuiz } from "./startQuiz";
import { QuizQuestion } from "./quizQuestion";
import type { Question } from './Question';

export function QuizPage() {
    const navigate = useNavigate();

    const [ questions, setQuestions ] = useState<Question[]>([]);

    const [ answers, setAnswers ] = useState<string[]>([]);

    const answersRef = useRef<string[]>([]);

    const [ lengthInputted, setLengthInputted ] = useState(false);

    const [ currentIndex, setCurrentIndex ] = useState(0);

    const [ timeLimitSeconds, setTimeLimitSeconds ] = useState(0);

    const [ timeRemaining, setTimeRemaining ] = useState(0);

    const quizStartTime = useRef<number | null>(null);

    const nextQuestion = (selectedQuestion: string) => {
        setAnswers((previousAnswers) => {
            const updatedAnswers = [...previousAnswers];
            updatedAnswers[currentIndex] = selectedQuestion;
            answersRef.current = updatedAnswers;
            return updatedAnswers;
        });
        setCurrentIndex((previous) => previous + 1);
    }

    const prevQuestion = () => {
        setCurrentIndex((previous) => previous > 0 ? previous - 1 : 0);
    }

    const startQuiz = (quizLength: number, timeLimit: number) => {
        setLengthInputted(true);
        setCurrentIndex(0);
        setAnswers([]);
        answersRef.current = [];
        setTimeLimitSeconds(timeLimit);
        setTimeRemaining(timeLimit);
        quizStartTime.current = null;

        fetch(`http://localhost:5000/api/quiz/${quizLength}`)
        .then((results) => results.json())
        .then((data) => setQuestions(data.questionList))
        .catch((error) => console.error("Error obtaining quiz: ", error));
    }

    useEffect(() => {
        if (questions.length === 0) return;

        // record when quiz starts
        if (!quizStartTime.current) {
            quizStartTime.current = Date.now();
        }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    
                    // auto submit when timer runs out
                    const timeTaken = quizStartTime.current
                        ? Math.round((Date.now() - quizStartTime.current) / 1000)
                        : timeLimitSeconds;
                    fetch('http://localhost:5000/api/results', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            questions,
                            userAnswers: questions.map((q, i) => ({
                                id: i,
                                selected: answersRef.current[i] ?? ""
                            })),
                            timeTakenSeconds: timeTaken,
                            timeLimitSeconds,
                        })
                    })
                    .then((r) => r.json())
                    .then((data) => {
                        navigate('/results', {
                            state: {
                                iqScore: data.iqScore,
                                correctAnswerCount: data.correctAnswerCount,
                                totalQuestionCount: questions.length,
                                explanationText: data.explanationText,
                                timeRanOut: true,
                            }
                        });
                    })
                    .catch((error) => console.error("Auto-submit error: ", error));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [questions]);

    const submitQuiz = (selectedQuestion: string) => {
        const finalAnswers = [...answers];
        finalAnswers[currentIndex] = selectedQuestion;

        const timeTakenSeconds = quizStartTime.current
            ? Math.round((Date.now() - quizStartTime.current) / 1000)
            : timeLimitSeconds;

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
                })),
                timeTakenSeconds,
                timeLimitSeconds,
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
                        <>
                            <div className={`text-center text-2xl font-mono font-bold mb-4 transition-colors ${
                                timeRemaining <= 60 && timeRemaining > 0
                                    ? "text-red-400 animate-pulse"
                                    : "text-slate-300"
                            }`}>
                                ⏱ {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                            </div>
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
                            />
                        </div>
                        </>

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
