'use client'
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { QueueTrack } from "@/types/soundcloud";

let ws: WebSocket|null = null

export function useSockets(): { ready: true, socket: WebSocket };
export function useSockets(): { ready: false, socket: WebSocket|null };
export function useSockets(){
    const [socket, setSocket] = useState<WebSocket|null>(ws);
    const [ready, setReady] = useState<boolean>(false)

    useEffect(() => {
        if(ws && ws.readyState != WebSocket.CLOSED && ws.readyState != WebSocket.CLOSING){
            setSocket(ws)
        }else{
            const csrf = Cookies.get('csrf_token')
            const url = new URL(process.env.NEXT_PUBLIC_API_URL!)
            if(csrf) url.searchParams.set('csrf', csrf)
            ws = new WebSocket(url.href);
            ws.onopen = () => {
                console.log('WebSocket connection opened')
            };
            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };
            setSocket(ws);
        }
        return () => {
            setReady(false)
            ws?.close();
        };
    }, []);

    useEffect(() => {
        if(socket?.readyState == WebSocket.OPEN) setReady(true)
        else setReady(false)
    }, [socket?.readyState])
    return { socket, ready }
}


type EventType = 'now-playing'|'new-queue-song'|'queue-end'|'pause'|'resume'
export class socketEventHandler{
    private eventsMap: Map<EventType, (data?: any) => any>
    constructor(socket: WebSocket, playerId: string){
        this.eventsMap = new Map()
        socket.send(JSON.stringify({
            event: 'subscribe',
            data: {
                playerId
            }
        }))
        socket.addEventListener('message', (message) => {
            try{
                const messageData = JSON.parse(message.data)
                if(!messageData.event || !messageData.data) return
                const { event, data } = messageData
                const func = this.eventsMap.get(event)
                if(func) func(data)
            }catch(err){
                console.error(err)
            }
        })
    }
    public subscribe(ev: 'now-playing'|'new-queue-song', handler: (track: QueueTrack) => any): void;
    public subscribe(ev: Exclude<EventType, 'now-playing'|'new-queue-song'>, handler: () => any): void;
    public subscribe(ev: EventType, handler: (arg?: any) => any){
        this.eventsMap.set(ev, handler)
    }
    public destroy(){
        this.eventsMap.clear()
    }
}