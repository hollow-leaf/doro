"use client";
import {
  Home,
  Dices,
  Wallet,
  PlusSquare
} from "lucide-react";
import { ReactNode, createContext } from "react";

export interface Link {
  href: string;
  label: string;
  icon: ReactNode;
  iconSelected?: ReactNode;
}

interface LinksContextValue {
  links: Link[];
}

export const NavLinksContext = createContext<LinksContextValue>(
  {} as LinksContextValue,
);

export const NavLinksProvider = ({ children }: { children: ReactNode }) => {
  const links: Link[] = [
    {
      href: "/client",
      label: "Lobby",
      icon: <Home size={26} />,
      iconSelected: <Home size={26} strokeWidth={2.5} />,
    },
    {
      href: "/client/doro",
      label: "Doro",
      icon: <Dices size={26} />,
      iconSelected: <Dices size={26} strokeWidth={2.5} />,
    },
    {
      // 其实这个add的href没用，因为add是一个modal，不是一个页面
      href: "/client/add",
      label: "Add",
      icon: <PlusSquare size={26} strokeWidth={2.5} />,
    },
    {
      href: "/client/profile",
      label: "Profile",
      icon: <Wallet size={26} />,
      iconSelected: <Wallet size={26} strokeWidth={2.5} />,
    }
  ];
  return (
    <NavLinksContext.Provider value={{ links }}>
      {children}
    </NavLinksContext.Provider>
  );
};
