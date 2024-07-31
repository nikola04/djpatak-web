import SideNav from "@/components/playerNavigation/SideNav";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Nav, { NavLogo } from "@/components/playerNavigation/Nav";
import Providers from "@/components/Providers";
import PlayerControlls from "@/components/playerNavigation/PlayerControlls";

const nunitoFont = Nunito({ 
  subsets: ["latin"],
  display: 'swap'
 });

export const metadata: Metadata = {
  title: "DjPatak | Web Player",
  description: "Web-based player for DjPatak Discord music bot",
};

export default async function RootLayout({
  children,
  params: { id }
}: Readonly<{
  children: React.ReactNode,
  params: { id: string }
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoFont.className} dark`}>
        <Providers>
          <div className="w-screen h-screen bg-blue bg-black-default">
              <div className="relative w-screen h-screen grid xl:gap-x-8" style={{ gridTemplateRows: "auto 1fr auto", gridTemplateColumns: "auto 1fr" }}>
                <NavLogo/>
                <Nav guildId={id} />
                <SideNav guildId={id} allowedMenuGroups={[ "guildSelector", "library", "player"]} />
                <div className="w-auto h-auto relative overflow-x-hidden overflow-y-auto mb-1">
                  {children}
                </div>
                <PlayerControlls guildId={id} className="col-span-2 border-t border-black-light"/>
              </div>
          </div>
          </Providers>
        </body>
    </html>
  );
}