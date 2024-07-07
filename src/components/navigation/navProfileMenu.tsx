"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { ProfileLink } from "./nav";

function isParentOf(parent: HTMLElement|null, node: HTMLElement|ParentNode|null): boolean{
    if(!parent) return false;
    if(!node) return false;
    if(node == parent) return true;
    return isParentOf(parent, node.parentNode);
}

export default function NavProfileMenu({ profileLinks, user }: {
    profileLinks: ProfileLink[],
    user: any
}){
    const [showProfile, setShowProfile] = useState(false);
    const profileButtonRef = useRef(null)
    useEffect(() => {
        if (!showProfile) return;
        function handleClick(event: Event) {
          if (event.target instanceof HTMLElement && !isParentOf(profileButtonRef.current, event.target)) {
              setShowProfile(false);
          }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [showProfile]);
    return <div ref={profileButtonRef} className="relative px-2">
        <button onClick={() => setShowProfile(!showProfile)} title="My Profile" className={`rounded-full w-9 h-9 bg-black-pure cursor-pointer overflow-hidden hover:opacity-85 active:opacity-70`}>
            <img src={user.image} width={36} height={36} alt={"Profile Image"}/>
        </button>
        {showProfile && <div className="absolute right-0 mt-2 w-64 rounded-lg z-20 overflow-hidden bg-black-light shadow-md">
            <div className="hover:bg-white-hover active:bg-white-active border-b border-gray group">
                <Link href="/account/" className="text-white-gray" title="My Profile">
                    <span>
                        <div className="flex items-center px-4 py-2.5 justify-between">
                            <div className="flex items-center">
                                <div className="rounded-full overflow-hidden">
                                    <img src={user.image} alt={'Profile picture'} width={34} height={34}/>
                                </div>
                                <p className="px-2">{user.name}</p>
                            </div>
                            <FaChevronRight className="text-sm mr-1 group-hover:animate-shakeX"/>
                        </div>
                    </span>
                </Link>
            </div>
            <div className="p-2">
                { profileLinks.map((link, ind) => <NavProfileLink key={ind} link={link} />)}
            </div>
        </div>}
    </div>
}

function NavProfileLink({ link }: {
    link: ProfileLink
}){
    return <div className="hover:bg-white-hover active:bg-white-active rounded-md group">
        <Button link={link}>
            <span className="block">
                <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-base">{link.name}</p>
                    { link.chevron && <FaChevronRight className="text-sm group-hover:animate-shakeX"/> }
                </div>
            </span>
        </Button>
    </div>
}

function Button({ children, link }: Readonly<{ children: React.ReactNode, link: ProfileLink }>){
    if(link.func)
        return <button onClick={() => { if(link.func) link.func() }} className="text-white-gray">{ children }</button>
    else return <Link href={link.href} title={link.name} className="text-white-gray">{ children }</Link>
}