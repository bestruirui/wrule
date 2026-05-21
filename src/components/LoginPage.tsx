import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { login } from "@/api/auth";
import { ApiError } from "@/api/client";

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
	const [secret, setSecret] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="flex min-h-svh items-center justify-center bg-background px-8 text-foreground selection:bg-primary selection:text-primary-foreground">
			<div className="w-full max-w-md">
				<div className="mb-10 mx-2">
					<h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">登录</h1>
					<p className="mt-3 text-sm leading-6 text-muted-foreground">输入密钥后进入 Wrule 规则面板。</p>
				</div>
				<form
					onSubmit={async (event) => {
						event.preventDefault();
						if (pending || !secret.trim()) return;
						setPending(true);
						setError(null);
						try {
							await login(secret.trim());
							window.sessionStorage.setItem("wrule:secret", secret.trim());
							onSuccess();
						} catch (error) {
							setError(error instanceof ApiError ? error.message : "登录失败，请稍后重试。");
						} finally {
							setPending(false);
						}
					}}
					className="space-y-5"
				>
					<div className="group flex items-center rounded-xl bg-secondary px-2 py-2 transition-all hover:bg-muted focus-within:bg-card focus-within:shadow-md">
						<LockKeyhole size={18} className="ml-3 shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground" />
						<input
							type="password"
							placeholder="输入密钥"
							value={secret}
							onChange={(event) => setSecret(event.target.value)}
							autoFocus
							disabled={pending}
							className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
						/>
						<button
							type="submit"
							disabled={pending || !secret.trim()}
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-chart-3 text-white transition-colors outline-none hover:bg-chart-3/90 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted-foreground"
						>
							{pending ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} strokeWidth={2.5} />}
						</button>
					</div>
					<div className="min-h-5 text-sm font-medium text-destructive">
						{error}
					</div>
				</form>
			</div>
		</div>
	);
}
