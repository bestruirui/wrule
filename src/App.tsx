import { checkAuth } from "@/api/auth";
import { apiUnauthorizedEvent, queryClient } from "@/api/client.ts";
import LoginPage from "@/components/LoginPage";
import MainPage from "@/components/MainPage";
import { Toaster } from "@/components/ui/sonner";
import { hideBootLoading } from "@/lib/bootLoading";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function App() {
	const [authState, setAuthState] = useState<boolean | null>(null);

	useEffect(() => {
		let cancelled = false;
		const handleUnauthorized = () => {
			if (cancelled) return;
			queryClient.clear();
			window.sessionStorage.removeItem("wrule:secret");
			setAuthState(false);
			hideBootLoading();
		};
		window.addEventListener(apiUnauthorizedEvent, handleUnauthorized);
		void checkAuth()
			.then((ok) => {
				if (cancelled) return;
				if (!ok) {
					queryClient.clear();
					window.sessionStorage.removeItem("wrule:secret");
				}
				hideBootLoading();
				setAuthState(ok);
			})
			.catch(() => {
				if (cancelled) return;
				queryClient.clear();
				window.sessionStorage.removeItem("wrule:secret");
				setAuthState(false);
				hideBootLoading();
			});
		return () => {
			cancelled = true;
			window.removeEventListener(apiUnauthorizedEvent, handleUnauthorized);
		};
	}, []);

	if (authState === null) return null;
	if (authState === false) return <LoginPage onSuccess={() => setAuthState(true)} />;

	return (
		<QueryClientProvider client={queryClient}>
			<MainPage />
			<Toaster />
		</QueryClientProvider>
	);
}
