interface TrackAuthor {
  username: string;
  permalink: string;
}

export interface DbTrack {
  providerId: string;
  providerTrackId: string;
  data: {
    title: string;
    permalink: string;
    thumbnail?: string;
    durationInSec: number;
  };
  isLiked?: boolean;
  authors: TrackAuthor[];
}

export interface QueueTrack extends DbTrack {
  queueId: string;
}
