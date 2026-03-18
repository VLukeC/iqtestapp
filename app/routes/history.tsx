import type { Route } from "./+types/index";
import { HistoryPage } from "../history/historyPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "History Page" },
    { name: "description", content: "This is the History Page" },
  ];
}

export default function Home() {
  return <HistoryPage />;
}