export interface User{
    _id: string,
    name: string,
    email: string,
    image: string
}

export interface Playlist{
    _id: string,
    name: string,
    description?: string,
    metadata: {
        totalSongs: number,
        lastModified: Date
    }
}