"use client";

import React, { useState } from "react";
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}>
        <div className="flex h-full w-full">
          {/* Navbar com posição relativa e largura fixa */}
          <div className="w-64 h-full flex-shrink-0 relative z-10">
            <Navbar />
          </div>

          {/* Conteúdo principal */}
          <main
            className={`flex-1 h-full overflow-y-auto bg-gray-100 transition-all duration-300 px-6 ${
              isChatOpen ? "pr-[15rem]" : "pr-0"
            }`}
          >
            {children}
          </main>

          {/* Sidebar de Chat */}
          <ChatSidebar isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </div>
      </body>
    </html>
  );
}
