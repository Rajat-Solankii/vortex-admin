import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vortex Admin Dashboard",
  description: "Admin dashboard for Vortex Media",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex text-gray-100 selection:bg-vortex/30 selection:text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col pl-64 w-full min-h-screen">
          <Topbar />
          <main className="flex-1 mt-16 p-8 relative overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
