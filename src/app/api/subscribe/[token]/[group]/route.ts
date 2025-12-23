import { NextRequest, NextResponse } from "next/server";
import { getSubscribeToken } from "@/lib/auth";
import { getRulesForSubscribe } from "@/db/rules";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string; group: string }> }
) {
    const { token, group } = await params;

    // Only validate against SUBSCRIBE_TOKEN
    const VALID_TOKEN = await getSubscribeToken();

    if (!VALID_TOKEN || token !== VALID_TOKEN) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Decode group name in case it's URL encoded
    const decodedGroup = decodeURIComponent(group);

    try {
        const results = await getRulesForSubscribe(decodedGroup);

        const yamlLines = results.map((r) => `  - ${r.rule_type},${r.content}`);
        const yamlData = `payload:\n${yamlLines.join("\n")}`;

        return new NextResponse(yamlData, {
            headers: {
                "Content-Type": "text/yaml; charset=utf-8",
            },
        });
    } catch (error) {
        console.error("Database error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
