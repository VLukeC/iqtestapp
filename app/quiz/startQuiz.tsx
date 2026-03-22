import { useState } from "react"


interface StartQuizProps {
    handleSubmit: (quizLength: number) => void
}

export function StartQuiz({ handleSubmit }: StartQuizProps) {
    const [ quizLength, setQuizLength ] = useState(20);



    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(quizLength);
            }}>
                <label>
                    Please enter the length of your quiz: 
                    <input 
                        name="quizLength" 
                        type="number" 
                        value={quizLength} 
                        min="5" 
                        max="30" 
                        step="1"
                        onChange={(event) => setQuizLength(parseInt(event.target.value))}
                    />
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}