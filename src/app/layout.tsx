import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Es un 10 pero...",
	description: "Crea una sala, comparte el código y descubran quién es el más migajero.",
	openGraph: {
		title: "Es un 10 pero...",
		description: "Crea una sala, comparte el código y descubran quién es el más migajero.",
		locale: "es_AR",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Es un 10 pero...",
		description: "Crea una sala, comparte el código y descubran quién es el más migajero.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
