import { sidebarIcons } from "../assets/sidebarImg";

export interface NavItem {
  name: string;
  href: string;
  mainImg: string;
  hoverImg: string;
}

export interface MoreItem {
  name: string;
  href: string;
  mainImg: string;
}

export const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/home",
    mainImg: sidebarIcons.homeDark,
    hoverImg:sidebarIcons.homeLight,
  },
  {
    name: "Search",
    href: "/search",
    mainImg: sidebarIcons.exploreDark,
    hoverImg: sidebarIcons.exploreLight,
  },
  {
    name: "Notifications",
    href: "/notifications",
    mainImg: sidebarIcons.bellDark,
    hoverImg: sidebarIcons.bellLight,
  },
  {
    name: "Messages",
    href: "/messages",
    mainImg: sidebarIcons.mailDark,
    hoverImg: sidebarIcons.mailLight,
  },
  {
    name: "Query Me",
    href: "/query",
    mainImg: sidebarIcons.darkAi,
    hoverImg: sidebarIcons.lightAi,
  },
  {
    name: "Global",
    href: "/global",
    mainImg: sidebarIcons.globalDark,
    hoverImg: sidebarIcons.globalLight,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    mainImg: sidebarIcons.bookmarkdark,
    hoverImg: sidebarIcons.bookmarklight,
  },
  {
    name: "Profile",
    href: "/profile",
    mainImg: sidebarIcons.profileDark,
    hoverImg: sidebarIcons.profileLight,
  },
  { name: "More", href: "/more", mainImg: sidebarIcons.more, hoverImg: sidebarIcons.more },
];


export const toggleMore: MoreItem[] = [
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

export const moreMenu = [
  { name: "Chat", href: "/i/chat" },
  { name: "Monetization", href: "/i/monetization" },
  { name: "Ads", href: "https://ads.x.com", external: true },
  { name: "Spaces", href: "/i/spaces/start" },
  { name: "Settings & Privacy", href: "/settings" },
];
