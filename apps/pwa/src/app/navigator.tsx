'use client'
import { NavigationMenuLink, NavigationMenuList, NavigationMenu } from "@/components/ui/navigation-menu"
import Link from "next/link";

import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex h-14 items-center border-b border-gray-700 px-4 md:px-6">
        <Link className="mr-6" href="#">
          <Package2Icon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <div className="flex w-full justify-center">
          <NavigationMenu className="flex md:hidden">
            <NavigationMenuList>
              <NavigationMenuLink asChild>
                <Link
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-gray-300 focus:bg-gray-700 focus:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-700/50 data-[state=open]:bg-gray-700/50"
                  href="#"
                >
                  Lobby
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-gray-300 focus:bg-gray-700 focus:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-700/50 data-[state=open]:bg-gray-700/50"
                  href="#"
                >
                  Roulette
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-gray-300 focus:bg-gray-700 focus:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-700/50 data-[state=open]:bg-gray-700/50"
                  href="#"
                >
                  Info
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="ml-auto">
          <Button className="bg-gray-800 text-white">Get Started</Button>
        </div>
      </header>
    </div>
  )
}

function Package2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}