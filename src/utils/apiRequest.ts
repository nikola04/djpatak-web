export enum ResponseDataType {
    JSON,
    Text
}

export type APIResponse = {
    status: number,
    data: any,
    error?: any
}

const attemptRequest = async (input: string | URL | globalThis.Request, attempt: number, useCooldown?: boolean, responseType?: ResponseDataType, init?: RequestInit): Promise<APIResponse> =>  {
    return await fetch(input, init).then(async (res) => {
        if(res.status == 429 && useCooldown){
            const cooldown = (await res.json())?.retry_after;
            if(cooldown) 
                return await new Promise((res, rej) => setTimeout(async () => {
                    res(await attemptRequest(input, attempt + 1, useCooldown, responseType, init))
                }, Number(cooldown) + 5))
        }
        if(res.status == 429 && attempt < 3)
            return await new Promise((res, rej) => setTimeout(async () => {
                res(await attemptRequest(input, attempt + 1, useCooldown, responseType, init))
            }, attempt * 100))
        else if(!res.ok)
            return ({ status: res.status, data: null, error: await res.text() })
        let data;
        if(responseType == ResponseDataType.JSON) 
            data = await res.json()
        else if(responseType == ResponseDataType.Text)
            data = await res.text()
        else data = await res.text()
        return ({ status: res.status, data })
    })
}

export default async function apiRequest(input: string | URL | globalThis.Request, init?: RequestInit, responseType?: ResponseDataType, useCooldown?: boolean): Promise<APIResponse>{
    return await attemptRequest(input, useCooldown ? 2 : 1, useCooldown, responseType, init);
}