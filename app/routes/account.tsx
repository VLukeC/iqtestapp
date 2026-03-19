import type { Route } from "./+types/index";
import { AccountPage } from "../account/accountPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Account Info" },
    { name: "description", content: "This is the account info page" },
  ];
}

export default function Home() {
  return <AccountPage />;
}