import { SpinnerIcon } from "@/utils/dashboard/icons";
import { useFormikContext } from "formik"

type AuthSubmitButtonProps = {
    label?: string
}

export default function AuthSubmitButton({ label }: AuthSubmitButtonProps) {
    const { isSubmitting } = useFormikContext();

    return (
        <button className={`w-full h-10 rounded-lg bg-element flex items-center justify-center text-sm hover:bg-element-dark transition-colors`} type={`submit`}>
            {isSubmitting ? (
                <SpinnerIcon className={`animate-spin`} />
            ) : (
                <p>{label}</p>
            )}
        </button>
    )
}