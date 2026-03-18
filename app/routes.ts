import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [index("routes/index.tsx"), 
    route("/history","./routes/history.tsx")] satisfies RouteConfig;
