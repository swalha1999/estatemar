import Header from "@/components/header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid h-svh grid-rows-[auto_1fr]">
			<Header />
			{children}
		</div>
	);
}
