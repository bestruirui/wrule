import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "auth_token";

export async function getAdminPassword() {
    const { env } = await getCloudflareContext();
    return env.ADMIN_PASSWORD || "admin";
}

export async function getSubscribeToken() {
    const { env } = await getCloudflareContext();
    return env.SUBSCRIBE_TOKEN;
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    const validToken = await getAdminPassword();
    return token?.value === validToken;
}

export async function requireAuth() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

export function jsonResponse<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

export { COOKIE_NAME };

