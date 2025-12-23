import { NextRequest } from "next/server";
import { getRuleById, updateRule, deleteRule } from "@/db/rules";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/auth";

// GET /api/rules/[id] - Get a single rule
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth();
    if (authError) return authError;

    const { id } = await params;

    try {
        const rule = await getRuleById(Number(id));

        if (!rule) {
            return errorResponse("Rule not found", 404);
        }

        return jsonResponse(rule);
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Database error", 500);
    }
}

// PUT /api/rules/[id] - Update a rule
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth();
    if (authError) return authError;

    const { id } = await params;

    try {
        const body = await request.json() as { group_name?: string; rule_type?: string; content?: string };
        const { group_name, rule_type, content } = body;

        if (!group_name || !rule_type || !content) {
            return errorResponse("Missing required fields: group_name, rule_type, content");
        }

        await updateRule(Number(id), { group_name, rule_type, content });
        return jsonResponse({ success: true });
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Failed to update rule", 500);
    }
}

// DELETE /api/rules/[id] - Delete a rule
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth();
    if (authError) return authError;

    const { id } = await params;

    try {
        await deleteRule(Number(id));
        return jsonResponse({ success: true });
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Failed to delete rule", 500);
    }
}
