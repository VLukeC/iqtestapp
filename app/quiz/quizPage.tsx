import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";

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
    const [ generationError, setGenerationError ] = useState("");

    const [ currentIndex, setCurrentIndex ] = useState(0);

    const [ timeLimitSeconds, setTimeLimitSeconds ] = useState(0);

    const [ timeRemaining, setTimeRemaining ] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState("");
    const submissionStarted = useRef(false);

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
        setGenerationError("");
        setQuestions([]);
        setLengthInputted(true);
        setCurrentIndex(0);
        setAnswers([]);
        answersRef.current = [];
        setTimeLimitSeconds(timeLimit);
        setTimeRemaining(timeLimit);
        quizStartTime.current = null;

        fetch(`/api/quiz/${quizLength}`, {
            signal: AbortSignal.timeout(90000),
        })
        .then(async (results) => {
            if (!results.ok) {
                const failure = await results.json().catch(() => null);
                throw new Error(failure?.error ?? "Quiz generation failed. Please try again.");
            }
            const data = await results.json();
            if (!Array.isArray(data.questionList) || data.questionList.length === 0) {
                throw new Error("No questions were returned. Please try again.");
            }
            setQuestions(data.questionList);
        })
        .catch((error) => {
            setGenerationError(error.name === "TimeoutError"
                ? "Quiz generation timed out. Try again with fewer questions."
                : error instanceof TypeError
                    ? "Cannot reach the quiz server. Make sure the backend is running on port 5000."
                    : error.message);
            setLengthInputted(false);
        });
    }

    const sendResults = useCallback(async (finalAnswers: string[], timeRanOut = false) => {
        if (submissionStarted.current) return;
        submissionStarted.current = true;
        setIsSubmitting(true);
        setSubmissionError("");
        const timeTakenSeconds = quizStartTime.current
            ? Math.round((Date.now() - quizStartTime.current) / 1000) : timeLimitSeconds;
        try {
            const response = await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(20000),
                body: JSON.stringify({
                    questions,
                    userAnswers: questions.map((question, index) => ({
                        id: question.id, selected: finalAnswers[index] ?? "",
                    })),
                    timeTakenSeconds, timeLimitSeconds,
                }),
            });
            if (!response.ok) {
                const failure = await response.json().catch(() => null);
                throw new Error(failure?.error ?? "Could not submit your quiz. Please try again.");
            }
            const data = await response.json();
            if (!Number.isFinite(data.iqScore) || !Number.isFinite(data.correctAnswerCount)
                || typeof data.explanationText !== "string") {
                throw new Error("The quiz server returned invalid results. Please try again.");
            }
            await navigate('/results', {
                state: { ...data, totalQuestionCount: questions.length, timeRanOut },
            });
        } catch (error) {
            submissionStarted.current = false;
            setIsSubmitting(false);
            setSubmissionError(error instanceof Error && error.name === "TimeoutError"
                ? "Submission timed out. Your answers are still here. Please try again."
                : error instanceof Error ? error.message : "Could not submit your quiz. Please try again.");
        }
    }, [questions, timeLimitSeconds, navigate]);

    useEffect(() => {
        if (questions.length === 0 || isSubmitting || timeRemaining === 0) return;
        if (!quizStartTime.current) quizStartTime.current = Date.now();
        const interval = setInterval(() => {
            const remaining = Math.max(0, timeLimitSeconds - Math.floor(
                (Date.now() - quizStartTime.current!) / 1000));
            setTimeRemaining(remaining);
            if (remaining === 0) {
                clearInterval(interval);
                void sendResults(answersRef.current, true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [questions, timeLimitSeconds, isSubmitting, sendResults, timeRemaining === 0]);

    const submitQuiz = (selectedQuestion: string) => {
        const finalAnswers = [...answersRef.current];
        finalAnswers[currentIndex] = selectedQuestion;
        answersRef.current = finalAnswers;
        setAnswers(finalAnswers);
        void sendResults(finalAnswers, timeRemaining === 0);
    };

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
                    {generationError && (
                        <p role="alert" className="text-center text-red-400 mb-6">{generationError}</p>
                    )}

                    {lengthInputted && questions.length > 0 ? (
                        <>
                            <div className={`text-center text-2xl font-mono font-bold mb-4 transition-colors ${
                                timeRemaining <= 60 && timeRemaining > 0
                                    ? "text-red-400 animate-pulse"
                                    : "text-slate-300"
                            }`}>
                                ⏱ {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                            </div>
                            {isSubmitting && <p role="status" className="text-center text-slate-300 mb-4">Submitting your quiz and preparing results...</p>}
                            {submissionError && (
                                <div role="alert" className="text-center text-red-400 mb-4">
                                    <p>{submissionError}</p>
                                    <button type="button" className="mt-2 underline" onClick={() => void sendResults(answersRef.current, timeRemaining === 0)}>Retry submission</button>
                                </div>
                            )}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
                                <QuizQuestion
                                key={questions[currentIndex].id ?? currentIndex}
                                question={questions[currentIndex]}
                                onNext={nextQuestion}
                                onPrevious={prevQuestion}
                                onSubmit={submitQuiz}
                                isSubmitting={isSubmitting || timeRemaining === 0}
                                onAnswerChange={(answer) => {
                                    const updated = [...answersRef.current];
                                    updated[currentIndex] = answer;
                                    answersRef.current = updated;
                                    setAnswers(updated);
                                }}
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
