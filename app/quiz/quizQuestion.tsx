import "../styles/styles.css";

import { useEffect, useState } from 'react';
import type { ChangeEvent } from "react";

import type {Question} from './Question';

interface QuizQuestionProps {
    question: Question;
    onNext: (selectedQuestion: string) => void;
    onPrevious: () => void;
    onSubmit: (selectedQuestion: string) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    selectedAnswer: string;
    isSubmitting: boolean;
}

export function QuizQuestion({question, onNext, onPrevious, hasNext, hasPrevious, onSubmit, selectedAnswer, isSubmitting}: QuizQuestionProps) {
    const [selectedValue, setSelectedValue] = useState(selectedAnswer);

    useEffect(() => {
        setSelectedValue(selectedAnswer);
    }, [question.id, selectedAnswer]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    }

    const handleNext = () => {
        onNext(selectedValue);
    }

    const handleSubmit = () => {
        if (isSubmitting) {
            return;
        }

        if (window.confirm("Are you finished with your quiz?")) {
            onSubmit(selectedValue);
        }
    }

    return (
        <div className="space-y-6">

            <div>
                <p className="text-2xl font-semibold leading-relaxed">
                    {question.question}
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-slate-400">
                    Select one answer:
                </p>

                {question.options.map((option, index) => (
                    <label
                        key={index}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition
                        ${
                            selectedValue === option
                                ? "bg-blue-500/20 border-blue-500 text-white"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                    >
                        <input
                            type="radio"
                            name="answer"
                            value={option}
                            checked={selectedValue === option}
                            onChange={handleChange}
                            className="accent-blue-500"
                        />
                        <span>{option}</span>
                    </label>
                ))}

                <div className="flex justify-between items-center pt-4">

                    <div>
                        {hasPrevious && (
                            <button
                                type="button"
                                onClick={onPrevious}
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                Previous
                            </button>
                        )}
                    </div>

                    <div>
                        {hasNext ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!selectedValue || isSubmitting}
                                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition disabled:opacity-40"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!selectedValue || isSubmitting}
                                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition disabled:opacity-40"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
);
}
