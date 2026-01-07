// src/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import SidebarLayout from './sidebarLayout/SidebarLayout';
import RightPanel from './rightLayout/RightPanel';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen justify-center bg-black text-white">
      {/* 1. Fixed Sidebar - Hidden on mobile, shown on md+ */}
      <div className="hidden sm:block w-20 lg:w-64">
         <SidebarLayout />
      </div>

      {/* 2. Dynamic Center - The main feed */}
      <main className="flex-1 max-w-150 border-x border-zinc-800">
        <Outlet />  
      </main>

      {/* 3. Right Panel - Hidden on lg and smaller to save space */}
      <div className="hidden lg:block w-87.5 p-4">
        <RightPanel />
      </div>
    </div>
  );
}