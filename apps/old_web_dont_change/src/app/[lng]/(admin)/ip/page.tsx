import { getClientIPv4, getClientIPv6 } from "@/utils/UserIP";
import { globalGETRateLimit } from "@/utils/auth/request";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="text-center text-destructive">Too many requests</p>;
    }

    const clientIPv4 = getClientIPv4();
    const clientIPv6 = getClientIPv6();

    return (
        <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Your IP Address</h1>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                {clientIPv4 ? (
                    <p className="text-xl mb-4">IPv4: {clientIPv4}</p>
                ) : (
                    <p className="text-xl mb-4 text-muted-foreground">
                        Unable to determine IPv4 address
                    </p>
                )}
                {clientIPv6 ? (
                    <p className="text-xl">IPv6: {clientIPv6}</p>
                ) : (
                    <p className="text-xl text-muted-foreground">
                        Unable to determine IPv6 address
                    </p>
                )}
            </div>
        </div>
    );
}
