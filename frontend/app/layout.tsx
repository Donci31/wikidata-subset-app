import React from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
            <Header></Header>
            {children}
            <Footer></Footer>
          </body>
        </html>
    );
}
