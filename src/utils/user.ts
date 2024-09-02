import { useEffect, useMemo, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";
import { DiscordGuild } from "../../types/discord";
import { Playlist, User } from "../../types/user";
import { DbTrack } from "../../types/tracks";

export async function createNewPlaylist(name: string, description: string) {
  const { status, data } = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    },
    ResponseDataType.JSON,
    true,
  );
  if (status == 200) {
    const playlist = data.playlist as Playlist;
    return playlist;
  }
  throw data.error;
}

export async function updatePlaylist(
  playlistId: string,
  name: string,
  description: string,
) {
  const { status, data } = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists/${playlistId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    },
    ResponseDataType.JSON,
    true,
  );
  if (status == 200) {
    const playlist = data.playlist as Playlist;
    return playlist;
  }
  throw data.error;
}

export async function addTrackToPlaylist(
  playlistId: string,
  providerId: string,
  providerTrackId: string,
) {
  const { status, data } = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerId, providerTrackId }),
    },
    ResponseDataType.JSON,
    true,
  );
  if (status == 200) {
    const playlist = data.playlist as Playlist;
    return playlist;
  }
  throw data.error;
}

export function useUserPlaylistTracks(playlistId: string) {
  const [data, setData] = useState<DbTrack[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { status, data } = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists/${playlistId}/tracks`,
        { method: "GET", cache: "no-cache" },
        ResponseDataType.JSON,
        true,
      );
      if (status == 200) {
        const tracks = data.tracks as DbTrack[];
        setData(tracks);
      }
      setLoading(false);
    })();
  }, [playlistId]);
  return { data, setData, loading };
}

export function useUserPlaylist(playlistId: string) {
  const [data, setData] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { status, data } = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists/${playlistId}`,
        { method: "GET", cache: "no-cache" },
        ResponseDataType.JSON,
        true,
      );
      if (status == 200) {
        const playlist = data.playlist as Playlist;
        setData(playlist);
      }
      setLoading(false);
    })();
  }, [playlistId]);
  return { data, setData, loading };
}

export function useUserGuilds() {
  const [data, setData] = useState<DiscordGuild[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      console.log("calling");
      const { status, data } = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/guilds`,
        { method: "GET", cache: "no-cache" },
        ResponseDataType.JSON,
        true,
      );
      if (status == 200 && data.status == "ok") {
        const results = data.results as DiscordGuild[];
        setData(results);
      }
      setLoading(false);
    })();
  }, []);
  return { data, loading };
}

export function useUserPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const sortedPlaylists = useMemo(
    () =>
      playlists.toSorted((a, b) => {
        return (
          new Date(b.metadata.lastModified).getTime() -
          new Date(a.metadata.lastModified).getTime()
        );
      }),
    [playlists],
  );
  useEffect(() => {
    (async () => {
      console.log("requesting");
      const { status, data } = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/users/me/playlists`,
        { method: "GET", cache: "no-cache" },
        ResponseDataType.JSON,
        true,
      );
      if (status == 200 && data.playlists) setPlaylists(data.playlists);
      setLoading(false);
    })();
  }, []);
  return { playlists, sortedPlaylists, setPlaylists, loading };
}

export function useUserData() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
          {
            method: "GET",
            cache: "no-cache",
          },
          ResponseDataType.JSON,
          true,
        );
        if (data.status == "ok") return setData(data.data as User);
        setData(null);
      } catch (error) {
        console.error(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
