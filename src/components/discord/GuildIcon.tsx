import { DiscordGuild } from "../../../types/discord"
import { CSSProperties } from "react"

export function GuildIcon({ guild, size, style, styleNoImage, styleWithImage, className, classNameNoImage, classNameWithImage }:{
    guild: DiscordGuild,
    size: number,
    style?: CSSProperties,
    styleNoImage?: CSSProperties,
    styleWithImage?: CSSProperties,
    className?: React.ComponentProps<'div'>['className'],
    classNameNoImage?: React.ComponentProps<'div'>['className'],
    classNameWithImage?: React.ComponentProps<'img'>['className']
}){
    const iconUrl = guild.icon ? "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + (guild.icon.startsWith("a_") ? ".gif" : ".png") : null
    if(iconUrl) 
        return <img src={iconUrl} alt="Guild Icon" width={size} height={size} className={`rounded-full ${className} ${classNameWithImage}`} style={{...style, ...styleWithImage}} />
    return <div style={{ width: `${size}px`, height: `${size}px`, ...style, ...styleNoImage }} className={`flex items-center justify-center border-2 border-black-default rounded-full ${className} ${classNameNoImage}`}>
        <p className="text-center font-bold text-sm text-white-default">{ guild.name[0].toUpperCase() }</p>
    </div>
}