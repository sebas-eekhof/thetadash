"use client"

import { cn } from "@/utils/cn";
import { DotsMenuIcon } from "@/utils/dashboard/icons";
import { useCallback, useState } from "react";
import { type IconType } from "react-icons";
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from "next/navigation";

type DotsMenuProps = {
    className?: string,
    options: Array<{
        title: string,
        href?: string,
        onClick?: () => void | Promise<void>,
        icon?: IconType
    }>
}

export default function DotsMenu({ className, options }: DotsMenuProps) {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();

    const onClick = useCallback(async (option: DotsMenuProps['options'][0]) => {
        if(option.onClick)
            await Promise.resolve(option.onClick());
        else if(option.href)
            router.push(option.href);
        setOpen(false);
    }, [])

    return (
        <div className={cn(
            `relative`,
            className
        )}>
            <button className={`text-secondary hover:text-foreground transition-colors`} onClick={() => setOpen(!open)}>
                <DotsMenuIcon size={20} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{
                                opacity: 0
                            }}
                            animate={{
                                opacity: 0.5
                            }}
                            exit={{
                                opacity: 0
                            }}
                            className={`bg-black fixed top-0 left-0 bottom-0 right-0 backdrop z-40 flex items-center justify-center`}
                            onClick={e => (e.target as any).classList.contains('backdrop') ? setOpen(false) : undefined}
                        />
                        <motion.div
                            initial={{
                                top: `50%`,
                                opacity: 0
                            }}
                            animate={{
                                top: `100%`,
                                opacity: 1
                            }}
                            exit={{
                                top: `50%`,
                                opacity: 0
                            }}
                            className={`absolute right-0 w-48 bg-element-dark rounded-lg overflow-hidden z-50`}
                        >
                            {(options || []).map((option, key) => (
                                <button
                                    className={cn(
                                        `w-full px-4 py-4 text-xs flex items-center space-x-4 hover:bg-element`
                                    )}
                                    key={key}
                                    onClick={() => onClick(option)}
                                >
                                    <div className={`w-4 h-4`}>
                                        {option.icon && (
                                            <option.icon size={16} />
                                        )}
                                    </div>
                                    <p>{option.title}</p>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}