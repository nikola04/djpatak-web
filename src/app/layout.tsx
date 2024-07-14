import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import './globals.css'

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
        {children}
      </body>
    </html>
  );
}
