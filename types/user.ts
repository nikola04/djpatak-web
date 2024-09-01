export interface Playlist{
    _id: string,
    name: string,
    metadata: {
        totalSongs: number,
        lastModified: Date
    }
}