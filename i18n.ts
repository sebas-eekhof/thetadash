import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { type StaticImageData } from 'next/image';

import FLAG_EN from '@/images/flags/us.svg';
import FLAG_NL from '@/images/flags/nl.svg';
// import FLAG_DE from '@/images/flags/de.svg';
// import FLAG_FR from '@/images/flags/fr.svg';
// import FLAG_ES from '@/images/flags/es.svg';

type Locale = {
    title: string,
    flag: StaticImageData
}

export const locales: Record<string, Locale> = {
    en: {
        title: 'English',
        flag: FLAG_EN
    },
    nl: {
        title: 'Nederlands',
        flag: FLAG_NL
    },
    // de: {
    //     title: 'Deutsch',
    //     flag: FLAG_DE
    // },
    // fr: {
    //     title: 'Français',
    //     flag: FLAG_FR
    // },
    // es: {
    //     title: 'Español',
    //     flag: FLAG_ES
    // }
}

export type I18nPageProps = {
    params: {
        locale: string
    }
}
 
export default getRequestConfig(async ({locale}) => {
    if (!Object.keys(locales).includes(locale as any)) notFound();

    return {
        messages: (await import(`./messages/${locale}.json`)).default
    };
});