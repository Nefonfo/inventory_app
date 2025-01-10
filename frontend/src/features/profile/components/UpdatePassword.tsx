import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { UpdatePasswordSchema } from "@/features/profile/types"
import { PasswordDTO } from "@/types"
import { useSubmitProfile } from "@/features/profile/hooks"

export const UpdatePassword = () => {
  const {
    fetch: submitPassword,
    isLoading,
    LoadingSpinner,
  } = useSubmitProfile("password")
  const defaultValues = {
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  }

  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (data: z.infer<typeof UpdatePasswordSchema>) => {
    const submitData: PasswordDTO = {
      new_password: data.new_password,
      old_password: data.old_password,
    }
    submitPassword(submitData)
    form.reset(defaultValues)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="container mx-auto grid w-auto lg:w-[850px] my-4 gap-6"
      >
        {
          !isLoading ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Old Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="New Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="new_password_confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <LoadingSpinner />
            </div>
          )
        }
        <div className="grid grid-cols-1 gap-4 w-auto lg:w-[200px] mx-auto">
          <Button type="submit" className="w-full" disabled={isLoading}>
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  )
}
