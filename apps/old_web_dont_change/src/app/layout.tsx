import { Montserrat } from "next/font/google";
import "@/app/[lng]/globals.css";
import type React from "react";
import { languages } from "@/app/i18n/settings";

const montserrat = Montserrat({ subsets: ["latin"] });

export async function generateStaticParams() {
	return languages.map((lng) => ({ lng }));
}

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props;

	return (
		<html>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
