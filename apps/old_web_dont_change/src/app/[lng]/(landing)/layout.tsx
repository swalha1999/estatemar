import type { Metadata } from "next";
import type React from "react";
import AccessibilityButton from "@/components/a11y/a11y";
import ChatwootWidget from "@/components/ChatwootWidget/ChatwootWidget";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Subscribe from "@/components/Subscribe/Subscribe";

export const metadata: Metadata = {
	title: "Estatemar",
	description: "Invest in Real-Estate",
};

export default async function LandingLayout(props: {
	children: React.ReactNode;
	modal: React.ReactNode;
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;
	const { lng } = params;

	return (
		<>
			<div style={{ backgroundColor: "white" }}>
				<Navbar params={{ lng }} />
				{props.children}
				{props.modal}
				<AccessibilityButton params={{ lng }} />
				<Subscribe params={{ lng }} />
				<Footer params={{ lng }} />
				<ChatwootWidget locale={lng} />
			</div>
		</>
	);
}
