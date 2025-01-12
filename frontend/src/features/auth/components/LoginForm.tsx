import { z } from "zod"
import { useForm } from "react-hook-form"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"

import { AlertsHandler } from "@/components/custom_ui/AlertsHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoginFormProps, LoginFormSchema } from "@/features/auth/types"
import { Link } from "react-router-dom"

export const LoginForm = ({ onSuccess, errors, loading }: LoginFormProps) => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSuccess)}
        className="mx-auto grid w-[350px] gap-6"
      >
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold dark:text-slate-50">Login</h1>
          <p className="text-balance text-muted-foreground dark:text-slate-100">
            Enter your username below to login to your account
          </p>
        </div>
        <AlertsHandler data={errors} alert_type="destructive" />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
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
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <Link
                to="/auth/recover"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}
