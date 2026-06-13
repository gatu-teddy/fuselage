import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalChatBubble } from "@/components/layouts/global-chat-bubble";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrueWagon — Premium Vehicle Import Marketplace",
  description:
    "Connect with verified exporters from Nigeria, UAE, Ghana, Kenya and more. Browse luxury cars and high-end vehicles shipped directly to Africa.",
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
