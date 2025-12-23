'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Login } from '@/components/Login';
import { Home } from '@/components/Home';

export default function Page() {
	const view = useAppStore((s) => s.view);
	const isLoading = useAppStore((s) => s.isLoading);
	const checkAuth = useAppStore((s) => s.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isLoading) {
		return (
			<div className="min-h-dvh flex items-center justify-center bg-background md:bg-linear-to-br md:from-slate-50 md:via-gray-50 md:to-zinc-100 md:dark:from-zinc-950 md:dark:via-slate-950 md:dark:to-neutral-950">
				<div className="flex flex-col items-center gap-4">
					<div className="relative">
						<div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
						<div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					</div>
					<p className="text-muted-foreground font-medium">加载中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-dvh flex items-center justify-center md:p-6 bg-background md:bg-linear-to-br md:from-slate-50 md:via-gray-50 md:to-zinc-100 md:dark:from-zinc-950 md:dark:via-slate-950 md:dark:to-neutral-950">
			<div className="w-full h-dvh md:h-[min(800px,calc(100dvh-3rem))] md:max-w-5xl bg-background md:rounded-xl md:shadow-xl overflow-hidden md:border md:border-border/50">
				{view === 'login' ? <Login /> : <Home />}
			</div>
		</div>
	);
}
