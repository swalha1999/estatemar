export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="w-full max-w-lg px-6">{children}</div>
		</div>
	);
}
