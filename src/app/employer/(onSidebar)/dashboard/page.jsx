"use client";

import React from "react";
import SpeechSearchBar from "@/components/ui/Search";
import DisabilityImage from "@/components/ui/Image";
import { MapPin, DollarSign } from "lucide-react";
import JobCard from "@/components/job/JobCard";

export default function Dashboard() {
  return (
    <main className="p-6">
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-8 text-white mb-8">
        <div className="max-w-6xl mx-auto flex items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Cari pekerjaan dengan mudah, tanpa halangan apa pun</h1>
            <p className="text-sm opacity-90">Ribuan lowongan dari perusahaan yang peduli aksesibilitas</p>

            <div className="mt-6">
              <SpeechSearchBar placeholder="saya mau kerja.." />
            </div>
          </div>

          <div className="w-56 hidden md:block">
            <DisabilityImage src="/assets/ilustrasi.svg" alt="illustration" width={220} height={140} rounded={false} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-3 bg-bg-card border border-primary-50 rounded-lg p-4">
          <h4 className="font-semibold mb-4">Filter</h4>

          <ul className="space-y-3 text-sm text-primary-400">
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Jakarta Selatan</li>
            <li className="flex items-center gap-3"><DollarSign className="w-4 h-4" /> 12 juta</li>
            <li className="flex items-center gap-3">Remmote</li>
            <li className="flex items-center gap-3">Remmote</li>
          </ul>
        </aside>

        <div className="col-span-9 space-y-6">
          {[
            {
              title: "UI Designer",
              company: "Lui Company",
              location: "Jakarta Selatan",
              salary: "12 juta",
              remote: true,
              description:
                "Lorem ipsum singkat deskripsi pekerjaan untuk menarik kandidat.",
            },
            {
              title: "Frontend Engineer",
              company: "Bina Dev",
              location: "Jakarta Pusat",
              salary: "15 juta",
              remote: false,
              description: "Bertanggung jawab mengembangkan antarmuka pengguna.",
            },
          ].map((job, i) => (
            <JobCard key={i} {...job} />
          ))}
        </div>
      </section>
    </main>
  );
}
