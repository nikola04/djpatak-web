import { Metadata } from "next";

export const metadata: Metadata = {
    title: "DjPatak | Web Player | Library",
    description: "Web-based player for DjPatak Discord music bot",
};

export default async function RootLayout({
    children,
    params: { id }
  }: Readonly<{
    children: React.ReactNode,
    params: { id: string }
  }>) {
    return children
}