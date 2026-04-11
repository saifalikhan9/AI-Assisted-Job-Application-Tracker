import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Job Application Tracker",
    template: "%s | AI Job Tracker",
  },
  description:
    "Track your job applications with a Kanban board, parse job descriptions using AI, and generate tailored resume bullet points instantly.",

  keywords: [
    "Job Tracker",
    "AI Resume Builder",
    "Kanban Board",
    "Job Applications",
    "Next.js App",
    "AI Tools",
  ],

  authors: [{ name: "Saif Ali Khan" }],

  creator: "Saif Ali Khan",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="">{children}</body>
    </html>
  );
}
