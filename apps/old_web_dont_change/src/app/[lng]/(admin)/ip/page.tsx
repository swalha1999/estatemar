import { globalGETRateLimit } from "@/utils/auth/request";
import { getClientIPv4, getClientIPv6 } from "@/utils/UserIP";

export default async function Page() {
	if (!globalGETRateLimit()) {
		return <p className="text-center text-destructive">Too many requests</p>;
	}

	const clientIPv4 = getClientIPv4();
	const clientIPv6 = getClientIPv6();

	return (
		<div className="mx-auto max-w-md space-y-8">
			<h1 className="text-center font-bold text-3xl">Your IP Address</h1>
			<div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
				{clientIPv4 ? (
					<p className="mb-4 text-xl">IPv4: {clientIPv4}</p>
				) : (
					<p className="mb-4 text-muted-foreground text-xl">
						Unable to determine IPv4 address
					</p>
				)}
				{clientIPv6 ? (
					<p className="text-xl">IPv6: {clientIPv6}</p>
				) : (
					<p className="text-muted-foreground text-xl">
						Unable to determine IPv6 address
					</p>
				)}
			</div>
		</div>
	);
}
