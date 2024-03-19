"use client"

import { cn } from "@/utils/cn";
import { Formik, type FormikProps } from "formik";

type FormProps = {
    initialValues?: Record<string, any>,
    onSubmit?: (data: any) => void | Promise<void>,
    children?: JSX.Element | JSX.Element[] | ((props: FormikProps<Record<string, any>>) => JSX.Element),
    className?: string,
    disableSpacing?: boolean
}

export default function Form({
    initialValues,
    onSubmit,
    children,
    className,
    disableSpacing
}: FormProps) {
    return (
        <Formik
            initialValues={initialValues || {}}
            onSubmit={values => onSubmit ? onSubmit(values) : undefined}
        >
            {(props) => (
                <form className={cn(
                    `flex flex-col w-full`,
                    !disableSpacing && 'space-y-4',
                    className
                )} onSubmit={props.handleSubmit}>
                    {(typeof children === "function") ? children(props) : children}
                </form>
            )}
        </Formik>
    )
}