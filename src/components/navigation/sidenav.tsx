'use client'
import Link from "next/link";
import { MdFeaturedPlayList } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { PiPlaylistFill } from "react-icons/pi";
import { IconType } from "react-icons";
import { IoRadioSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { usePathname } from "next/navigation";

type LinkType = {
    name: string,
    icon: IconType,
    href: string
}
const linksGrouped: {
    name: string,
    links: LinkType[]
}[] = [{
    name: "Discover",
    links: [{
        name: "For You",
        icon: FaHeart,
        href: "/"
    },{
        name: "Radio",
        icon: IoRadioSharp,
        href: "/radio"
    }]
},{
    name: "My Library",
    links: [{
        name: "Playlists",
        icon: PiPlaylistFill,
        href: '/library/playlists'
    },{
        name: "Artists",
        icon: IoMdPerson,
        href: '/library/artists'
    },{
        name: "Albums",
        icon: MdFeaturedPlayList,
        href: '/library/albums'
    }]
}]

export default function Nav(){
    const pathname = usePathname();
    const isActive = (href: string) => (href == "/" && pathname == href) || (href != "/" && pathname.startsWith(href));
    return <div className="p-4 flex flex-col">
        { linksGrouped.map((linkGroup, ind) => <div key={ind} className="p-2 flex flex-col">
            <p className="text-white-gray uppercase font-bold text-sm py-2">{linkGroup.name}</p>
            <div className="flex flex-col py-2">
                { linkGroup.links.map((link, ind) => <NavItem key={ind} active={isActive(link.href)} data={link}/>)}
            </div>
        </div>)}
    </div>
}

function NavItem({ data, active }: {
    data: LinkType,
    active: boolean
}){
    const Icon = data.icon;
    return <Link title={data.name} href={data.href} className={`my-1.5 py-1 rounded-md min-w-40 px-2 hover:bg-white-hover active:bg-white-active transition-all ${active ? 'bg-blue-light' : ''}`}>
        <span>
            <div className="flex items-center">
                <Icon className="text-white-default text-lg"/>
                <p className="text-white-gray px-2.5">{data.name}</p>
            </div>
        </span>
    </Link>
}