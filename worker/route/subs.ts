import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as schema from "../db/schema";

export const subsRoutes = new Hono<{ Bindings: Env }>();

subsRoutes.get("/:token/:group", async (c) => {
    if (!c.env.SECRET || c.req.param("token") !== c.env.SECRET) {
        return c.text("Unauthorized", 401);
    }

    const items = await drizzle(c.env.DB, { schema })
        .select({
            rule_type: schema.rules.rule_type,
            content: schema.rules.content,
        })
        .from(schema.rules)
        .where(eq(schema.rules.group_name, decodeURIComponent(c.req.param("group"))))
        .orderBy(asc(schema.rules.id))
        .all();

    return new Response(`payload:\n${items.map((item) => `  - ${item.rule_type},${item.content}`).join("\n")}`, {
        headers: {
            "Content-Type": "text/yaml; charset=utf-8",
        },
    });
});
