import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route(":problem_id", "routes/home.tsx")
] satisfies RouteConfig;
