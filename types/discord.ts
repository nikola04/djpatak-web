export type DiscordGuild = {
    id: string,
    name: string,
    icon?: string,
    owner: boolean,
    permissions: number,
    features: string[],
    approximate_member_count: number|undefined,
    approximate_presence_count: number|undefined
}

export type Role = {
    id: string,
    name: string,
    unicodeEmoji: string|null,
    color: number,
    permissions: string,
    rawPosition: number
}