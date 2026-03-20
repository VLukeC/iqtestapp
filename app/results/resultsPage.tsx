import { Link } from "react-router";
import "../styles/styles.css";

interface ResultProps {
    iqScore: number;
    correctAnswerCount: number;
    totalQuestionCount: number;
    explanationText: string;
}

export function ResultsPage({ iqScore, correctAnswerCount, totalQuestionCount, explanationText }: ResultProps) {
    return (
        <main>
            <div className="navBar">
                <>
                    <Link to='/' className='navButton'>Home</Link>
                </>
            </div>

            <div>
                <h1 className="text-5xl font-bold text-center mt-20">
                    IQ Score: {iqScore}
                </h1>
                <h2 className="text-3xl font-bold text-center mt-10">
                    Test Score: {correctAnswerCount}/{totalQuestionCount}
                </h2>
                <p className="text-center mt-20">
                    {explanationText}
                </p>
            </div>

            <div className="flex justify-center items-center mt-20">
                <Link to="/">
                    <button type="button" className="transition px-6 py-2 rounded-lg bg-[#214f4b] hover:bg-[#1a3f3c]">
                        Finish
                    </button>
                </Link>
            </div>
        </main>
    );

}
