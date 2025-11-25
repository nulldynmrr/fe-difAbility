"use client";

import Navbar from "@/components/layout/Navbar";
import SidebarPencariKerja from "@/components/layout/Sidebar";

export default function onSidebarJobSeeker({ children }) {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      <div className="flex">
        <aside
          className="
            hidden 
            md:block
            w-72 
            h-screen 
            fixed 
            top-16 
            left-0 
            border-r 
            border-border 
            bg-white 
            dark:bg-dark-bg
            px-4
            py-6
          "
        >
          <SidebarPencariKerja />
        </aside>

        <main
          className="
            flex-1 
            pt-16 
            ml-0 md:ml-[300px] 
            px-2 md:p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
