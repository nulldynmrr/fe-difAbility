"use client";

import { useState, useEffect, useCallback } from "react";
import SpeechSearchBar from "@/components/ui/Search";
import Button from "@/components/ui/Button";
import DisabilityImage from "@/components/ui/Image";
import Navbar from "@/components/layout/Navbar";
import { useShortcuts } from "@/hooks/useShortcuts";
import request from "@/utils/request";
import { toast } from "sonner";

export default function Home() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/jobs");
      setJobs(response.data || []);
    } catch (err) {
      if (err.response) {
        setJobs([]);
      } else {
        toast.error("Gagal memuat data lowongan");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useShortcuts({
    "ctrl+k": () => document.getElementById("search")?.focus(),
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            🌟 disability-friendly
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Cari pekerjaan <span className="text-blue-600">dengan mudah</span>,
            <br />
            tanpa halangan apa pun
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ribuan lowongan dari perusahaan yang peduli aksesibilitas
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SpeechSearchBar placeholder="saya mau kerja.." />
          </div>
        </div>

        {/* Illustration Section */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <DisabilityImage
              src="/assets/ilustrasi.svg"
              alt="ilustrasi aksesibilitas"
              width={600}
              height={250}
              rounded={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
