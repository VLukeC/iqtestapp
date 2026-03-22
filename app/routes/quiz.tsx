import type { Route } from "./+types/index";
import { QuizPage } from "../quiz/quizPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz" },
    { name: "description", content: "This is the quiz page" },
  ];
}

export default function Home() {
  return <QuizPage />;
}