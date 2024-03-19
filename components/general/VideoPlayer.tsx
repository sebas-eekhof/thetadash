"use client"

import { PlayIcon } from "@/utils/dashboard/icons";
import { useState } from "react"

type VideoPlayerProps = {
    src: string,
    title?: string,
    subtitle?: string,
    description?: string,
    thumb?: string
}

export default function VideoPlayer({ src, title, subtitle, thumb }: VideoPlayerProps) {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <div
            className={`bg-element rounded-xl overflow-hidden relative`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={`absolute top-0 left-0 w-full pt-8 px-8`}>
                <p className={`text-2xl font-bold`}>{title}</p>
                <p className={`text-sm`}>{subtitle}</p>
            </div>
            <div className={`absolute bottom-0 left-0 w-full flex items-center`}>
                <button>
                    <PlayIcon />
                </button>
            </div>
            {/* {thumb && (
                <img
                    src={thumb}
                    alt={title}
                    className={`w-full h-full absolute top-0 left-0 bottom-0 right-0`}
                />
            )} */}
            <video className={`w-full h-full`} controls>
                <source src={src} />
            </video>
        </div>
    )
}