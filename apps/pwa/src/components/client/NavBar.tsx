"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { NavLinksContext } from "@/context/NavLinksProvider";
export default function NavBar({ className }: { className?: string }) {
  const path = usePathname();
  const { links } = useContext(NavLinksContext);
  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 flex h-[5.5rem] w-full select-none items-center justify-around overflow-hidden border-t backdrop-blur backdrop-saturate-200 ",
          className,
        )}
      >
        {links.map((link) => {
          if (link.href.startsWith("/client")) {
            return (
              <Link
                href={link.href}
                key={link.label}
                className="mb-9 flex flex-col items-center  rounded-xl bg-opacity-40 px-4 py-2"
              >
                {path === link.href ? link.iconSelected : link.icon}
              </Link>
            );
          }
        })}
      </nav>
      <div className="h-[5.5rem] w-full "></div>
    </>
  );
}
