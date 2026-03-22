import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [index("routes/index.tsx"), 
    route("/history","./routes/history.tsx"),
    route("/quiz", "./routes/quiz.tsx"),
    route("/results", "./routes/results.tsx"),
    route("/account", "./routes/account.tsx"),
    route("/login", "./routes/login.tsx"),
    route("/signup", "./routes/signup.tsx"),
    route("/reset-password", "./routes/resetpassword.tsx")] satisfies RouteConfig;
