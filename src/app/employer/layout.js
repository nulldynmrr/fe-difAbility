"use client";

import Navbar from "@/components/layout/Navbar";

export default function RegisterCompanyLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
