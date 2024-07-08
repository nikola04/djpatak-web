import SideNav from "@/components/navigation/SideNav";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import './globals.css'
import Nav from "@/components/navigation/Nav";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";

const nunitoFont = Nunito({ 
  subsets: ["latin"],
  display: 'swap'
 });

export const metadata: Metadata = {
  title: "DjPatak | Web Player",
  description: "Web-based player for DjPatak Discord music bot",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body className={nunitoFont.className}>
        <Providers>
          <div className="w-screen h-screen bg-blue bg-black-default">
              <div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}>
                <Nav className="col-span-2"/>
                <SideNav/>
                <div className="w-auto h-auto relative">
                  {children}
                </div>
              </div>
          </div>
          </Providers>
        </body>
    </html>
  );
}
