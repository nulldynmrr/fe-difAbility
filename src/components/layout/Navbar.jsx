"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "@/components/ui/Image";
import { Menu, X, User, Building, ChevronDown, LogOut } from "lucide-react";
import request, { clearAuth } from "@/utils/request";
import { useAuthMe } from "@/hooks/useAuthMe";

const MenuNav = ({ isMobile = false, onClickLink }) => {
  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Lowongan", href: "/job-seeker/dashboard" },
    { label: "Tentang", href: "/" },
  ];

  return (
    <div
      className={
        isMobile ? "space-y-3" : "hidden md:flex items-center space-x-8"
      }
    >
      {menuItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onClickLink}
          className={
            isMobile
              ? "block px-3 py-2 text-text-primary hover:text-primary-300 hover:bg-primary-50 rounded-lg font-medium"
              : "text-text-primary hover:text-primary-300 font-medium"
          }
        >
          {item.label}
        </a>
      ))}
    </div>
  );
};

export default function Navbar() {
  const { user, loading } = useAuthMe();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const onLogout = async () => {
    try {
      clearAuth();
      await request.delete("/auth/session");
    } catch (err) {
      console.log("Logout error (ignored):", err);
    }
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-bg-card border-b border-border fixed w-full top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/">
              <Image
                src="/assets/LOGO DIFABILITY.png"
                alt="Logo"
                width={120}
                height={40}
                priority
              />
            </a>
          </div>

          <MenuNav />

          <div className="hidden md:flex items-center space-x-4">
            {!loading && !user && (
              <>
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:text-primary-300"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk</span>
                </a>

                <a
                  href="/registration-company"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-400 transition-colors"
                >
                  <Building className="w-4 h-4" />
                  <span>Daftar Perusahaan</span>
                </a>
              </>
            )}

            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:text-primary-300 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[150px] truncate">
                    {user.fullName || "User"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      dropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdown && (
                  <div
                    className="absolute right-0 mt-4 rounded-lg w-48 py-2 border !border-border/40"
                    style={{
                      backgroundColor: "rgb(var(--bg-card))",
                      borderColor: "rgb(var(--border))",
                      color: "rgb(var(--text-primary))",
                    }}
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {user.email}
                      </p>
                    </div>

                    <a
                      href={
                        user.role === "Job Seeker"
                          ? "/job-seeker/update-profile"
                          : "/profile-company"
                      }
                      className="px-4 py-2 block rounded hover:bg-[rgb(var(--primary-50))] transition-colors"
                    >
                      Update Profile
                    </a>

                    <button
                      onClick={onLogout}
                      className="px-4 py-2 w-full text-left flex items-center space-x-2 rounded hover:bg-[rgb(var(--primary-50))] transition-colors"
                      style={{ color: "rgb(var(--destructive))" }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary hover:text-primary-300 p-2"
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

      {isOpen && (
        <div className="md:hidden bg-bg-card border-t border-border">
          <div className="px-4 pt-2 pb-4">
            <MenuNav isMobile onClickLink={() => setIsOpen(false)} />

            {!loading && !user && (
              <div className="pt-3 border-t border-border space-y-2">
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-3 py-2 text-text-primary hover:text-primary-300 hover:bg-primary-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk</span>
                </a>

                <a
                  href="/registration-company"
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-300 text-white rounded-lg"
                >
                  <Building className="w-4 h-4" />
                  <span>Daftar Perusahaan</span>
                </a>
              </div>
            )}

            {!loading && user && (
              <div className="pt-3 border-t border-border space-y-2">
                <div className="px-3 py-2 bg-primary-50 rounded-lg">
                  <p className="text-sm font-medium truncate">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {user.email}
                  </p>
                </div>

                <a
                  href={
                    user.role === "Job Seeker"
                      ? "/job-seeker/update-profile"
                      : "/profile-company"
                  }
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-primary-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Update Profile</span>
                </a>

                <a
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-primary-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>

                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-500 hover:bg-primary-50 rounded-lg w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
