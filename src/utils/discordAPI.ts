export enum UserType {
    Bot = 'Bot',
    User = 'Bearer'
}

export type DiscordResponse = {
    status: number,
    data: any|null,
    retry_after?: number
}

export default async function DiscordAPI(endpoint: string, type: UserType, token: string): Promise<DiscordResponse>{
    const url = process.env.DISCORD_API! + endpoint
    return await fetch(url, {
        headers: {
            Authorization: `${type} ${token}`,
        },
        cache: 'no-cache'
    }).then(async res => {
        if(!res.ok){
            if(res.status == 429) return ({ data: null, status: res.status, retry_after: (await res.json())?.retry_after })
            return ({ data: null, status: res.status } )
        }
        return ({ data: await res.text(), status: res.status } )
    }).then(res => {
        if(res.data == null) return res
        try{
            return ({ ...res, data: JSON.parse(res.data) })
        }catch(err){
            console.error(err)
            return ({ status: 500, data: null });
        }
    });
}