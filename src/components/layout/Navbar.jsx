"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, User, Building, ChevronDown, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import request, { getCurrentUser } from "@/utils/request";
import Image from "@/components/ui/Image";

const MenuNav = ({ isMobile = false, onClickLink }) => {
  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Lowongan", href: "/jobs" },
    { label: "Perusahaan", href: "/job-seeker/dasboard" },
    { label: "Tentang", href: "/about" },
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
          className={`${
            isMobile
              ? "block px-3 py-2 text-text-primary hover:text-primary-300 hover:bg-primary-50 rounded-lg font-medium"
              : "text-text-primary hover:text-primary-300 font-medium"
          }`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      await request.delete("/auth/session");
    } catch (err) {
      console.log("Logout error (ignored):", err);
    }

    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-bg-card border-b border-border fixed w-full top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="/assets/LOGO DIFABILITY.png"
              alt="Logo disLok"
              width={120}
              height={40}
              priority
            />
          </div>

          <MenuNav />

          <div className="hidden md:flex items-center space-x-4">
            {!currentUser && (
              <>
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:text-primary-300"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk</span>
                </a>

                <a
                  href="/register-company"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-300"
                >
                  <Building className="w-4 h-4" />
                  <span>Daftar Perusahaan</span>
                </a>
              </>
            )}

            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:text-primary-300"
                >
                  <User className="w-4 h-4" />
                  <span>{currentUser?.email?.split("@")[0] ?? "User"}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdown && (
                  <div
                    className="absolute right-0 mt-2 rounded-lg border w-40 py-2 shadow-lg"
                    style={{
                      backgroundColor: "rgb(var(--bg-card))",
                      borderColor: "rgb(var(--border))",
                      color: "rgb(var(--text-primary))",
                    }}
                  >
                    <a
                      href="/profile"
                      className="px-4 py-2 block rounded hover:bg-[rgb(var(--primary-50))] transition-colors"
                      style={{ color: "rgb(var(--text-primary))" }}
                    >
                      Profile
                    </a>

                    <button
                      onClick={handleLogout}
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

            {!currentUser && (
              <div className="pt-3 border-t border-border space-y-2">
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-3 py-2 text-text-primary hover:text-primary-300 hover:bg-primary-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk</span>
                </a>

                <a
                  href="/employer/registration-company"
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-300 text-white rounded-lg"
                >
                  <Building className="w-4 h-4" />
                  <span>Daftar Perusahaan</span>
                </a>
              </div>
            )}

            {currentUser && (
              <div className="pt-3 border-t border-border space-y-2">
                <a
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-primary-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>

                <button
                  onClick={handleLogout}
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
