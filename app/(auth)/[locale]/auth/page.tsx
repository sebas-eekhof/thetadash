import AuthLoginForm from '@/components/auth/AuthLoginForm';
import { type I18nPageProps } from '@/i18n';
import IMG_Icon from '@/images/branding/icon-white.png';
import { Link } from '@/utils/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

export default async function AuthPage({ params: { locale }}: I18nPageProps) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('auth');

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
            <h1 className={`text-center font-medium text-2xl mt-6`}>{t('welcome_back')}</h1>
            <p className={`text-center text-secondary mt-2`}>{t('no_account_yet')} <Link href={`/auth/signup`} className={`text-primary-light hover:text-primary transition-colors`}>{t('create_one_for_free')}</Link></p>
            <AuthLoginForm />
        </div>
    )
}