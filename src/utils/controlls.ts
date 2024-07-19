import { QueueTrack } from "@/types/soundcloud"
import apiRequest, { QueueTrackResponse, ResponseDataType } from "./apiRequest"

export const prev = async (guildId: string) => {
    const { data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${guildId}/tracks/queue/prev`, { method: 'POST' }, ResponseDataType.JSON)
    const { status, error, playerStatus, queueTrack } = data as QueueTrackResponse
    if(status == 'ok') return ({ playerStatus, queueTrack })
    throw error
}
export const next = async (guildId: string) => {
    const { data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${guildId}/tracks/queue/next`, { method: 'POST' }, ResponseDataType.JSON)
    const { status, error, playerStatus, queueTrack } = data as QueueTrackResponse
    if(status == 'ok') return ({ playerStatus, queueTrack })
    throw error
}
export const pause = async (guildId: string) => {
    const { data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${guildId}/pause`, { method: 'POST' }, ResponseDataType.JSON)
    const { status, error } = data as QueueTrackResponse
    if(status == 'ok') return true
    throw error
}
export const resume = async (guildId: string) => {
    const { data } = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/player/${guildId}/resume`, { method: 'POST' }, ResponseDataType.JSON)
    const { status, error } = data as QueueTrackResponse
    if(status == 'ok') return true
    throw error
}