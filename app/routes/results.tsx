import type { Route } from "./+types/index";
import { ResultsPage } from "../results/resultsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz Results" },
    { name: "description", content: "This is the quiz results page" },
  ];
}

export default function Home() {
  return <ResultsPage />;
}