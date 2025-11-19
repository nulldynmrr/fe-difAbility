"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useShortcuts } from "@/hooks/useShortcuts";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  useShortcuts({
    "ctrl+k": () => document.getElementById("search")?.focus(),
  });

  return (
    <main className="min-h-screen bg-bg text-fg p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Dashboard Pencari Pekerja
        </h1>

        <section
          className="p-6 rounded-xl border border-primary-200 shadow-md bg-surface 
                     transition-all focus-within:ring-2 focus-within:ring-primary-300 
                     focus-within:ring-offset-2 focus-within:ring-offset-bg"
        >
          <h2 className="text-xl font-semibold mb-4 text-fg">Cari Pekerjaan</h2>

          <Input
            id="search"
            placeholder="Cari pekerjaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari pekerjaan"
            shortcutLabel="ctrl+k"
            className="w-full"
          />

          <Button
            className="mt-4 w-full sm:w-auto bg-primary text-white hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300"
            shortcutLabel="enter"
          >
            Cari
          </Button>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
