"use client"
import { signIn, useSession } from 'next-auth/react'
import { ScriptProps } from "next/script";
import Image from "next/image"
import NavProfileMenu from "./navProfileMenu";

export type ProfileLink = {
    name: string,
    href: string,
    chevron: boolean
}

const profileLinks: ProfileLink[] = [{
    name: 'Settings',
    href: '/account/settings',
    chevron: true,
},{
    name: 'Logout',
    href: '/account/logout',
    chevron: false,
}]

export default function Nav(props: ScriptProps){
    const { data: session, status } = useSession()
    return <nav className={`${props.className} px-4 flex justify-between align-center`} style={{ height: "64px" }}>
        <div className="flex items-center">
            <Image src={"/logo-text.png"} alt="DjPatak" width={144} height={36}/>
        </div>
        <div className="flex items-center">
        { status == 'loading' ? 
            <UserSceleton/>
        : (session?.user ? 
            <NavProfileMenu user={session.user} profileLinks={profileLinks}/> 
            :
            <button className="text-white-gray" onClick={() => signIn("discord")}>Login</button>
        )}
        </div>
    </nav>
}

function UserSceleton(){
    return <div className='px-2'>
        <div className="animate-pulse rounded-full w-9 h-9 bg-black-light"></div>
    </div>
}