import { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
    title: "Estatemar Debug",
    description: "Debug panel for Estatemar",
};

export default async function DebugLayout(props: {
    children: React.ReactNode;
}) {

    // this to prevent access to the debug panel from outside debug mode
    if (process.env.DEBUG !== "true") {
        return redirect("/");
    }

    return (
        <main className="min-h-scree" style={{ backgroundColor: "#f0f2f5" }}>
            {props.children}
        </main>
    );
}
