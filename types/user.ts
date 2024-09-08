import { TrackProvider } from '@/enums/providers';

export interface User {
	_id: string;
	name: string;
	email: string;
	image: string;
}

export interface Playlist {
	_id: string;
	name: string;
	description?: string;
	metadata: {
		totalSongs: number;
		lastModified: Date;
	};
}

export interface UserSearchHistory {
	_id: string;
	userId: string;
	searchProviders: TrackProvider[];
	search: string;
	searchedAt: Date;
}
