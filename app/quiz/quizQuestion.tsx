import "../styles/styles.css";

import { useState } from 'react';
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router";

import type {Question} from './Question';

interface QuizQuestionProps {
    question: Question;
    onNext: (selectedQuestion: string) => void;
    onPrevious: () => void;
    onSubmit: (selectedQuestion: string) => void;
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
        onNext(selectedValue);
    }

    return (
        <div className="quizQuestion">
            <div>
                    <p>{question.question}</p><br/>
            </div>
            <div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    if(window.confirm("Are you finished with your quiz?")) {
                        onSubmit(selectedValue);
                    }
                }}>
                    <legend>Select one of the following answers:</legend>
                    <label>
                    <input type="radio" id="a" name="answer" value={question.options[0]}
                    checked={selectedValue === question.options[0]} onChange={handleChange}/>{question.options[0]}
                    </label><br/>
                    <label>
                    <input type="radio" id="b" name="answer" value={question.options[1]}
                     checked={selectedValue === question.options[1]} onChange={handleChange}/>{question.options[1]}
                    </label><br/>
                    <label>
                    <input type="radio" id="c" name="answer" value={question.options[2]}
                     checked={selectedValue === question.options[2]} onChange={handleChange}/>{question.options[2]}
                    </label><br/>
                    <label>
                    <input type="radio" id="d" name="answer" value={question.options[3]}
                     checked={selectedValue === question.options[3]} onChange={handleChange}/>{question.options[3]}
                    </label><br/>
                    {hasPrevious && <button type="button" onClick={onPrevious}>Previous Question</button>}
                    {hasNext && <button type="button" onClick={handleNext}>Next Question</button>}
                    {!hasNext && <button type="submit">Submit Quiz</button>}
                </form>
            </div>
        </div>
    )
}