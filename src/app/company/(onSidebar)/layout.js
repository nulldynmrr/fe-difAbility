"use client";

import Navbar from "@/components/layout/Navbar";
import { SidebarPemberiKerja } from "@/components/layout/Sidebar";

export default function onSidebarJobSeeker({ children }) {
  return (
    <div className="min-h-screen text-text-primary">
      <Navbar />

      <div className="flex">
        <aside
          className="
            hidden 
            md:block
            h-screen 
            fixed 
            top-16 
            left-0 
          "
        >
          <SidebarPemberiKerja />
        </aside>

        <main
          className="
            flex-1 
            pt-16 
            ml-0 md:ml-[280px] 
            px-2 md:py-6 md:px-12
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
