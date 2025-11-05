// app/components/SidebarLayout.tsx
"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import { Icon } from "@iconify/react";
import profileImg from "/public/images/profile/user-1.jpg";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navigation: NavItem[] = [
  { name: "Home", href: "/", icon: "tabler:home" },
  { name: "Explore", href: "/explore", icon: "tabler:search" },
  { name: "Notifications", href: "/notifications", icon: "tabler:bell" },
  { name: "Messages", href: "/messages", icon: "tabler:message-circle" },
  { name: "Lists", href: "/lists", icon: "tabler:list" },
  { name: "Bookmarks", href: "/bookmarks", icon: "tabler:bookmark" },
  { name: "Communities", href: "/communities", icon: "tabler:users" },
  { name: "Premium", href: "/premium", icon: "tabler:premium-rights" },
  { name: "Profile", href: "/profile", icon: "tabler:user-circle" },
  { name: "More", href: "/more", icon: "tabler:dots" },
];

export default function SidebarLayout() {
  const { isCollapse } = useContext(CustomizerContext);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isExpanded = isCollapse === "full-sidebar" || hovered;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden xl:flex fixed inset-y-0 left-0 z-50 flex-col bg-black text-white transition-all duration-300"
        style={{ width: isExpanded ? "16rem" : "5rem" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4">
          <Icon
            icon="tabler:brand-x"
            className={`text-white transition-all ${isExpanded ? "text-3xl" : "text-4xl"}`}
            aria-hidden="true"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1" role="navigation">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 text-xl font-medium rounded-full transition-all relative ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-100 hover:bg-zinc-900 hover:text-white"
                } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black`}
                prefetch={true}
              >
                <Icon
                  icon={item.icon}
                  className={`flex-shrink-0 transition-all ${isExpanded ? "mr-4 text-2xl" : "text-3xl"}`}
                  aria-hidden="true"
                />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all ${
                    isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                  }`}
                >
                  {item.name}
                </span>
                {active && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                )}
                <span className="sr-only">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Post Button */}
        <div className="p-3">
          <button
            className={`w-full flex items-center justify-center rounded-full font-bold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
              isExpanded
                ? "bg-white text-black px-6 py-3 text-base"
                : "bg-white text-black p-3"
            }`}
            aria-label="Post"
          >
            {isExpanded ? "Post" : <Icon icon="tabler:pencil" className="text-2xl" />}
          </button>
        </div>

        {/* Profile */}
        <div className="p-3 border-t border-zinc-800">
          <div className="flex items-center space-x-3">
            <Image
              src={profileImg}
              alt="Mathew"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
            <div
              className={`flex-1 overflow-hidden transition-all ${
                isExpanded ? "	opacity-100" : "opacity-0 w-0"
              }`}
            >
              <p className="text-sm font-semibold text-white">Mathew</p>
              <p className="text-xs text-zinc-400">@mathew_design</p>
            </div>
            <Icon icon="tabler:dots" className="text-zinc-400 text-xl" aria-hidden="true" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 z-50"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`p-3 rounded-full transition-colors ${
                  active ? "text-white" : "text-zinc-500"
                } focus:outline-none focus:ring-2 focus:ring-white`}
                prefetch={false}
              >
                <Icon icon={item.icon} className="text-2xl" aria-hidden="true" />
                <span className="sr-only">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}