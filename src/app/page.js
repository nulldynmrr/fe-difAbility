"use client";

import { useState } from "react";
import SpeechSearchBar from "@/components/ui/Search";
import Button from "@/components/ui/Button";
import DisabilityImage from "@/components/ui/Image";
import { useShortcuts } from "@/hooks/useShortcuts";

export default function Home() {
  const [search, setSearch] = useState("");

  useShortcuts({
    "ctrl+k": () => document.getElementById("search")?.focus(),
  });

  return (
    <main className="min-h-screen bg-bg text-text-primary">
      <header className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-10 text-white">
          <div className="text-center">
            <span className="inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full mb-4">disability-friendly</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cari pekerjaan dengan mudah, tanpa halangan apa pun</h1>
            <p className="text-sm md:text-base opacity-90 mb-6">Ribuan lowongan dari perusahaan yang peduli aksesibilitas</p>

            <div className="mx-auto max-w-2xl flex items-center gap-3">
              <div className="flex-1">
                <SpeechSearchBar placeholder="saya mau kerja.." />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="mt-6 flex justify-center">
          <div className="w-full md:w-4/5">
            <DisabilityImage src="/assets/ilustrasi.svg" alt="ilustrasi aksesibilitas" width={1200} height={420} rounded={false} />
          </div>
        </div>
      </section>
    </main>
  );
}
