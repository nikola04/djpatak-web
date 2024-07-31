import Image from 'next/image'
export default function DiscordButton({ onClick }: {
    onClick: () => void
}){
    return <button className="text-white-gray rounded-md bg-blue-light" onClick={() => onClick()}>
        <span>
            <div className={"flex px-4 py-1"}>
                <p>Continue with</p>
                <Image src={"/discord-logo.svg"} alt={"Discord Logo"} height={20} width={20} className={"ml-2"}/>
            </div>
        </span>
    </button>
}