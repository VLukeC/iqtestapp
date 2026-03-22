import type { Route } from "./+types/index";
import { ResultsPage } from "../results/resultsPage";
import { useLocation } from "react-router"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Quiz Results" },
        { name: "description", content: "This is the quiz results page" },
    ];
}

interface ResultProps {
    iqScore: number;
    correctAnswerCount: number;
    totalQuestionCount: number;
    explanationText: string;
}

export default function Home() {
    const location = useLocation()
    const state = location.state as ResultProps

    if (!state) return <div>Props not correctly passed into ResultsPage</div>
    return <ResultsPage {...state} />;
}
