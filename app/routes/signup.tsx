import type { Route } from "./+types/index";
import SignupPage from "../signup/signupPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signup" },
    { name: "description", content: "Signup page" },
  ];
}

export default function Signup() {
  return <SignupPage />;
}