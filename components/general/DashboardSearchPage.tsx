import { PlusIcon, SearchIcon } from "@/utils/dashboard/icons";
import { useTranslations } from "next-intl";
import { IconType } from "react-icons";

type DashboardSearchPageProps = {
    newButton?: {
        title: string,
        icon?: IconType
    },
    children?: any
}

export default function DashboardSearchPage({ newButton, children }: DashboardSearchPageProps) {
    const t = useTranslations();

    return (
        <div className={`flex flex-col space-y-6`}>
            <div className={`flex items-center`}>
                <div className={`h-12 w-72 bg-element-dark rounded-lg flex items-center`}>
                    <SearchIcon className={`text-secondary ml-4`} />
                    <input type={`text`} className={`flex-grow px-4 h-full bg-transparent text-sm`} placeholder={t('general.search_placeholder')} />
                </div>
                {newButton && (
                    <div className={`ml-auto flex items-center space-x-4`}>
                        <button className={`h-12 px-4 bg-element-dark hover:bg-element transition-colors rounded-lg flex items-center space-x-2 text-sm text-secondary-active`}>
                            {newButton.icon ? (
                                <newButton.icon size={18} />
                            ) : (
                                <PlusIcon size={18} />
                            )}
                            <p>{newButton.title}</p>
                        </button>
                    </div>
                )}
            </div>
            {children}
        </div>
    )
}