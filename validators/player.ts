import { playerPreferences, Repeat } from "../types/player"

export const isRepeat = (value: unknown): value is Repeat => {
    return value === "track" || value === "queue" || value === "off"
}

export const isValidPlayerPreferences = (playerPreferences: any): playerPreferences is playerPreferences => {
    if(!Object.hasOwn(playerPreferences, 'repeat') || !Object.hasOwn(playerPreferences, 'volume')) return false
    if(!isRepeat(playerPreferences.repeat)) return false
    if(Number.isNaN(Number(playerPreferences.volume))) return false 
    return true
}