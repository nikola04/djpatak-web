export type SoundcloudTrack = {
    id: number
    title: string
    permalink: string
    thumbnail: string
    duration: number
    user: {
        id: number
        username: string
        permalink: string
        thumbnail: string
    }
    formats: any[]
}