// app/(main)/layout.tsx

import SidebarLayout from "@/components/include/Sidebar";
import RightPanel from "@/components/RightPanel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex justify-center min-h-screen bg-black text-white">
      {/* Left Sidebar (25%) */}
      <div className="hidden xl:block w-[25%] border-r border-zinc-800">
        <SidebarLayout />
      </div>

      {/* Center Feed (children change here dynamically) */}
      <div className="w-full sm:w-[100%] md:w-[70%] xl:w-[50%] border-r border-zinc-800">
        {children}
      </div>

      {/* Right Panel (25%) */}
      <div className="hidden xl:block w-[25%] p-4">
        <RightPanel />
      </div>
    </main>
  );
}
