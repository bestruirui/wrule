import { NextRequest } from "next/server";
import { getAllRules, createRule, deleteRulesByGroup } from "@/db/rules";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/auth";

// GET /api/rules - Get all rules (optionally filtered by group)
export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const rules = await getAllRules();
        return jsonResponse(rules);
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Database error", 500);
    }
}

// POST /api/rules - Create a new rule
export async function POST(request: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json() as { group_name?: string; rule_type?: string; content?: string };
        const { group_name, rule_type, content } = body;

        if (!group_name || !rule_type || !content) {
            return errorResponse("Missing required fields: group_name, rule_type, content");
        }

        const id = await createRule({ group_name, rule_type, content });
        return jsonResponse({ success: true, id }, 201);
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Failed to create rule", 500);
    }
}

// DELETE /api/rules?group=xxx - Delete all rules in a group (i.e. delete group)
export async function DELETE(request: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

    const group = request.nextUrl.searchParams.get("group");
    if (!group) {
        return errorResponse("Missing required query param: group");
    }

    try {
        const deleted = await deleteRulesByGroup(group);
        return jsonResponse({ success: true, deleted });
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Failed to delete group", 500);
    }
}
