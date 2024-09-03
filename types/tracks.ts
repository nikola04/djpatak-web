export type DbTrack = {
  providerId: string;
  providerTrackId: string;
  trackData: {
    title: string;
    thumbnail: string;
    duration: number;
    author: string;
  };
  isLiked?: boolean;
};
export interface QueueTrack extends DbTrack {
  queueId: string;
}
