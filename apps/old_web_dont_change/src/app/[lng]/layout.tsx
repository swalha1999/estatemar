import { Montserrat } from "next/font/google";
import { Noto_Kufi_Arabic } from "next/font/google";
import "@/app/[lng]/globals.css";
import { languages } from "@/app/i18n/settings";
import React from "react";

const montserrat = Montserrat({ subsets: ["latin"] });
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"] });

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

export default async function RootLayout(props: {
    children: React.ReactNode;
    params: Promise<{ lng: string }>;
}) {
    const params = await props.params;
    const { lng } = params;
    const { children } = props;

    let dir = "ltr";
    let font = montserrat;

    if (lng === "ar" || lng === "he") {
        if (lng === "ar") {
            font = notoKufiArabic;
        }
        dir = "rtl";
    }

    return (
        <main lang={lng} dir={dir}>
            <div className={font.className}>{children}</div>
        </main>
    );
}
