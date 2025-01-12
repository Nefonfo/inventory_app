import { z } from "zod"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertsHandler } from "@/components/custom_ui"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useRecoverPasswordMutation } from "@/features/auth/api"
import { RecoverFormSchema } from "@/features/auth/types/schemas"

export const RecoverPassword = () => {
  const form = useForm<z.infer<typeof RecoverFormSchema>>({
    resolver: zodResolver(RecoverFormSchema),
    defaultValues: {
      email: "",
    },
  })
  const [recoverPassword, { isLoading, isSuccess, isError, error}] =
    useRecoverPasswordMutation()

  const handleSubmit = async (data: z.infer<typeof RecoverFormSchema>) => {
    await recoverPassword(data)
    form.reset()
  }

  const displayError = isError ? error.data : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto grid w-[350px] gap-6"
      >
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold dark:text-slate-50">
            Recover Password
          </h1>
          <p className="text-balance text-muted-foreground dark:text-slate-100">
            Enter your email below to recover your account
          </p>
        </div>
        {
            isError && <AlertsHandler data={displayError} alert_type="destructive" />
        }
        {
            isSuccess && <AlertsHandler data={{success: "Email sent successfully"}} />
        }
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <Link
                to="/auth/login"
                className="ml-auto inline-block text-sm underline"
              >
                You know the password?
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Send Recovery Email
          </Button>
        </div>
      </form>
    </Form>
  )
}
