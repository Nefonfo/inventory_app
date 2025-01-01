import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { ErrorsHandlerProps } from "@/components/types/types"


export const ErrorsHandler = ({ errors }: ErrorsHandlerProps) => {
    
    if (typeof errors === 'string') {
        errors = { "Backend error, please contact support.": errors.slice(0, 80) + '...' }
    }

    return (
        <div className="w-full">
            {errors && (
                Object.keys(errors).map((key, index) => (
                    <Alert key={index} variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Error {key}</AlertTitle>
                        <AlertDescription>
                            {errors[key]}
                        </AlertDescription>
                    </Alert>
                ))
            )}
        </div>
    )
}