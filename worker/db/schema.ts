import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rules = sqliteTable("rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  group_name: text("group_name").notNull(),
  rule_type: text("rule_type").notNull(),
  content: text("content").notNull(),
});

export type Rule = typeof rules.$inferSelect;
export type NewRule = typeof rules.$inferInsert;
