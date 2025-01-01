import { getInitials } from "@/lib/utils"
import { UpdateImage } from "@/features/profile/components"
import { UpdateProfileProps } from "@/features/profile/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const UpdateProfile = ({ user, onUpdateImage }: UpdateProfileProps) => {

    const display_name = `${user.first_name} ${user.last_name}`

    return (
        <div className="w-full flex flex-col gap-y-10 items-center justify-center">
            <div className="max-w-[800px] w-full flex flex-col md:flex-row gap-x-8 gap-y-4 items-center">
                <Avatar className="w-20 h-20 md:w-32 md:h-32">
                    {user.user_photo && <AvatarImage src={`http://localhost:8000/${user.user_photo}`} />}
                    <AvatarFallback className="text-xl md:text-3xl">{getInitials(display_name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-y-3 justify-center items-center md:items-start">
                    <h1 className="text-center md:text-start text-3xl dark:text-slate-50">Welcome Back, <span className="font-bold">{display_name}</span></h1>
                    <UpdateImage onSuccess={onUpdateImage} />
                </div>
            </div>
            <Tabs defaultValue="general" className="w-full lg:w-3/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General Information</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <h1>account</h1>
                </TabsContent>
                <TabsContent value="password">
                    <h1>password</h1>
                </TabsContent>
            </Tabs>
        </div>
    )
}