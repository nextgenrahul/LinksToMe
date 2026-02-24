// // src/layout/MainLayout.jsx
// import { Outlet } from "react-router-dom";
// import SidebarLayout from "./sidebarLayout/SidebarLayout";
// // import RightPanel from "./rightLayout/RightPanel";

// export default function MainLayout() {
//   return (
//     <div className="flex min-h-screen overflow-hidden justify-center bg-black text-white">
//       <div className="hidden sm:block w-20 lg:w-64 h-screen shrink-0">
//         <SidebarLayout />
//       </div>

//       <main className="max-w-250 h-screen overflow-y-auto border-x border-zinc-800 no-scrollbar">
//         <Outlet />
//       </main>

//       {/* <div className="hidden lg:block w-87.5 h-screen shrink-0 p-4">
//         <RightPanel />
//       </div> */}
//     </div>
//   );
// }

import { Outlet } from "react-router-dom";
import SidebarLayout from "./sidebarLayout/SidebarLayout";

export default function MainLayout() {
  return (
    <>
      <div className="flex min-h-screen bg-black text-white ">
        <div className="hidden sm:block w-20 lg:w-64 ml-30 h-screen shrink-0">
          <SidebarLayout />
        </div>

        <main className="flex-1 h-screen overflow-y-auto border-l border-zinc-800 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </>
  );
}
