import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UpdateInformationSchema } from '@/features/profile/types/schemas'
import { UpdateInformationProps } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';



export const UpdateInformation = ({ onSuccess }: UpdateInformationProps) => {

    const { user } = useSelector((state: RootState) => state.auth)

    const defaultValues = {
        username: user?.username ? user.username : '',
        email: user?.email ? user.email : '',
        first_name: user?.first_name ? user.first_name : '',
        last_name: user?.last_name ? user.last_name : '',
    }

    const form = useForm<z.infer<typeof UpdateInformationSchema>>({
        resolver: zodResolver(UpdateInformationSchema),
        defaultValues: defaultValues
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSuccess)} className='container mx-auto grid w-auto lg:w-[850px] my-4 gap-6'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 w-auto lg:w-[200px] mx-auto">
                    <Button type="submit" className="w-full">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    )
}