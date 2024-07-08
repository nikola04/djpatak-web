"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import { ScriptProps } from "next/script";
import Image from "next/image"
import NavProfileMenu from "./ProfileMenu";
import Link from 'next/link';
import DiscordButton from '../button/DiscordSignIn';

export type ProfileLink = {
    name: string,
    href: string,
    func: (() => void)|null,
    chevron: boolean
}

const profileLinks: ProfileLink[] = [{
    name: 'Settings',
    href: '/account/settings',
    func: null,
    chevron: true,
},{
    name: 'Logout',
    href: '/account/logout',
    func: signOut,
    chevron: false,
}]

export default function Nav(props: ScriptProps){
    return <nav className={`${props.className} px-4 flex justify-between items-center`} style={{ height: "64px" }}>
        <Link href="/" title="Home">
            <span>
                <div className="flex items-center">
                    <Image src={"/logo-text.png"} alt="DjPatak" width={144} height={36}/>
                </div>
            </span>
        </Link>
        <div className="flex items-center">
            <ProfileMenu/>
        </div>
    </nav>
}

function ProfileMenu(){
    const { data: session, status } = useSession()
    if(status == 'loading') return <ProfileSceleton/>
    if(session?.user) return <NavProfileMenu user={session.user} profileLinks={profileLinks}/> 
    return <DiscordButton onClick={() => signIn("discord")}/>
}

function ProfileSceleton(){
    return <div className='px-2'>
        <div className="animate-pulse rounded-full w-9 h-9 bg-black-light"></div>
    </div>
}