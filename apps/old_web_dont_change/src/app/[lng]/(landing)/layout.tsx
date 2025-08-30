import { Metadata } from "next";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import AccessibilityButton from "@/components/a11y/a11y";
import Footer from "@/components/Footer/Footer";
import Subscribe from "@/components/Subscribe/Subscribe";
import ChatwootWidget from "@/components/ChatwootWidget/ChatwootWidget";

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
