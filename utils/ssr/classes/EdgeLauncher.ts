import axios from "axios";

type EdgeLauncherConfig = {
    encoder_rpc_port: number,
    launcher_rpc_port: number,
    edgecore_rpc_port: number
}

type RpcRequestProps = {
    method: string,
    params?: any[]
}

export type EncoderStatus = {
    status: 'ok',
    encoder_status: string,
    pending_tfuel: number,
    recent_jobs: Array<{
        is_failed: boolean,
        failed_at: string,
        create_time: string,
        error: string,
        type: string,
        id: string,
        reward_tfuelwei: string,
        finish_time: string,
        start_time: string
    }>
}

export type LavitaJob = {
    id: string,
    start_time: number,
    end_time: number,
    status: string,
    reward_amount: number,
    error: string
}

export type EdgeCoreVersion = {
    version: string,
    git_hash: string,
    timestamp: string
}

export type EdgeCoreStatus = {
    address: string,
    chain_id: string,
    peer_id: string,
    current_height: string,
    current_time: string
}

export default class EdgeLauncher {
    host: string;
    config: EdgeLauncherConfig;

    constructor(host: string, config: Partial<EdgeLauncherConfig> = {}) {
        this.host = host;
        this.config = {
            encoder_rpc_port: config?.encoder_rpc_port || 17935,
            launcher_rpc_port: config?.launcher_rpc_port || 15888,
            edgecore_rpc_port: config?.edgecore_rpc_port || 17888
        }
    }

    async getEdgeCoreStatus(): Promise<EdgeCoreStatus> {
        return await this.__rpcRequest('edgecore', {
            method: 'edgecore.GetStatus'
        });
    }

    async getEdgeNodeHolder(): Promise<string> {
        return (await this.__rpcRequest('edgecore', {
            method: 'edgecore.GetEdgeNodeSummary'
        })).Summary;
    }

    async getEdgeCoreVersion(): Promise<EdgeCoreVersion> {
        return await this.__rpcRequest('edgecore', {
            method: 'edgecore.GetVersion'
        });
    }

    async getEncoderStatus(): Promise<EncoderStatus> {
        return await this.__rpcRequest('encoder', {
            method: 'edgeencoder.GetTVAStatus'
        });
    }

    async getPeers(): Promise<string[]> {
        return await this.__rpcRequest('edgecore', {
            method: 'edgecore.GetPeers'
        });
    }

    async getLavitaJobs(page: number = 0, limit: number = 100): Promise<LavitaJob[]> {
        return (await this.__rpcRequest('launcher', {
            method: 'edgelauncher.GetPastJobs',
            params: [
                {
                    type: 'lavita',
                    page,
                    num: limit
                }
            ]
        })).body;
    }

    async __rpcRequest(endpoint: 'encoder' | 'launcher' | 'edgecore', { method, params }: RpcRequestProps) {
        return (await axios.request({
            url: `http://${this.host}:${this.config[endpoint === 'encoder' ? 'encoder_rpc_port' : endpoint === 'edgecore' ? 'edgecore_rpc_port' : 'launcher_rpc_port']}/rpc`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                jsonrpc: '2.0',
                method,
                params: params || [],
                id: 1
            }
        })).data.result;
    }
}