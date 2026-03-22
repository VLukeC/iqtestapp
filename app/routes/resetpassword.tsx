import type { Route } from "./+types/index";
import ResetPassword from "~/resetpassword/ResetPassword";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password" },
    { name: "description", content: "This is the quiz page" },
  ];
}

export default function Home() {
  return <ResetPassword />;
}