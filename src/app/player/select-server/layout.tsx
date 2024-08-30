import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Nav, { NavLogo } from "@/components/playerNavigation/Nav";
import Providers from "@/components/Providers";
import { Suspense } from "react";

const nunitoFont = Nunito({ 
  subsets: ["latin"],
  display: 'swap'
 });

export const metadata: Metadata = {
  title: "DjPatak | Web Player | Select Guild",
  description: "Web-based player for DjPatak Discord music bot",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}>
    <NavLogo/>
    <Suspense>
      <Nav guildId={null} />
    </Suspense>
    <div className="col-span-2">
      {children}
    </div>
  </div>
}