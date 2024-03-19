import { useField } from "formik";
import { type HTMLInputTypeAttribute } from "react"

type AuthInputProps = {
    name: string,
    type?: HTMLInputTypeAttribute,
    label: string,
    placeholder?: string
}

export default function AuthInput({ name, type = 'text', label, placeholder }: AuthInputProps) {
    const [field] = useField({
        name,
        required: true,
        type,
        placeholder
    });

    return (
        <div className={`flex flex-col space-y-2`}>
            <label className={`text-xs font-medium uppercase`}>{label} *</label>
            <div className={`bg-element w-full rounded-lg h-10`}>
                <input
                    {...field}
                    name={name}
                    className={`h-full w-full bg-transparent text-foreground text-sm px-4`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}