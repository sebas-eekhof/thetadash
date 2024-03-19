"use client"

import { useTranslations } from "next-intl";
import Form from "../general/Form";
import AuthInput from "./AuthInput";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthProviderButton from "./AuthProviderButton";
import IMG_Google from '@/images/providers/google_g.svg';
import IMG_Microsoft from '@/images/providers/microsoft.svg';
import { signIn, useSession } from 'next-auth/react';
import { SpinnerIcon } from "@/utils/dashboard/icons";
import { useRouter } from "@/utils/navigation";
import { useEffect } from "react";

export default function AuthLoginForm() {
    const { status } = useSession();
    const t = useTranslations('auth');
    const router = useRouter();

    useEffect(() => {
        if(status === 'authenticated')
            router.push('/dashboard')
    }, [status]);

    return (
        <>
            {['loading', 'authenticated'].includes(status) ? (
                <div className={`py-12 flex items-center justify-center`}>
                    <SpinnerIcon className={`animate-spin`} />
                </div>
            ) : (
                <>
                <Form className={`mt-8`}>
                    <AuthInput
                        name={`email`}
                        type={`email`}
                        label={t('email')}
                        placeholder={t('email_placeholder')}
                    />
                    <AuthInput
                        name={`password`}
                        type={`password`}
                        label={t('password')}
                        placeholder={`********`}
                    />
                    <AuthSubmitButton label={t('signin')} />
                </Form>
                <div className={`flex items-center my-8`}>
                    <div className={`w-1/3 h-px bg-border-dark flex-shrink-0`} />
                    <div className={`w-1/3 flex items-center justify-center`}>
                        <p>{t('or')}</p>
                    </div>
                    <div className={`w-1/3 h-px bg-border-dark flex-shrink-0`} />
                </div>
                <div className={`flex flex-col space-y-4`}>
                    <AuthProviderButton
                        icon={IMG_Google}
                        name={`Google`}
                        className={`bg-white text-black hover:bg-element hover:text-foreground`}
                        onClick={() => signIn('google', {
                            redirect: true,
                            callbackUrl: '/dashboard'
                        })}
                    />
                    <AuthProviderButton
                        icon={IMG_Microsoft}
                        name={`Microsoft`}
                        className={`bg-white text-black hover:bg-element hover:text-foreground`}
                    />
                    {/* <AuthProviderButton
                        icon={MicrosoftIcon}
                        text={`Inloggen met Microsoft`}
                        className={`bg-[#00A4EF] hover:bg-[#137bab]`}
                    />
                    <AuthProviderButton
                        icon={GithubIcon}
                        text={`Inloggen met GitHub`}
                        className={`bg-[#24292e] hover:bg-[#2b3137]`}
                    /> */}
                </div>
                </>
            )}
        </>
    )
}