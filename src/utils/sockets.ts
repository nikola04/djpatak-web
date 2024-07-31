'use client'
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { QueueTrack } from "../../types/soundcloud";
import { Repeat } from "../../types/player";

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
            // ws?.close(); // no need to close because its singletone
            // connection should stay so it would work on other pages
        };
    }, []);

    useEffect(() => {
        if(socket?.readyState == WebSocket.OPEN) setReady(true)
        else setReady(false)
    }, [socket?.readyState])
    return { socket, ready }
}


type EventType = 'now-playing'|'new-queue-song'|'queue-end'|'pause'|'resume'|'repeat'
export class socketEventHandler{
    private eventsMap: Map<EventType, (data?: any) => any>
    private socket: WebSocket
    private messageEvent: (message: MessageEvent) => void
    constructor(socket: WebSocket, playerId: string){
        this.eventsMap = new Map()
        this.socket = socket
        this.messageEvent = (message: MessageEvent) => {
            try{
                const messageData = JSON.parse(message.data)
                if(!messageData.event) return
                const { event, data } = messageData
                const func = this.eventsMap.get(event)
                if(func && data != null) func(data)
                else if(func) func()
            }catch(err){
                console.error(err)
            }
        }
        this.socket.addEventListener('message', this.messageEvent)
        this.socket.send(JSON.stringify({
            event: 'subscribe',
            data: {
                playerId
            }
        }))
    }
    public subscribe(ev: 'now-playing'|'new-queue-song', handler: (track: QueueTrack) => any): void;
    public subscribe(ev: 'repeat', handler: (repeat: Repeat) => any): void;
    public subscribe(ev: Exclude<EventType, 'now-playing'|'new-queue-song'|'repeat'>, handler: () => any): void;
    public subscribe(ev: EventType, handler: (arg?: any) => any){
        this.eventsMap.set(ev, handler)
    }
    public destroy(){
        this.eventsMap.clear()
        this.socket.removeEventListener('message', this.messageEvent)
        this.messageEvent = () => {}
    }
}