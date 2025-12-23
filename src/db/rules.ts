import { getDb } from "./index";
import type { Rule, CreateRuleInput, UpdateRuleInput } from "./types";

export async function getAllRules(): Promise<Rule[]> {
    const db = await getDb();
    const { results } = await db
        .prepare("SELECT * FROM rules ORDER BY created_at DESC")
        .all();
    return results as unknown as Rule[];
}

export async function getRulesByGroup(groupName: string): Promise<Rule[]> {
    const db = await getDb();
    const { results } = await db
        .prepare("SELECT * FROM rules WHERE group_name = ? ORDER BY created_at DESC")
        .bind(groupName)
        .all();
    return results as unknown as Rule[];
}

export async function getRuleById(id: number): Promise<Rule | null> {
    const db = await getDb();
    const result = await db
        .prepare("SELECT * FROM rules WHERE id = ?")
        .bind(id)
        .first();
    return result as Rule | null;
}

export async function createRule(input: CreateRuleInput): Promise<number> {
    const db = await getDb();
    const result = await db
        .prepare("INSERT INTO rules (group_name, rule_type, content) VALUES (?, ?, ?)")
        .bind(input.group_name, input.rule_type, input.content)
        .run();
    return result.meta.last_row_id as number;
}

export async function updateRule(id: number, input: UpdateRuleInput): Promise<void> {
    const db = await getDb();
    await db
        .prepare("UPDATE rules SET group_name = ?, rule_type = ?, content = ? WHERE id = ?")
        .bind(input.group_name, input.rule_type, input.content, id)
        .run();
}

export async function deleteRule(id: number): Promise<void> {
    const db = await getDb();
    await db.prepare("DELETE FROM rules WHERE id = ?").bind(id).run();
}

export async function deleteRulesBatch(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    const db = await getDb();
    const placeholders = ids.map(() => '?').join(',');
    await db.prepare(`DELETE FROM rules WHERE id IN (${placeholders})`).bind(...ids).run();
}

export async function deleteRulesByGroup(groupName: string): Promise<number> {
    const db = await getDb();
    const result = await db
        .prepare("DELETE FROM rules WHERE group_name = ?")
        .bind(groupName)
        .run();
    return (result.meta.changes || 0) as number;
}

export async function getRulesForSubscribe(groupName: string): Promise<{ rule_type: string; content: string }[]> {
    const db = await getDb();
    const { results } = await db
        .prepare("SELECT rule_type, content FROM rules WHERE group_name = ?")
        .bind(groupName)
        .all();
    return results as { rule_type: string; content: string }[];
}

