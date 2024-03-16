"use client"

import { SessionProvider as NextSessionProvider } from "next-auth/react";

type SessionProviderProps = {
    children?: any
}

export default function SessionProvider({ children }: SessionProviderProps) {
    return (
        <NextSessionProvider>
            {children}
        </NextSessionProvider>
    )
}