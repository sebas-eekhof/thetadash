import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales } from "@/i18n";
import { useLocale } from "next-intl";

export const localePrefix = 'always';
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales: Object.keys(locales), localePrefix });

export function useHref() {
    const locale = useLocale();

    return (href: string): string => `/${locale}${href}`;
}