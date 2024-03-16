"use client"

import { useEffect, useMemo, useState } from "react"
import Web3 from "web3";
// @ts-ignore
import * as thetajs from "@thetalabs/theta-js";
import { SSRGetEncoderStatus } from "@/ssr/EdgeLauncher";
import type { EncoderStatus } from "@/utils/ssr/classes/EdgeLauncher";
import { compact, reduce } from "lodash";

const servers: string[] = [
    'host-cloud.truefiction.cloud',
    'host.portal3.nl',
    'de02.twelion.com'
]

export default function Homepage() {
    const [statusses, setStatusses] = useState<Array<{ host: string, encoder: EncoderStatus }> | undefined>(undefined);

    async function test() {
        const res = await Promise.all(
            servers.map(host => SSRGetEncoderStatus(host).then(encoder => ({ host, encoder })))
        )
        setStatusses(res);
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
        return statusses.map(item => item.encoder.recent_jobs.map(job => ({ ...job, host: item.host }))).reduce((a, b) => [...a, ...b]).sort((a, b) => new Date(a.create_time) < new Date(b.create_time) ? 1 : -1)
    }, [statusses])

    return (
        <div className={`flex flex-col`}>
            {statusses && (
                <div className={`grid grid-cols-4`}>
                    {statusses.map((item, key) => (
                        <div className={`flex flex-col bg-gray-700 rounded p-4`} key={key}>
                            <p className={`font-bold text-lg`}>{item.host}</p>
                            <p>{item.encoder.pending_tfuel} <span className={`text-xs`}>pending TFUEL</span></p>
                            <p>{item.encoder.recent_jobs.length} <span className={`text-xs`}>jobs</span></p>
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
                            <td className={`pb-4`}>TFUEL</td>
                            <td className={`pb-4`}>Status</td>
                            <td className={`pb-4`}>Finished at</td>
                        </tr>
                    </thead>
                    <tbody>
                        {allJobs.map((job, key) => {
                            const created_at = new Date(job.create_time);
                            const finished_at = new Date(job.finish_time);
                            return (
                                <tr key={key}>
                                    <td className={`py-2`}>{created_at.getDate().toString().padStart(2, '0')}-{created_at.getMonth().toString().padStart(2, '0')}-{created_at.getFullYear()} {created_at.getHours().toString().padStart(2, '0')}:{created_at.getMinutes().toString().padStart(2, '0')}:{created_at.getSeconds().toString().padStart(2, '0')}</td>
                                    <td className={`py-2`}>{job.host}</td>
                                    <td className={`py-2`}>{parseInt(job.reward_tfuelwei) / 1000000000000000000}</td>
                                    <td className={`py-2`}>{job.is_failed ? 'Failed' : 'Success'}</td>
                                    <td className={`py-2`}>{finished_at.getDate().toString().padStart(2, '0')}-{finished_at.getMonth().toString().padStart(2, '0')}-{finished_at.getFullYear()} {finished_at.getHours().toString().padStart(2, '0')}:{finished_at.getMinutes().toString().padStart(2, '0')}:{finished_at.getSeconds().toString().padStart(2, '0')}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}