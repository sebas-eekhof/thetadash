"use server"

import EdgeLauncher, { EdgeLauncherConfig } from "@/utils/ssr/classes/EdgeLauncher"

export async function SSRGetEncoderStatus(host: string, config: Partial<EdgeLauncherConfig> = {}) {
    try {
        const launcher = new EdgeLauncher(host, config);
        return await launcher.getEncoderStatus();
    } catch(e) {
        console.log(host);
        throw e;
    }
}

export async function SSRGetLavitaJobs(host: string, config: Partial<EdgeLauncherConfig> = {}) {
    try {
        const launcher = new EdgeLauncher(host, config);
        return await launcher.getLavitaJobs();
    } catch(e) {
        console.log(host);
        throw e;
    }
}