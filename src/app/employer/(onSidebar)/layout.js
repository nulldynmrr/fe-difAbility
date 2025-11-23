"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Briefcase, 
  Users, 
  Bell, 
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function EmployerSidebarLayout({ children }) {
  const pathname = usePathname();
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const menuItems = [
    { 
      label: "Dasboard", 
      href: "/employer/dashboard", 
      icon: Home 
    },
    { 
      label: "Posting Lowongan Baru", 
      href: "/employer/job-posting", 
      icon: Briefcase 
    },
    { 
      label: "Daftar Kandidat Saya", 
      href: "/employer/see-applicants", 
      icon: Users 
    },
    { 
      label: "Notifikasi", 
      href: "#", 
      icon: Bell 
    },
  ];

  const isActive = (href) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* Company Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-300 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-text-primary">Acme Inc</span>
                  <button
                    onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    {companyDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <span className="text-xs text-text-secondary">Enterprise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-text-secondary uppercase mb-2 px-2">
            Platform
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-primary-50 text-primary-300 font-medium"
                    : "text-text-secondary hover:bg-gray-200 hover:text-text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-text-primary">S</span>
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">shadcn</div>
                <div className="text-xs text-text-secondary">m@example.com</div>
              </div>
            </div>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="text-text-secondary hover:text-text-primary"
            >
              {profileDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-bg">
        {children}
      </main>
    </div>
  );
}

