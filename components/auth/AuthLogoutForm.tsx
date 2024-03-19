"use client"

import { SpinnerIcon } from "@/utils/dashboard/icons";
import { useRouter } from "@/utils/navigation";
import { signOut, useSession } from "next-auth/react"
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function AuthLogoutForm() {
    const { status, data, update } = useSession();
    const t = useTranslations('auth');
    const router = useRouter();

    useEffect(() => {
        if(status === 'unauthenticated')
            router.push('/auth');
    }, [status]);
    
    return (
        <>
            {['loading', 'unauthenticated'].includes(status) ? (
                <div className={`py-12 flex items-center justify-center`}>
                    <SpinnerIcon className={`animate-spin`} />
                </div>
            ) : (
                <div className={`flex flex-col mt-8`}>
                    {data?.user && (
                        <div className={`flex items-center space-x-4`}>
                            <div className={`h-12 w-12 rounded-full bg-cover`} style={{
                                backgroundImage: `url(${data.user.image})`
                            }} />
                            <p>{data.user.name}</p>
                        </div>
                    )}
                    <button
                        onClick={() => signOut({
                            redirect: true,
                            callbackUrl: '/'
                        })}
                        className={`bg-element w-full h-12 rounded-lg hover:bg-element-dark transition-colors mt-8`}
                    >{t('signout')}</button>
                </div>
            )}
        </>
    )
}