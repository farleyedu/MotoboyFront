// app/layout.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import ChatSidebar from "@/components/ui/chatSideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen">
          <Navbar />
          <main className={`flex-1 overflow-y-auto p-6 bg-gray-100 transition-all duration-300 min-h-[calc(100vh-64px)] ${isChatOpen ? "pr-30" : "pr-0"}`}>
            {children}
          </main>
          <ChatSidebar isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </div>
      </body>
    </html>
  );
}
