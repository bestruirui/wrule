import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminPassword, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { password?: string };
        const { password } = body;

        if (!password) {
            return NextResponse.json({ error: "Password required" }, { status: 400 });
        }

        const validPassword = await getAdminPassword();

        if (password === validPassword) {
            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, password, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

