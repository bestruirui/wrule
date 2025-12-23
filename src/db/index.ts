import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb() {
    const { env } = await getCloudflareContext();
    if (!env.DB) {
        throw new Error("Database binding 'DB' not found");
    }
    return env.DB;
}


