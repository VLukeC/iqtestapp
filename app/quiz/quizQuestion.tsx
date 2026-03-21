import "../styles/styles.css";

import { useState } from 'react';
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router";

import type {Question} from './Question';

type QuizQuestionProps = {
    question: Question;
    onNext: () => void;
    onPrevious: () => void;
    onSubmit: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

export function QuizQuestion({question, onNext, onPrevious, hasNext, hasPrevious, onSubmit}: QuizQuestionProps) {
    const navigate = useNavigate()

    const [selectedValue, setSelectedValue] = useState('a');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    }

    const handleNext = () => {
        if (selectedValue === question.correctAnswer) {
            question.correctQuestion = true;
        } else {
            question.correctQuestion = false;
        }
        onNext();
    }

    return (
        <div className="quizQuestion">
            <div>
                    <p>{question.statement}</p><br/>
            </div>
            <div>
                <form onSubmit={(event) => {
                    if (selectedValue === question.correctAnswer) {
                        question.correctQuestion = true;
                    } else {
                        question.correctQuestion = false;
                    }
                    window.confirm("Are you finished with your quiz?");
                    event.preventDefault();
                    onSubmit();
                }}>
                    <legend>Select one of the following answers:</legend>
                    <label>
                    <input type="radio" id="a" name="a" value={question.answers[0]}
                    checked={selectedValue === question.answers[0]} onChange={handleChange}/>{question.answers[0]}
                    </label><br/>
                    <label>
                    <input type="radio" id="b" name="b" value={question.answers[1]}
                     checked={selectedValue === question.answers[1]} onChange={handleChange}/>{question.answers[1]}
                    </label><br/>
                    <label>
                    <input type="radio" id="c" name="c" value={question.answers[2]}
                     checked={selectedValue === question.answers[2]} onChange={handleChange}/>{question.answers[2]}
                    </label><br/>
                    <label>
                    <input type="radio" id="d" name="d" value={question.answers[3]}
                     checked={selectedValue === question.answers[3]} onChange={handleChange}/>{question.answers[3]}
                    </label><br/>
                    {hasPrevious && <button onClick={onPrevious}>Previous Question</button>}
                    {hasNext && <button type="button" onClick={handleNext}>Next Question</button>}
                    {!hasNext && <button type="submit">Submit Quiz</button>}
                </form>
            </div>
        </div>
    )
}