import "@/index.css";
import App from "@/App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const systemColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const applySystemColorScheme = (isDark: boolean) => {
	document.documentElement.classList.toggle("dark", isDark);
	document.documentElement.style.colorScheme = isDark ? "dark" : "light";
};

applySystemColorScheme(systemColorScheme.matches);
systemColorScheme.addEventListener("change", (event) => {
	applySystemColorScheme(event.matches);
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error: unknown) => {
			console.error("service worker registration failed", error);
		});
	});
}
