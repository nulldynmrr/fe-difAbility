"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";

export default function JobDetail({ params }) {
  const router = useRouter();
  const { jobId } = use(params);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const res = await request.get(`/jobs/${jobId}`, {
        withCredentials: true,
      });

      setJob(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Gagal memuat detail pekerjaan");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchJob();
  }, [jobId]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        Memuat detail pekerjaan...
      </div>
    );

  if (!job)
    return (
      <div className="p-6 text-center text-red-600">
        Detail pekerjaan tidak ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full rounded h-44 bg-blue-700 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Detail Lowongan</h1>
          <p className="text-gray-200 text-sm mt-1">
            Informasi lengkap mengenai lowongan
          </p>
        </div>

        <div className="hidden md:block">
          <div className="w-40 h-28 bg-white/20 rounded" />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded shadow-sm border border-gray-200">
        <p className="text-2xl font-bold">{job.title}</p>
      </div>

      <div className="mt-4 bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Deskripsi Pekerjaan</h2>
        <p className="text-gray-700 text-sm leading-relaxed break-all">
          {job.jobDescription}
        </p>
      </div>

      <div className="mt-4 bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Informasi Umum</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="p-3 rounded bg-gray-50">
            <p className="font-semibold">Gaji</p>
            <p>Rp{job.salary?.toLocaleString("id-ID")}</p>
          </div>

          <div className="p-3  rounded bg-gray-50">
            <p className="font-semibold">Pendidikan Minimal</p>
            <p>{job.minimumEducation}</p>
          </div>

          <div className="p-3  rounded bg-gray-50">
            <p className="font-semibold">Jenis Pekerjaan</p>
            <p>{job.jobType}</p>
          </div>

          <div className="p-3  rounded bg-gray-50">
            <p className="font-semibold">Pengalaman Minimal</p>
            <p>{job.minimumYearsExperience} tahun</p>
          </div>

          <div className="p-3  rounded bg-gray-50 md:col-span-2">
            <p className="font-semibold">Disabilitas Cocok</p>
            <p>{job.compatibleDisabilities?.join(", ")}</p>
          </div>

          <div className="p-3  rounded bg-gray-50 md:col-span-2">
            <p className="font-semibold">Deadline</p>
            <p>{new Date(job.registrationDeadline).toLocaleString("id-ID")}</p>
          </div>

          <div className="p-3  rounded bg-gray-50 md:col-span-2">
            <p className="font-semibold">Status</p>
            <span
              className={`px-2 py-1 rounded text-xs ${
                job.publicationStatus === "Open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {job.publicationStatus}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/company/job-posting")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Kembali
      </button>
    </div>
  );
}
