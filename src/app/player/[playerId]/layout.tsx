import SideNav from "@/components/playerNavigation/SideNav";
import type { Metadata } from "next";
import Nav, { NavLogo } from "@/components/playerNavigation/Nav";
import PlayerControlls from "@/components/playerNavigation/PlayerControlls";

export const metadata: Metadata = {
  title: "DjPatak | Web Player",
  description: "Web-based player for DjPatak Discord music bot",
};

export default function RootLayout({
  children,
  params: { playerId }
}: Readonly<{
  children: React.ReactNode,
  params: { playerId: string }
}>) {
  return <div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}>
      <NavLogo/>
      <Nav guildId={playerId} />
      <SideNav guildId={playerId} allowedMenuGroups={[ "guildSelector", "library", "player"]} />
      <div className="w-auto h-auto relative overflow-x-hidden overflow-y-auto mb-1">
          {children}
      </div>
      <PlayerControlls guildId={playerId} className="col-span-2 border-t border-black-light"/>
  </div>
}