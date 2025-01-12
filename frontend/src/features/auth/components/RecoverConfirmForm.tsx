import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams, Link } from "react-router-dom"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"

import { AlertsHandler } from "@/components/custom_ui"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  useValidatePasswordMutation,
  useConfirmPasswordMutation,
} from "@/features/auth/api"
import { RecoverConfirmFormSchema } from "@/features/auth/types"


export const RecoverConfirmForm = () => {
  const { token } = useParams()
  const [
    validatePassword,
    { isLoading: tokenLoading, isError: tokenIsError, error: tokenError },
  ] = useValidatePasswordMutation()
  const [confirmPassword, { isLoading, isSuccess, isError }] =
    useConfirmPasswordMutation()

  const form = useForm<z.infer<typeof RecoverConfirmFormSchema>>({
    resolver: zodResolver(RecoverConfirmFormSchema),
    defaultValues: { token, password: "" },
  })

  const handleSubmit = async (
    data: z.infer<typeof RecoverConfirmFormSchema>
  ) => {
    await confirmPassword(data)
    form.reset()
  }

  useEffect(() => {
    if (token) {
      validatePassword({ token })
    }
  }, [token, validatePassword])

  const displayError = tokenIsError ? tokenError.data : null

  return (
    <div className="mx-auto grid w-[500px] gap-6">
      {tokenLoading ? (
        <Spinner>
          <h6 className="text-slate-750 font-light text-xl">Loading</h6>
        </Spinner>
      ) : tokenIsError ? (
        <div className="grid gap-2 text-center">
          <AlertsHandler data={displayError} alert_type="destructive" />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mx-auto grid w-[350px] gap-6"
          >
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold dark:text-slate-50">
                Recover Password Confirmation
              </h1>
              <p className="text-muted-foreground dark:text-slate-100">
                Enter your new password below to recover your account
              </p>
            </div>
            {isError && (
              <AlertsHandler data={displayError} alert_type="destructive" />
            )}
            {isSuccess && (
              <AlertsHandler
                data={{ success: "Password changed successfully" }}
              />
            )}
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSuccess && (
                <div className="flex items-center">
                  <Link to="/auth/login" className="ml-auto text-sm underline">
                    Return to Login
                  </Link>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
