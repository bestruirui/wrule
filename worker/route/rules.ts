import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as schema from "../db/schema";

export const rulesRoutes = new Hono<{ Bindings: Env }>();

rulesRoutes.get("/", async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const items = await db
		.select()
		.from(schema.rules)
		.orderBy(asc(schema.rules.id))
		.all();

	return c.json({ items });
});

rulesRoutes.get("/:id", async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const item = await db
		.select()
		.from(schema.rules)
		.where(eq(schema.rules.id, Number(c.req.param("id"))))
		.get();

	if (!item) return c.json({ error: "Rule not found." }, 404);
	return c.json({ item });
});

rulesRoutes.post("/", async (c) => {
	const body = await c.req.json<{ group_name: string; rule_type: string; content: string }>();
	const db = drizzle(c.env.DB, { schema });
	const item = await db
		.insert(schema.rules)
		.values({
			group_name: body.group_name.trim(),
			rule_type: body.rule_type.trim(),
			content: body.content.trim(),
		})
		.returning()
		.get();

	return c.json({ item }, 201);
});

rulesRoutes.put("/:id", async (c) => {
	const id = Number(c.req.param("id"));
	const body = await c.req.json<{ group_name: string; rule_type: string; content: string }>();
	const db = drizzle(c.env.DB, { schema });

	await db
		.update(schema.rules)
		.set({
			group_name: body.group_name.trim(),
			rule_type: body.rule_type.trim(),
			content: body.content.trim(),
		})
		.where(eq(schema.rules.id, id))
		.run();

	const item = await db
		.select()
		.from(schema.rules)
		.where(eq(schema.rules.id, id))
		.get();

	if (!item) return c.json({ error: "Rule not found." }, 404);
	return c.json({ item });
});

rulesRoutes.delete("/:id", async (c) => {
	const id = Number(c.req.param("id"));
	const db = drizzle(c.env.DB, { schema });
	await db.delete(schema.rules).where(eq(schema.rules.id, id)).run();

	return c.json({
		ok: true,
		deleted_id: id,
	});
});

rulesRoutes.delete("/group/:group_name", async (c) => {
	const group_name = c.req.param("group_name");
	const db = drizzle(c.env.DB, { schema });
	await db.delete(schema.rules).where(eq(schema.rules.group_name, group_name)).run();

	return c.json({
		ok: true,
		deleted_group_name: group_name,
	});
});
