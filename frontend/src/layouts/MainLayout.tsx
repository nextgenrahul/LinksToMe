import { Outlet } from 'react-router-dom';
import SidebarLayout from './sidebarLayout/SidebarLayout'; // Your sidebar code
import RightPanel from './rightLayout/RightPanel';

export default function MainLayout() {
  return (
    <div className="flex">
      <SidebarLayout />
      <main className="flex-1">
        <Outlet />  
      </main>
      <RightPanel />
    </div>
  );
}