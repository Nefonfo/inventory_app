import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertsHandlerProps } from "@/components/types/types"

export const AlertsHandler = ({
  data,
  alert_type = "default",
}: AlertsHandlerProps) => {
  if (typeof data === "string") {
    data = {
      "Backend error, please contact support.": data.slice(0, 80) + "...",
    }
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      {data &&
        Object.keys(data).map((key, index) => (
          <Alert key={index} variant={alert_type}>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>
              {alert_type === "default" ? "Information " : "Error "} {key}
            </AlertTitle>
            <AlertDescription>{data[key]}</AlertDescription>
          </Alert>
        ))}
    </div>
  )
}
