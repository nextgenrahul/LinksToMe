"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import config from "./config";

interface CustomizerContextState {
  isMobileSidebar: boolean;
  setIsMobileSidebar: (value: boolean) => void;

  activeDir: "ltr" | "rtl";
  setActiveDir: (dir: "ltr" | "rtl") => void;

  activeMode: "light" | "dark";
  setActiveMode: (mode: "light" | "dark") => void;

  activeTheme: string;
  setActiveTheme: (theme: string) => void;

  activeLayout: "vertical" | "horizontal";
  setActiveLayout: (layout: "vertical" | "horizontal") => void;

  isCardShadow: boolean;
  setIsCardShadow: (shadow: boolean) => void;

  isLayout: "boxed" | "full";
  setIsLayout: (layout: "boxed" | "full") => void;

  isBorderRadius: number;
  setIsBorderRadius: (radius: number) => void;

  isCollapse: "full-sidebar" | "icon-only";
  setIsCollapse: (collapse: "full-sidebar" | "icon-only") => void;

  isLanguage: string;
  setIsLanguage: (lang: string) => void;
}

// ✅ No undefined context allowed
export const CustomizerContext = createContext<CustomizerContextState>(
  {} as CustomizerContextState
);

interface ProviderProps {
  children: ReactNode;
}

export const CustomizerContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const [activeDir, setActiveDir] = useState<"ltr" | "rtl">(config.activeDir ?? "ltr");
  const [activeMode, setActiveMode] = useState<"light" | "dark">(config.activeMode ?? "light");
  const [activeTheme, setActiveTheme] = useState(config.activeTheme ?? "blue_theme");
  const [activeLayout, setActiveLayout] = useState<"vertical" | "horizontal">(config.activeLayout ?? "vertical");
  const [isCardShadow, setIsCardShadow] = useState(config.isCardShadow ?? true);
  const [isLayout, setIsLayout] = useState<"boxed" | "full">(config.isLayout ?? "full");
  const [isBorderRadius, setIsBorderRadius] = useState<number>(config.isBorderRadius ?? 8);
  const [isCollapse, setIsCollapse] = useState<"full-sidebar" | "icon-only">(config.isCollapse ?? "full-sidebar");
  const [isLanguage, setIsLanguage] = useState(config.isLanguage ?? "en");

  useEffect(() => {
    const root = document.documentElement;
    root.className = activeMode;
    root.setAttribute("dir", activeDir);
    root.setAttribute("data-color-theme", activeTheme);
    root.setAttribute("data-layout", activeLayout);
    root.setAttribute("data-boxed-layout", isLayout);
    root.setAttribute("data-sidebar-type", isCollapse);
    root.style.setProperty("--border-radius", `${isBorderRadius}px`);
  }, [activeMode, activeDir, activeTheme, activeLayout, isLayout, isCollapse, isBorderRadius]);

  return (
    <CustomizerContext.Provider
      value={{
        isMobileSidebar,
        setIsMobileSidebar,
        activeDir,
        setActiveDir,
        activeMode,
        setActiveMode,
        activeTheme,
        setActiveTheme,
        activeLayout,
        setActiveLayout,
        isCardShadow,
        setIsCardShadow,
        isLayout,
        setIsLayout,
        isBorderRadius,
        setIsBorderRadius,
        isCollapse,
        setIsCollapse,
        isLanguage,
        setIsLanguage,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};
