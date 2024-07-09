import SideNav from "@/components/playerNavigation/SideNav";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Nav from "@/components/playerNavigation/Nav";
import Providers from "@/components/Providers";
import PlayerControlls from "@/components/playerNavigation/PlayerControlls";
import Link from "next/link";
import Image from "next/image";

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
      <body className={nunitoFont.className}>
        <Providers>
          <div className="w-screen h-screen bg-blue bg-black-default">
              <div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: "auto 1fr auto", gridTemplateColumns: "auto 1fr" }}>
                <NavLogo/>
                <Nav guildId={id} />
                <SideNav guildId={id} allowedMenuGroups={[ "guildSelector", "library", "player"]} />
                <div className="w-auto h-auto relative overflow-x-hidden overflow-y-scroll mb-2">
                  {children}
                </div>
                <PlayerControlls className="col-span-2" style={{ height: "72px" }}/>
              </div>
          </div>
          </Providers>
        </body>
    </html>
  );
}

function NavLogo(){
  return <div className="flex w-full h-full items-center justify-center px-4">
    <Link href="/" title="Home">
      <span>
          <div className="flex items-center">
              <Image src={"/logo-text.png"} alt="DjPatak" width={144} height={36}/>
          </div>
      </span>
    </Link>
  </div>
}
