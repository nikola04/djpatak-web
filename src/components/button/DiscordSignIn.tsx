export default function DiscordButton({ onClick }: {
    onClick: () => void
}){
    return <button className="text-white-gray" onClick={() => onClick()}>Login</button>
}