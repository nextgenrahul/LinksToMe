import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/sidebar.css";
import { navigation } from "../constants/sidebar.constants";
import { Link, useLocation } from "react-router-dom";

export default function SidebarLayout() {
  const location = useLocation();
  const pathname = location.pathname;

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
    <aside className="hidden md:flex inset-y-0 left-40 z-50 flex-col text-white w-64">
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

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`relative flex items-center gap-4 px-3 py-3 text-xl font-medium rounded-full transition-all hover:bg-zinc-900 ${
                active ? "font-bold" : ""
              }`}
            >
              <img
                src={active ? item.mainImg : item.hoverImg}
                alt={item.name}
                width={30}
                height={30}
              className="text-gray-700 dark:text-gray-300"
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
