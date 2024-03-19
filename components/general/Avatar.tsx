import { useMemo } from "react"

type AvatarProps = {
    className?: string,
    size?: number,
    seed?: string
}

export default function Avatar({ className, size, seed = 'vide1' }: AvatarProps) {
    return (
        <div className={`rounded-full flex items-center justify-center bg-primary text-sm leading-none`} style={{ height: size, width: size }}>
            <p>{seed[0].toUpperCase()}</p>
        </div>
    )
}