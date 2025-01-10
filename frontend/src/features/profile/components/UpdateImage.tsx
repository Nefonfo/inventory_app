import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UpdateImageSchema } from "@/features/profile/types"
import { useSubmitProfile } from "@/features/profile/hooks"

export const UpdateImage = () => {
  const [open, setOpen] = useState(false)
  const { fetch: submitProfile, isLoading, LoadingSpinner } = useSubmitProfile("profile")

  const form = useForm<z.infer<typeof UpdateImageSchema>>({
    resolver: zodResolver(UpdateImageSchema),
  })

  const submitAndClose = async (data: z.infer<typeof UpdateImageSchema>) => {
    if (data.user_photo === null || data.user_photo === undefined) {
      data.user_photo = ""
    }
    await submitProfile(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Photo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile Photo</DialogTitle>
          <DialogDescription>
            If you want to remove your profile photo, please leave the field
            empty.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading && <LoadingSpinner />}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitAndClose)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="user_photo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        disabled={isLoading}
                        placeholder="Picture"
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
