'use client'
import Cookies from 'js-cookie';

import Router from "next/router"
export enum ResponseDataType {
    JSON,
    Text
}

export type APIResponse = {
    status: number,
    data: any,
    error?: any
}

const attemptRequest = async (input: string | URL, attempt: number, useCooldown?: boolean, responseType?: ResponseDataType, init?: RequestInit): Promise<APIResponse> =>  {
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

export default async function apiRequest(_input: string, init?: RequestInit, responseType?: ResponseDataType, useCooldown?: boolean): Promise<APIResponse>{
    const csrf = Cookies.get('csrf_token')
    const input = new URL(_input)
    if(csrf) input.searchParams.set('csrf', csrf)
    const { status, data } = await attemptRequest(input, useCooldown ? 2 : 1, useCooldown, responseType, init);
    if(status != 401) return ({ status, data })
    // try to refresh token
    const { status: refrStatus, data: rfrData } = await attemptRequest(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh`, 0, false, ResponseDataType.JSON, {
        method: 'POST'
    })
    if(refrStatus == 200 && rfrData.status == 'ok') return await attemptRequest(input, useCooldown ? 2 : 1, useCooldown, responseType, init)
    Router.push(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL!)
    return ({ status, data })
}