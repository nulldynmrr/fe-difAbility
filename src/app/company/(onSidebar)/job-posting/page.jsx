"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { Calendar, Briefcase, Coins, X, Copy } from "lucide-react";

export default function JobPosting() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingHR, setGeneratingHR] = useState(false);
  const [hrData, setHrData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmSaved, setConfirmSaved] = useState(false);

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

  const handleGenerateHR = async () => {
    setGeneratingHR(true);
    try {
      const res = await request.post("/companies/me/humanresources", {});
      console.log(res.data);

      setHrData(res.data);
      setShowModal(true);
      setConfirmSaved(false); // reset checkbox modal
      toast.success("HR account berhasil dibuat!");
    } catch (err) {
      console.error("Error generating HR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Gagal membuat HR account");
    } finally {
      setGeneratingHR(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

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

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/company/job-posting/post-job")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xs text-sm
            hover:bg-blue-700 transition"
          >
            Buat Postingan Baru
          </button>

          <button
            onClick={handleGenerateHR}
            disabled={generatingHR}
            className={`px-6 py-3 bg-green-600 text-white rounded-xs text-sm 
              hover:bg-green-700 transition ${
                generatingHR ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {generatingHR ? "Membuat HR..." : "Generate HR Akun"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-6">
        {openJobs.map((job) => (
          <JobCard key={job.id} job={job} router={router} />
        ))}
      </div>

      {/* Modal HR Account */}
      {showModal && hrData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => {
                if (confirmSaved) setShowModal(false);
                else
                  alert("Silakan simpan username & password sebelum menutup!");
              }}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">HR Account Created</h3>

            <div className="flex items-center justify-between mb-2">
              <p>
                <strong>Username:</strong> {hrData.generatedUsername}
              </p>
              <button onClick={() => copyToClipboard(hrData.generatedUsername)}>
                <Copy size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p>
                <strong>Password:</strong> {hrData.generatedPassword}
              </p>
              <button onClick={() => copyToClipboard(hrData.generatedPassword)}>
                <Copy size={16} />
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={confirmSaved}
                  onChange={(e) => setConfirmSaved(e.target.checked)}
                />
                Saya sudah menyimpan informasi login
              </label>
            </div>

            <button
              onClick={() => {
                if (confirmSaved) setShowModal(false);
                else alert("Silakan centang kotak konfirmasi sebelum menutup!");
              }}
              disabled={!confirmSaved}
              className={`mt-4 w-full px-4 py-2 text-white rounded transition ${
                confirmSaved
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
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
