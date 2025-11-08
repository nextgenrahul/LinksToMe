// app/home/page.tsx

import FeedLayout from "@/components/FeedLayout";
import SidebarLayout from "@/components/include/Sidebar";
import RightPanel from "@/components/RightPanel";

export default function HomePage() {
  return (
    <main className="flex justify-center min-h-screen bg-black text-white">
      {/* Left Sidebar (25%) */}
      <div className="hidden xl:block w-[25%] border-r border-zinc-800">
        <SidebarLayout />
      </div>

      {/* Center Feed (50%) */}
      <div className="w-full sm:w-[100%] md:w-[70%] xl:w-[50%] border-r border-zinc-800">
        <FeedLayout />
      </div>

      {/* Right Panel (25%) */}
      <div className="hidden xl:block w-[25%] p-4">
        <RightPanel />
      </div>
    </main>
  );
}
