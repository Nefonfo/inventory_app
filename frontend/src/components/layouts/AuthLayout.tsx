import { WrapperComponent } from "@/types/types"
import { Package2 } from "lucide-react"

export const AuthLayout = ({ children }: WrapperComponent) => {
    return (
        <div className="dark:bg-slate-950 h-full w-full content-center lg:content-normal grid lg:grid-cols-2 xl:min-h-[800px]">
            <div className="hidden bg-muted lg:flex lg:flex-col dark:bg-slate-600 bg-slate-950 lg:items-center lg:justify-center px-8">
                <Package2 className="text-slate-50 h-40 w-40 pb-6" />
                <h2 className="text-slate-50 text-3xl italic font-light">"The best way to manage your inventory"</h2>
            </div>
            <div className="flex items-center justify-center py-12">
                {children}
            </div>
        </div>
    )
}
