import { Link } from "react-router-dom"
import { Menu, Package2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { HeaderProps } from "@/components/types"
import { getInitials } from "@/lib/utils"

export const Header = ({
  display_name,
  user_photo,
  logoutAction,
}: HeaderProps) => {
  const navLinks = [
    {
      name: "Dashboard",
      to: "/dashboard",
    },
    {
      name: "Inventory",
      to: "/dashboard/stock",
    },
    {
      name: "Products",
      to: "/dashboard/product",
    },
  ]

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Inventory App</span>
        </Link>
        {navLinks.map(({ to, name }) => (
          <Link
            key={name}
            to={to}
            className="text-foreground transition-colors hover:text-foreground"
          >
            {name}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Inventory App</span>
            </Link>
            {navLinks.map(({ to, name }) => (
              <Link key={name} to={to} className="hover:text-foreground">
                {name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src={`${import.meta.env.VITE_BACKEND_URL}${user_photo}`}
                />
                <AvatarFallback>{getInitials(display_name)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Welcome, {display_name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/dashboard/profile">
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutAction}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
