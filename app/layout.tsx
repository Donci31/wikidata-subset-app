import React from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: "Wikidata Graph Service",
    description: "Application for building graphs from wikidata",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main>{children}</main>
            </body>
        </html>
    );
}