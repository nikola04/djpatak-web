export interface Playlist{
    name: string,
    metadata: {
        totalSongs: number,
        lastModified: Date
    }
}