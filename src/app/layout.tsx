import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import './globals.css'
import Nav, { NavLogo } from "@/components/playerNavigation/Nav";
import Providers from "@/components/Providers";
import { Suspense } from "react";

const nunitoFont = Nunito({ 
  subsets: ["latin"],
  display: 'swap'
 });

export const metadata: Metadata = {
  title: "DjPatak | Discord Bot",
  description: "Web-based player for DjPatak Discord music bot",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <html lang="en">
    <body className={nunitoFont.className}>
        <div className="w-screen h-screen bg-blue bg-black-default">
          <Providers>
            { children }
          </Providers>
        </div>
    </body>
  </html>
}