import { Hono } from "hono";
import { getSignedCookie } from "hono/cookie";
import { authRoutes } from "./route/auth";
import { rulesRoutes } from "./route/rules";
import { subsRoutes } from "./route/subs";

const app = new Hono<{ Bindings: Env }>();

app.route("/api/auth", authRoutes);
app.route("/api/subs", subsRoutes);

app.use("/api/*", async (c, next) => {
  if (c.req.path === "/api/auth" || c.req.path === "/api/auth/") return next();
  if ((await getSignedCookie(c, c.env.SECRET, "auth")) === "1") return next();
  return c.json({ error: "Unauthorized." }, 401);
});

app.route("/api/rules", rulesRoutes);

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
