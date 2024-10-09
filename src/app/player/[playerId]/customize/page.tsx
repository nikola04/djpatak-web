"use client"
import { Role } from "@/../types/discord"
import SwitchWithRef from "@/components/ui/Switch"
import { generateRoleColorSet } from "@/utils/frontend"
import { useGuildRoles } from "@/utils/player"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"

export default function CustomizePage({ params: { playerId }}: {
    params: {
        playerId: string
    }
}){
    // const { user } = useAuth()
    const { data: roles } = useGuildRoles(playerId) 
    const [allowedPlayRoles, setAllowedPlayRoles] = useState(roles)
    useEffect(() => {
        setAllowedPlayRoles(roles)
    }, [roles])
    return <div className="px-3 py-5">
        <div className="p-2">
            <h1 className="text-black-light dark:text-white-default font-bold text-xl">Customize Permissions</h1>
        </div>
        <div className="flex flex-col p-2 max-w-screen-lg gap-2">
            <BlockWithRolesToAllow title="Start & Add to Queue" description="Allow everyone to start playing music and add songs to queue" roles={roles} allowedRoles={allowedPlayRoles} setAllowedRoles={setAllowedPlayRoles} />
            <BlockWithRolesToAllow title="Pause, Resume, Skip and Stop" description="Allow everyone to resume player, pause, stop and skip song" roles={roles} allowedRoles={allowedPlayRoles} setAllowedRoles={setAllowedPlayRoles} />
            <BlockWithRolesToAllow title="Player Controlls" description="Allow everyone to change volume and repeat" roles={roles} allowedRoles={allowedPlayRoles} setAllowedRoles={setAllowedPlayRoles} />
            {/* for each add allowed roles with vote */}
            {/* <div>allowed roles to use commands</div> */}
            {/* <div>allowed roles to stop song</div> */}
        </div>
    </div>
}

function BlockWithRolesToAllow({ title, description, roles, allowedRoles, setAllowedRoles }: {
    title: string,
    description: string,
    roles: Role[],
    allowedRoles: Role[],
    setAllowedRoles: Dispatch<SetStateAction<Role[]>>
}){
    const [allowEveryone, setAllowEveryone] = useState<boolean>(true)
    const removeRole = useCallback((id: string) => {
        setAllowedRoles((prev) => prev.filter(r => r.id != id))
    }, [roles, allowedRoles])
    return <div className="text-black-light dark:text-white-gray py-2">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-bold">{title}</p>
                <p className="text-black-light dark:text-white-gray text-sm text-opacity-70 dark:text-opacity-70">{description}</p>
            </div>
            <SwitchWithRef
				checked={allowEveryone}
				bgColor="dark:bg-[#323241] bg-gray-200"
				bgOnColor="bg-blue-light"
				onColor="bg-white-default"
				onIcon={<FaCheck size={12} className="text-blue-light" />}
				onChange={() => setAllowEveryone(prev => !prev)}
				disabled={true}
			/>
        </div>
        { !allowEveryone && <div className="flex flex-wrap gap-1.5 py-4">
            { allowedRoles.map((role => {
                const [primary, secondary] = generateRoleColorSet(role.color)
                return <div className="flex items-center bg-black-light pl-2 pr-1 py-0.5 rounded-lg" style={{ backgroundColor: primary, color: secondary }}>
                    <p className="text-sm">{ role.name.trim() }</p>
                    <button onClick={() => removeRole(role.id)}>
                        <IoIosClose className="text-xl" style={{ color: secondary }}/>
                    </button>
                </div>
            }))}
        </div> }
    </div>
}