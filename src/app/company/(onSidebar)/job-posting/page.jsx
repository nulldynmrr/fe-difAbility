"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { Calendar, Briefcase, Coins } from "lucide-react";

export default function JobPosting() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await request.get("/jobs", { withCredentials: true });
        setJobs(res.data || []);
      } catch {
        toast.error("Gagal memuat data lowongan");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const openJobs = jobs.filter((j) => j.publicationStatus === "Open");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">
      <div className="w-full rounded-sm h-40 bg-blue-700 text-white p-6 flex items-center">
        <div>
          <h1 className="text-3xl font-bold">Daftar Lowongan Kerja</h1>
          <p className="text-gray-200 text-lg mt-2">
            Kelola dan pantau semua lowongan perusahaan Anda
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-black">
          Posting Lamaran Kerja
        </h2>

        <button
          onClick={() => router.push("/company/job-posting/post-job")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xs text-sm
          hover:bg-blue-700 transition"
        >
          Buat Postingan Baru
        </button>
      </div>

      <div className="mt-4 space-y-6">
        {openJobs.map((job) => (
          <JobCard key={job.id} job={job} router={router} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job, router }) {
  return (
    <div className="bg-white p-6 rounded-xs border-gray-200">
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 text-base mb-3">
            {job.companyName || "Nama Perusahaan"}
          </p>

          <div className="flex gap-6 text-gray-700 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>
                {job.registrationDeadline
                  ? new Date(job.registrationDeadline).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" }
                    )
                  : "Deadline tidak tersedia"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Coins size={16} />
              <span>
                {job.salary
                  ? `Rp${job.salary.toLocaleString("id-ID")} / bulan`
                  : "Gaji tidak tersedia"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Briefcase size={16} />
              <span>{job.jobType || "Tidak ditentukan"}</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm line-clamp-3 break-all">
            {job.jobDescription}
          </p>

          <div className="flex gap-3 mt-4">
            {/* <button
              onClick={() => router.push(`/company/job-posting/${job.id}/edit`)}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xs text-sm 
              hover:bg-blue-50 transition"
            >
              Edit Postingan
            </button> */}

            <button
              onClick={() => router.push(`/company/job-posting/${job.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xs text-sm 
              hover:bg-blue-700 transition"
            >
              Detail Postingan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
