"use server"

import EdgeLauncher from "@/utils/ssr/classes/EdgeLauncher"

export async function SSRGetEncoderStatus(host: string) {
    const launcher = new EdgeLauncher(host);
    return await launcher.getEncoderStatus();
}