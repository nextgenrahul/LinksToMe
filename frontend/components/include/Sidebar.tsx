"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "@/public/sidebarImg/sidebar.css";
import homeLight from "@/public/sidebarImg/homelight.svg";
import homeDark from "@/public/sidebarImg/homeDark.svg";
import bellDark from "@/public/sidebarImg/bellDark.svg";
import bellLight from "@/public/sidebarImg/bellLight.svg";
import exploreDark from "@/public/sidebarImg/exploreDark.svg";
import exploreLight from "@/public/sidebarImg/exploreLight.svg";
import mailDark from "@/public/sidebarImg/mailDark.svg";
import mailLight from "@/public/sidebarImg/mailLight.svg";
import profileDark from "@/public/sidebarImg/profileDark.svg";
import profileLight from "@/public/sidebarImg/profileLight.svg";
import lightAi from "@/public/sidebarImg/lightAi.svg";
import darkAi from "@/public/sidebarImg/darkAi.svg";
// import moreOpt from "@/public/sidebarImg/moreOpt.svg";
// import homeDark from "@/public/sidebarImg/homeDark.svg";
// import homeDark from "@/public/sidebarImg/homeDark.svg";

interface NavItem {
  name: string;
  href: string;
  mainImg: string;
  hoverImg: string;
}

const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/home",
    mainImg: homeDark,
    hoverImg: homeLight,
  },
  {
    name: "Search",
    href: "/search",
    mainImg: exploreDark,
    hoverImg: exploreLight,
  },
  {
    name: "Notifications",
    href: "/notifications",
    mainImg: bellDark,
    hoverImg: bellLight,
  },
  {
    name: "Messages",
    href: "/messages",
    mainImg: mailDark,
    hoverImg: mailLight,
  },
  { name: "Query Me", href: "/query", mainImg: darkAi, hoverImg: lightAi },
  // { name: "Bookmarks", href: "/bookmarks", mainImg: SideBarImg.bookmarkDark, hoverImg: SideBarImg.bookmarkLight },
  // { name: "Communities", href: "/communities", mainImg: SideBarImg.groupDark, hoverImg: SideBarImg.groupLight },
  // { name: "Premium", href: "/premium", mainImg: SideBarImg.crownDark, hoverImg: SideBarImg.crownLight },
  {
    name: "Profile",
    href: "/profile",
    mainImg: profileDark,
    hoverImg: profileLight,
  },
  // { name: "More", href: "/more", mainImg: SideBarImg.moreDark, hoverImg: SideBarImg.moreLight },
];

// const moreSection = {
//     name: "More",
//     mainImg: moreOpt
// }

export default function SidebarLayout() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-40 z-50 flex-col bg-black text-white w-64">
        <div className="flex items-center justify-center h-16">
          <div className="keyboard">
            <span className="key">L</span>
            <span className="key">i</span>
            <span className="key">n</span>
            <span className="key">k</span>
            <span className="key">s</span>
            <span className="key">To</span>
            <span className="key">Me</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-4 px-3 py-3 text-xl font-medium rounded-full transition-all hover:bg-zinc-900 ${
                  active ? "bold-text" : ""
                }`}
              >
                <Image
                  src={active ? item.mainImg : item.hoverImg}
                  alt={item.name}
                  width={30}
                  height={30}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
