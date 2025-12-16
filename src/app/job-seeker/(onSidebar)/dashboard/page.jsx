"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, DollarSign } from "lucide-react";
import HeaderCard from "@/components/card/HeaderCard";
import JobCard from "@/components/card/JobCard";
import request from "@/utils/request";
import { toast } from "sonner";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/jobs");
      setJobs(response.data || []);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setJobs([]);
      } else {
        toast.error("Gagal memuat data lowongan");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);
  return (
    <main className="p-6">
      <HeaderCard
        title="Siap memberi banyak lowongan pekerjaan"
        subtitle="Meningkatkan kepercayaan kepada disabilitas"
      />

      <section className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-3 bg-bg-card border border-primary-50 rounded-lg p-4">
          <h4 className="font-semibold mb-4">Filter</h4>

          <ul className="space-y-3 text-sm text-primary-400">
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4" /> Jakarta Selatan
            </li>
            <li className="flex items-center gap-3">
              <DollarSign className="w-4 h-4" /> 12 juta
            </li>
            <li className="flex items-center gap-3">Remmote</li>
            <li className="flex items-center gap-3">Magang</li>
          </ul>
        </aside>

        <div className="col-span-9 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat lowongan...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada lowongan tersedia</p>
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company?.name || "Company"}
                location={job.company?.address || "Location"}
                salary={
                  job.salary
                    ? `Rp ${job.salary.toLocaleString("id-ID")}`
                    : "Negotiable"
                }
                remote={job.jobType === "Remote" || false}
                description={job.description || job.jobDescription || ""}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
