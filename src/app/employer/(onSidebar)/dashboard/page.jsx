"use client";

import React from "react";
import SpeechSearchBar from "@/components/ui/Search";
import Button from "@/components/ui/Button";
import DisabilityImage from "@/components/ui/Image";
import { MapPin, DollarSign } from "lucide-react";

const JobCard = ({ title = "UI Designer", company = "Lui Company" }) => {
  return (
    <article className="bg-bg-card border border-primary-50 rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary-50 rounded-md flex items-center justify-center">
          <div className="w-12 h-12 bg-primary-100 rounded" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-primary-900">{title}</h3>
          <p className="text-sm text-primary-300">{company}</p>

          <div className="flex items-center gap-4 mt-3 text-sm text-primary-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Jakarta Selatan
            </span>
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> 12 juta
            </span>
            <span className="flex items-center gap-2">Remmote</span>
          </div>

          <p className="mt-4 text-sm text-primary-400">
            Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem
            ipsumLorem ipsum
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <Button variant="primary" className="px-6 py-2">Lamar Kerja</Button>
        </div>
      </div>
    </article>
  );
};

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
          <JobCard />
          <JobCard />
        </div>
      </section>
    </main>
  );
}
