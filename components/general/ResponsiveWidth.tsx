import { cn } from "@/utils/cn"

type ResponsiveWidthProps = {
    children?: any,
    className?: string,
    id?: string,
    padded?: boolean,
    smallPadded?: boolean
}

export const ResponsiveWidthClassName: string = cn(
    'w-full mx-auto px-8',
    '2xl:max-w-screen-xl 2xl:px-0',
    'xl:max-w-screen-lg',
    'lg:max-w-screen-md',
    'md:max-w-screen-md'
)

export default function ResponsiveWidth({ children, className, id, padded, smallPadded }: ResponsiveWidthProps) {
    return (
        <div id={id} className={cn(
            ResponsiveWidthClassName,
            padded && 'py-20',
            smallPadded && 'py-12',
            className
        )}>{children}</div>
    )
}