import Nav, { NavLogo } from '@/components/playerNavigation/Nav';
import { Suspense } from 'react';

export default function Home() {
    return <div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}>
        <NavLogo/>
        <Suspense>
            <Nav guildId={null} />
        </Suspense>
        <div className="col-span-2">
        </div>
    </div>;
}
