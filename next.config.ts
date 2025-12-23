import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

function readSubscribeTokenFromWrangler(): string | undefined {
	try {
		const wranglerPath = path.join(process.cwd(), "wrangler.jsonc");
		const contents = fs.readFileSync(wranglerPath, "utf8");
		// Simple JSONC extraction (good enough for our small config file)
		const match = contents.match(/"SUBSCRIBE_TOKEN"\s*:\s*"([^"]*)"/);
		return match?.[1];
	} catch {
		return undefined;
	}
}

const nextConfig: NextConfig = {
	env: {
		// Compiled into client bundle (user requested no backend fetch)
		NEXT_PUBLIC_SUBSCRIBE_TOKEN:
			readSubscribeTokenFromWrangler() ?? process.env.NEXT_PUBLIC_SUBSCRIBE_TOKEN ?? "",
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
