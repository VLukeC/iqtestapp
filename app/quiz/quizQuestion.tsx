import "../styles/styles.css";

import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from "react";

import type {Question} from './Question';


export function QuizQuestion({ statement, answers}: Question) {

    const [selectedValue, setSelectedValue] = useState('a');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        alert(`Are you sure you want to enter ${selectedValue}?`)
        event.preventDefault();
        //ADD HERE
    }

    return (
        <div className="quizQuestion">
            <div>
                    {statement}
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <legend>Select one of the following answers:</legend>
                    <label>
                    <input type="radio" id="a" name="a" value="a"
                    checked={selectedValue === 'a'} onChange={handleChange}/>{answers[0]}
                    </label><br/>
                    <label>
                    <input type="radio" id="b" name="b" value="b"
                     checked={selectedValue === 'b'} onChange={handleChange}/>{answers[1]}
                    </label><br/>
                    <label>
                    <input type="radio" id="c" name="c" value="c"
                     checked={selectedValue === 'c'} onChange={handleChange}/>{answers[2]}
                    </label><br/>
                    <label>
                    <input type="radio" id="d" name="d" value="d"
                     checked={selectedValue === 'd'} onChange={handleChange}/>{answers[3]}
                    </label><br/>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}