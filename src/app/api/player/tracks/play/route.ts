import { SoundcloudTrack } from '@/types/soundcloud'
import { forceGetVoiceConnection } from '@/utils/discordVoice'
import { createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice'
import playDl from 'play-dl'

playDl.getFreeClientID().then((clientID: string) => {
    playDl.setToken({
      soundcloud : {
          client_id : clientID
      }
    })
})

export async function POST(req: Request){
    try{
        const { track } : { track: SoundcloudTrack|null } = await req.json()
        // const { track } = response
        if(!track) return new Response("No track provided")
        const guildId = "717387013216796733"
        const channelId = "876223342246510593"
        const connection = await forceGetVoiceConnection(guildId, channelId)
        if(!connection) return new Response("No connection")
        const stream = playDl.stream(track.permalink_url)
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })

        player.play(resource)

        connection.subscribe(player)
        return new Response("OK")
    }catch(err){
        console.log(err)
        return new Response("Error", { status: 500})
    }
}