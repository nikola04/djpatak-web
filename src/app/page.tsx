"use client"
import Nav, { NavLogo } from '@/components/playerNavigation/Nav';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function Home() {
    const router = useRouter()
    return <div className="relative w-screen h-screen grid gap-x-8" style={{ gridTemplateRows: "auto 1fr", gridTemplateColumns: "auto 1fr" }}>
        <NavLogo/>
        <Suspense>
            <Nav guildId={null} />
        </Suspense>
        <div className="col-span-2">
            <button className='px-2 py-1.5 bg-blue-light rounded text-white-default m-4' onClick={() => router.push('/player/select-server')}>Select Server</button>
        </div>
    </div>;
}
