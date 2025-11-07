"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "@/public/sidebarImg/sidebar.css";
import homeLight from "@/public/sidebarImg/homeLight.svg";
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
import globalLight from "@/public/sidebarImg/globalLight.svg";
import globalDark from "@/public/sidebarImg/globalDark.svg";
import bookmarkdark from "@/public/sidebarImg/bookmarkdark.svg";
import bookmarklight from "@/public/sidebarImg/bookmarklight.svg";
import more from "@/public/sidebarImg/more.svg";

interface NavItem {
  name: string;
  href: string;
  mainImg: string;
  hoverImg: string;
}

interface MoreItem {
  name: string;
  href: string;
  mainImg: string;
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
  {
    name: "Query Me",
    href: "/query",
    mainImg: darkAi,
    hoverImg: lightAi,
  },
  {
    name: "Global",
    href: "/global",
    mainImg: globalDark,
    hoverImg: globalLight,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    mainImg: bookmarkdark,
    hoverImg: bookmarklight,
  },
  {
    name: "Profile",
    href: "/profile",
    mainImg: profileDark,
    hoverImg: profileLight,
  },
  { name: "More", href: "/more", mainImg: more, hoverImg: more },
];
const toggleMore: MoreItem[] = [
  {
    name: "Chat",
    href: "/chat",
    mainImg: "",
  },
  {
    name: "Chat",
    href: "/chat",
    mainImg: "",
  },
  {
    name: "Chat",
    href: "/chat",
    mainImg: "",
  },
];

const moreMenu = [
  { name: "Chat", href: "/i/chat" },
  { name: "Monetization", href: "/i/monetization" },
  { name: "Ads", href: "https://ads.x.com", external: true },
  { name: "Spaces", href: "/i/spaces/start" },
  { name: "Settings & Privacy", href: "/settings" },
];

export default function SidebarLayout() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const toggleMore = () => setIsMoreOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-40 z-50 flex-col bg-black text-white w-64 border-r-twitter">
        <div className="flex items-center justify-center h-16">
          <div className="keyboard">
            <span className="key">L</span>
            <span className="key">i</span>
            <span className="key">n</span>
            <span className="key">k</span>
            <span className="key">s</span>
            <span className="key">To</span>
            <span className="key">M</span>
            <span className="key">e</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mb-6">
          {navigation.map((item) => {
            const active = isActive(item.href);

            if (item.name === "More") {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4  px-3 py-3 text-xl font-medium rounded-full transition-all hover:bg-zinc-900 ${
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
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-4 px-3 py-3 text-xl font-medium rounded-full transition-all hover:bg-zinc-900 ${
                  active ? "font-bold" : ""
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