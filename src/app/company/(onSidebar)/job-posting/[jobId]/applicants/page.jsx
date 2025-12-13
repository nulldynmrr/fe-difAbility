"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ApplicantsList({ params }) {
  const router = useRouter();
  const { jobId } = params;

  const applications = [
    {
      applicationId: 301,
      jobSeekerId: 11,
      fullname: "Hanif Almansyah",
      cvDocumentPath: "/cv/hanif.pdf",
      coverLetter:
        "Saya memiliki pengalaman sebagai UI Designer dan siap berkontribusi...",
      appliedAt: "2025-02-10 14:22",
    },
    {
      applicationId: 302,
      jobSeekerId: 12,
      fullname: "Michele",
      cvDocumentPath: "/cv/michele.pdf",
      coverLetter:
        "Saya sangat tertarik pada posisi ini dan memiliki kemampuan Figma...",
      appliedAt: "2025-02-11 09:15",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full rounded h-48 bg-blue-700 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pelamar Pekerjaan</h1>
          <p className="text-gray-200 text-sm mt-1">
            Daftar pelamar untuk lowongan pekerjaan ini
          </p>
        </div>

        <div className="hidden md:block">
          <div className="w-40 h-32 bg-white/20 rounded" />
        </div>
      </div>

      <div className="mt-8 mb-4 flex justify-between items-center">
        <h2 className="font-semibold text-md">
          Daftar Pelamar untuk Job #{jobId}
        </h2>
        <button
          onClick={() => router.push(`/company/job-posting/${jobId}`)}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded text-sm
            hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Kembali
        </button>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.applicationId}
            className="bg-white rounded shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-lg font-semibold">{app.fullname}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Melamar pada {app.appliedAt}
                </p>

                <p className="text-gray-700 text-sm mt-3 line-clamp-3">
                  {app.coverLetter}
                </p>

                <a
                  href={app.cvDocumentPath}
                  className="text-blue-600 underline text-sm mt-2 inline-block"
                  target="_blank"
                >
                  Lihat CV
                </a>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/company/job-posting/${jobId}/applicants/${app.applicationId}`
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm
                  hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition ml-4"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <p className="text-sm text-gray-600 mt-4">Belum ada pelamar.</p>
      )}
    </div>
  );
}
