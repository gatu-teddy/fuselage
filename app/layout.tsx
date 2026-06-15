import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalChatBubble } from "@/components/layouts/global-chat-bubble";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrueWagon — Global Vehicle Trade Marketplace",
  description:
    "Connect with verified vehicle exporters worldwide. Browse cars and bikes with full VIN transparency — tracked from origin to your port.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <GlobalChatBubble />
      </body>
    </html>
  );
}
