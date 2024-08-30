import { volume } from "@/utils/controlls"
import { FaBalanceScaleRight } from "react-icons/fa"

export type Repeat = "track"|"queue"|"off"

export type playerPreferences = {
    repeat: Repeat,
    volume: number
}