import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/toast-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sistem Informasi Kas Kelas",
    description:
        "Sistem informasi kas kelas yang mencakup pengelolaan iuran, cash flow, data anggota kelas, struktur organisasi, dan jadwal piket secara terstruktur.",
    openGraph: {
        title: "Kas Kelas",
        description: "Catatan iuran dan cash flow kelas yang rapi, transparan, dan mudah digunakan.",
        images: [
            {
                url: "/meta/meta-img.png",
                width: 1200,
                height: 630,
                alt: "Kas Kelas - Catatan Iuran & Cash Flow Kelas",
            },
        ],
    },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {/* <meta property="og:title" content="Sistem Informasi Kas Kelas" />
            <meta
                property="og:description"
                content="Sistem informasi kas kelas yang mencakup pengelolaan iuran, cash flow, data anggota kelas, struktur organisasi, dan jadwal piket secara terstruktur."
            />
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/meta/meta-mg.png`} />
            <meta property="og:image:alt" content="About Acme" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" /> */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="w-full max-w-lg mx-auto flex flex-col min-h-screen sm:border-l sm:border-r border-primary">
                    <ToastProvider />
                    {children}
                    <div className="mt-auto flex flex-wrap items-center justify-center px-4 py-1 bg-primary">
                        <p className="text-center text-[10px]">created by kuff</p>
                    </div>
                    {/* <BottomMenu /> */}
                </div>
            </body>
        </html>
    );
}
