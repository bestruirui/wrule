import { NextRequest } from "next/server";
import { deleteRulesBatch } from "@/db/rules";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/auth";

// DELETE /api/rules/batch - Delete multiple rules
export async function DELETE(request: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

    try {
        const body = await request.json() as { ids?: number[] };
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return errorResponse("Missing required field: ids (array of rule IDs)");
        }

        await deleteRulesBatch(ids);
        return jsonResponse({ success: true, deleted: ids.length });
    } catch (error) {
        console.error("Database error:", error);
        return errorResponse("Failed to delete rules", 500);
    }
}

