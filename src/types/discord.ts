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