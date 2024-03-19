import Image from "next/image";
import IMG_Icon from '@/images/branding/icon-white.png';
import { type I18nPageProps } from "@/i18n";
import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/utils/navigation";

export default function SignupPage({ params: { locale }}: I18nPageProps) {
    unstable_setRequestLocale(locale);

    const t = useTranslations('auth');

    return (
        <div className={`flex flex-col`}>
            <div className={`flex items-center justify-center`}>
                <Image
                    src={IMG_Icon}
                    alt={`Vide1 logo`}
                    unoptimized
                    width={72}
                    height={72}
                />
            </div>
            <h1 className={`text-center font-medium text-2xl mt-6`}>{t('create_a_account')}</h1>
            <p className={`text-center text-secondary mt-2`}>{t('already_registered')} <Link href={`/auth`} className={`text-primary-light hover:text-primary transition-colors`}>{t('sign_in_instead')}</Link></p>
            
        </div>
    )
}