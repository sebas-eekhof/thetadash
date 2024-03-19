import { cn } from "@/utils/cn";
import { Link } from "@/utils/navigation";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";

type AuthProviderButtonProps = {
    icon: StaticImageData,
    name: string,
    className?: string,
    onClick?: () => void
}

export default function AuthProviderButton({ icon, name, className, onClick }: AuthProviderButtonProps) {
    const t = useTranslations('auth');

    return (
        <button
            onClick={onClick}
            className={cn(
                'h-10 w-full rounded-lg flex items-center space-x-4 px-4 transition-colors',
                className
            )}
        >
            <Image
                src={icon}
                alt={name}
                width={20}
                height={20}
            />
            <p className={`font-medium font-sans text-sm`}>{t('sign_in_with', { provider: name })}</p>
        </button>
    )
}