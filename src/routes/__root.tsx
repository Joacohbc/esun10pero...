import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import * as React from "react";
import "../globals.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Es un 10 pero..." },
			{ name: "description", content: "Crea una sala, comparte el código y descubran quién es el más migajero." },
			// Open Graph
			{ property: "og:title", content: "Es un 10 pero..." },
			{ property: "og:description", content: "Crea una sala, comparte el código y descubran quién es el más migajero." },
			{ property: "og:locale", content: "es_AR" },
			{ property: "og:type", content: "website" },
			// Twitter
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: "Es un 10 pero..." },
			{ name: "twitter:description", content: "Crea una sala, comparte el código y descubran quién es el más migajero." },
		],
		link: [
			{ rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	);
}
