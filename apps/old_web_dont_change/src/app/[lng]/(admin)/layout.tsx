import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Estatemar Admin",
    description: "Admin panel for Estatemar",
};

export default async function AdminLayout(props: {
    children: React.ReactNode;
    params: Promise<{ lng: string }>;
}) {
    const params = await props.params;
    const { lng } = params;

    return (
        <main className="min-h-scree" style={{ backgroundColor: "#f0f2f5" }}>
            {props.children}
        </main>
    );
}
