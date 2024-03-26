"use client"

import { useEffect, useMemo, useState } from "react"
import { SSRGetEncoderStatus, SSRGetLavitaJobs } from "@/ssr/EdgeLauncher";
import type { EdgeLauncherConfig, EncoderStatus, LavitaJob } from "@/utils/ssr/classes/EdgeLauncher";
import Image from "next/image";
import IMG_TFUEL from '@/images/icons/tfuel.svg';
import IMG_LAVITA from '@/images/icons/lavita.jpeg';

const servers: Array<{ host: string, config?: Partial<EdgeLauncherConfig> }> = [
    { host: 'host-cloud.truefiction.cloud' },
    { host: 'host.portal3.nl' },
    { host: 'de02.twelion.com' },
    // { host: 'de02.twelion.com', config: { edgecore_rpc_port: 17878, launcher_rpc_port: 15878 } },
    { host: 'dock01.truefiction.cloud' },
    { host: '91.196.168.134' }
]

export default function Homepage() {
    const [statusses, setStatusses] = useState<Array<{ host: string, encoder: EncoderStatus, lavitaJobs: LavitaJob[] }> | undefined>(undefined);

    async function test() {
        const res1 = await Promise.all(
            servers.map(host => SSRGetEncoderStatus(host.host, host.config).then(encoder => ({ host, encoder })))
        )
        const res2 = await Promise.all(
            servers.map(host => SSRGetLavitaJobs(host.host, host.config).then(jobs => ({ host, jobs })))
        )
        setStatusses(servers.map(server => {
            const encoder = res1.filter(item => item.host === server);
            const lavitaJobs = res2.filter(item => item.host === server);
            return {
                host: server.host,
                encoder: encoder[0].encoder,
                lavitaJobs: lavitaJobs[0].jobs
            }
        }));
        // const web3 = new Web3('https://eth-rpc-api.thetatoken.org/rpc');
        // const balance = web3.utils.fromWei(await web3.eth.getBalance('0x792a58282cb1304fc29a67b79c90a7ec474cb64a'), 'ether');
        // console.log(balance)
        // setRes(balance);
        // const provider = new thetajs.providers.HttpProvider();
        // const account = await provider.getAccount("0x792a58282cb1304fc29a67b79c90a7ec474cb64a");
        // setRes({ account })
    }

    useEffect(() => {
        test();
    }, []);

    const allJobs = useMemo(() => {
        if(!statusses) return [];
        let jobs: Array<{
            created_at: Date,
            host: string,
            reward: number,
            reward_type: 'tfuel' | 'lavita',
            status: string,
            finished_at: Date
        }> = [];
        for(const status of statusses) {
            for(const tfueljob of status.encoder.recent_jobs)
                jobs.push({
                    host: status.host,
                    created_at: new Date(tfueljob.create_time),
                    finished_at: new Date(tfueljob.finish_time),
                    reward: parseInt(tfueljob.reward_tfuelwei) / 1000000000000000000,
                    reward_type: 'tfuel',
                    status: tfueljob.error ? 'Error' : 'Success'
                });
            for(const lavitajob of status.lavitaJobs)
                jobs.push({
                    host: status.host,
                    created_at: new Date(lavitajob.start_time),
                    finished_at: new Date(lavitajob.end_time),
                    reward: lavitajob.reward_amount / 1000000000000000000,
                    reward_type: 'lavita',
                    status: lavitajob.status
                })
        }
        return jobs.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    }, [statusses])

    return (
        <div className={`flex flex-col`}>
            {statusses && (
                <div className={`grid grid-cols-4`}>
                    <div className={`flex flex-col space-y-1 bg-gray-700 rounded p-4`}>
                        <p className={`font-bold text-lg`}>Total</p>
                        <div className={`flex items-center space-x-2 text-sm`}>
                            <Image
                                src={IMG_TFUEL}
                                alt={`TFUEL`}
                                width={20}
                                height={20}
                                className={`rounded-full`}
                            />
                            <p>{statusses.reduce((a, b) => a + b.encoder.pending_tfuel, 0)}</p>
                        </div>
                        <div className={`flex items-center space-x-2 text-sm`}>
                            <Image
                                src={IMG_LAVITA}
                                alt={`LAVITA`}
                                width={20}
                                height={20}
                                className={`rounded-full`}
                            />
                            <p>{statusses.reduce((a, b) => a + b.lavitaJobs.reduce((a, b) => a + b.reward_amount, 0) / 1000000000000000000, 0)}</p>
                        </div>
                        <p>{statusses.reduce((a, b) => a + (b.encoder.recent_jobs.length), 0)} <span className={`text-xs`}>encoder jobs</span></p>
                        <p>{statusses.reduce((a, b) => a + (b.lavitaJobs.length), 0)} <span className={`text-xs`}>AI jobs</span></p>
                        <p>{statusses.reduce((a, b) => a + (b.lavitaJobs.length + b.encoder.recent_jobs.length), 0)} <span className={`text-xs`}>jobs</span></p>
                    </div>
                    {statusses.map((item, key) => (
                        <div className={`flex flex-col space-y-1 bg-gray-700 rounded p-4`} key={key}>
                            <p className={`font-bold text-lg`}>{item.host}</p>
                            <div className={`flex items-center space-x-2 text-sm`}>
                                <Image
                                    src={IMG_TFUEL}
                                    alt={`TFUEL`}
                                    width={20}
                                    height={20}
                                    className={`rounded-full`}
                                />
                                <p>{item.encoder.pending_tfuel}</p>
                            </div>
                            <div className={`flex items-center space-x-2 text-sm`}>
                                <Image
                                    src={IMG_LAVITA}
                                    alt={`LAVITA`}
                                    width={20}
                                    height={20}
                                    className={`rounded-full`}
                                />
                                <p>{item.lavitaJobs.reduce((a, b) => a + b.reward_amount, 0) / 1000000000000000000}</p>
                            </div>
                            <p>{item.encoder.recent_jobs.length} <span className={`text-xs`}>encoder jobs</span></p>
                            <p>{item.lavitaJobs.length} <span className={`text-xs`}>AI jobs</span></p>
                        </div>
                    ))}
                </div>
            )}
            {allJobs && (
                <table className={`mt-8 w-full`}>
                    <thead>
                        <tr className={`font-bold`}>
                            <td className={`pb-4`}>Created at</td>
                            <td className={`pb-4`}>Host</td>
                            <td className={`pb-4`}>Reward</td>
                            <td className={`pb-4`}>Status</td>
                            <td className={`pb-4`}>Finished at</td>
                        </tr>
                    </thead>
                    <tbody>
                        {allJobs.map((job, key) => (
                            <tr key={key}>
                                <td className={`py-2`}>{job.created_at.getDate().toString().padStart(2, '0')}-{job.created_at.getMonth().toString().padStart(2, '0')}-{job.created_at.getFullYear()} {job.created_at.getHours().toString().padStart(2, '0')}:{job.created_at.getMinutes().toString().padStart(2, '0')}:{job.created_at.getSeconds().toString().padStart(2, '0')}</td>
                                <td className={`py-2`}>{job.host}</td>
                                <td className={`py-2`}>{job.reward} {job.reward_type}</td>
                                <td className={`py-2`}>{job.status}</td>
                                <td className={`py-2`}>{job.finished_at.getDate().toString().padStart(2, '0')}-{job.finished_at.getMonth().toString().padStart(2, '0')}-{job.finished_at.getFullYear()} {job.finished_at.getHours().toString().padStart(2, '0')}:{job.finished_at.getMinutes().toString().padStart(2, '0')}:{job.finished_at.getSeconds().toString().padStart(2, '0')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}