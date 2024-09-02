import { QueueTrack } from "../../types/soundcloud";
import Cookies from "js-cookie";
import { playerPreferences } from "../../types/player";

export enum ResponseDataType {
  JSON,
  Text,
}

export type APIResponse = {
  status: number;
  data: any;
  errorData?: any;
};

export type QueueTrackResponse =
  | {
      status: "ok";
      error: undefined;
      playerStatus: "playing" | "paused";
      playerPreferences?: playerPreferences;
      queueTrack: QueueTrack;
    }
  | {
      status: "error";
      error: string;
      playerStatus?: "playing" | "paused";
      playerPreferences?: playerPreferences;
      queueTrack?: QueueTrack;
    };

const formatResponseData = async (
  res: Response,
  responseType?: ResponseDataType,
) => {
  if (responseType == ResponseDataType.JSON) return await res.json();
  else if (responseType == ResponseDataType.Text) return await res.text();
  else return await res.text();
};

const attemptRequest = async (
  input: string | URL,
  attempt: number,
  useCooldown?: boolean,
  responseType?: ResponseDataType,
  init?: RequestInit,
): Promise<APIResponse> => {
  return await fetch(input, init).then(async (res) => {
    try {
      if (res.status == 429 && useCooldown) {
        const cooldown = (await res.json())?.retry_after;
        if (cooldown)
          return await new Promise((res, rej) =>
            setTimeout(
              async () => {
                res(
                  await attemptRequest(
                    input,
                    attempt + 1,
                    useCooldown,
                    responseType,
                    init,
                  ),
                );
              },
              Number(cooldown) + 5,
            ),
          );
      }
      if (res.status == 429 && attempt < 4)
        return await new Promise((res, rej) =>
          setTimeout(async () => {
            res(
              await attemptRequest(
                input,
                attempt + 1,
                useCooldown,
                responseType,
                init,
              ),
            );
          }, attempt * 100),
        );
      else if (!res.ok)
        return {
          status: res.status,
          data: await formatResponseData(res, responseType),
        };
      return {
        status: res.status,
        data: await formatResponseData(res, responseType),
      };
    } catch (err) {
      return { status: res.status, data: null, errorData: err as any };
    }
  });
};

export default async function apiRequest(
  input: string,
  init?: RequestInit,
  responseType?: ResponseDataType,
  useCooldown?: boolean,
): Promise<APIResponse> {
  init = { ...init, credentials: "include" };
  const csrf = Cookies.get("csrf_token");
  const _input = new URL(input);
  if (csrf) _input.searchParams.set("csrf", csrf);
  const { status, data, errorData } = await attemptRequest(
    _input,
    useCooldown ? 2 : 1,
    useCooldown,
    responseType,
    init,
  );
  if (status != 401) return { status, data };
  // try to refresh token
  const { status: refrStatus, data: rfrData } = await attemptRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh`,
    0,
    false,
    ResponseDataType.JSON,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (refrStatus == 200 && rfrData.status == "ok")
    return await attemptRequest(
      _input,
      useCooldown ? 2 : 1,
      useCooldown,
      responseType,
      init,
    );
  return { status, data, errorData };
}
