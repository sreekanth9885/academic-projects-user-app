import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic Projects for Students | Radiant Software Solutions",
  description: "Download academic projects for students with source code, documentation, and database. Final year projects available.",
  
  keywords: [
    'academic projects',
    'student projects',
    'final year projects',
    'software projects',
    'engineering projects',
  ],
  icons: {
    icon: [
      {url:"/icon.png",type:"image/png"},
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}