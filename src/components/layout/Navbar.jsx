// import React, { useState } from "react";
// import { Menu, X, User, Building } from "lucide-react";

// const MenuNav = ({ isMobile = false, onClickLink }) => {
//   const menuItems = [
//     { label: "Beranda", href: "/" },
//     { label: "Lowongan", href: "/jobs" },
//     { label: "Perusahaan", href: "/companies" },
//     { label: "Tentang", href: "/about" },
//   ];

//   return (
//     <div
//       className={
//         isMobile ? "space-y-3" : "hidden md:flex items-center space-x-8"
//       }
//     >
//       {menuItems.map((item) => (
//         <a
//           key={item.href}
//           href={item.href}
//           onClick={onClickLink}
//           className={`${
//             isMobile
//               ? "block px-3 py-2 text-text-primary hover:text-primary-300 hover:bg-primary-50 rounded-lg transition-colors font-medium"
//               : "text-text-primary hover:text-primary-300 transition-colors font-medium"
//           }`}
//         >
//           {item.label}
//         </a>
//       ))}
//     </div>
//   );
// };

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-bg-card border-b border-border fixed w-full top-0 z-50">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <span className="text-2xl font-bold text-primary-300">disLok</span>
//           </div>

//           <MenuNav />

//           <div className="hidden md:flex items-center space-x-4">
//             <a
//               href="/login"
//               className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:text-primary-300 transition-colors font-medium"
//             >
//               <User className="w-4 h-4" />
//               <span>Masuk</span>
//             </a>

//             <a
//               href="/register-company"
//               className="flex items-center space-x-2 px-4 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-300 transition-colors font-medium"
//             >
//               <Building className="w-4 h-4" />
//               <span>Daftar Perusahaan</span>
//             </a>
//           </div>

//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-text-primary hover:text-primary-300 transition-colors p-2"
//               aria-label="Toggle menu"
//             >
//               {isOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="md:hidden bg-bg-card border-t border-border">
//           <div className="px-4 pt-2 pb-4">
//             <MenuNav isMobile onClickLink={() => setIsOpen(false)} />

//             <div className="pt-3 border-t border-border space-y-2">
//               <a
//                 href="/login"
//                 className="flex items-center space-x-2 px-3 py-2 text-text-primary hover:text-primary-300 hover:bg-primary-50 rounded-lg transition-colors font-medium"
//               >
//                 <User className="w-4 h-4" />
//                 <span>Masuk</span>
//               </a>
//               <a
//                 href="/register-company"
//                 className="flex items-center space-x-2 px-3 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-300 transition-colors font-medium"
//               >
//                 <Building className="w-4 h-4" />
//                 <span>Daftar Perusahaan</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";

import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await request.delete("/auth/session");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">disLok</span>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>

            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-600 p-2"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
