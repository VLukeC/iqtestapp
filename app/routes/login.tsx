import type { Route } from "./+types/index";
import LoginPage from "../login/loginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "This is the login Page" },
  ];
}

export default function Home() {
  return <LoginPage />;
}