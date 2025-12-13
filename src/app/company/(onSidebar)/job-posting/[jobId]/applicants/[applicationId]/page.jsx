"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantDetail({ params }) {
  const router = useRouter();
  const { jobId, applicationId } = params;

  const [application, setApplication] = useState(null);
  const [jobSeeker, setJobSeeker] = useState(null);

  useEffect(() => {
    const appData = {
      applicationId,
      jobSeekerId: 11,
      coverLetter:
        "Saya memiliki pengalaman dalam UI/UX dan mampu bekerja dalam lingkungan kolaboratif.",
      appliedAt: "2025-02-10 14:22",
    };

    const userData = {
      fullname: "Hanif Almansyah",
      about:
        "Seorang desainer UI yang fokus pada aksesibilitas dan pengalaman pengguna.",
      address: "Jakarta Selatan",
      disabilityType: "Hearing",
      skills: ["Figma", "Wireframing", "UX Research"],
      certificationFilePaths: ["/cert/c1.pdf", "/cert/c2.pdf"],
      educationLevel: "Bachelor",
      academicYear: "2022",
      jobType: "Full Time",
      ppImagePath:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500",
      cvDocumentPath: "/cv/hanif.pdf",
    };

    setApplication(appData);
    setJobSeeker(userData);
  }, [applicationId]);

  if (!application || !jobSeeker)
    return <div className="p-6 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full rounded h-48 bg-blue-700 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Detail Pelamar</h1>
          <p className="text-gray-200 text-sm mt-1">
            Informasi lengkap kandidat untuk lowongan ini
          </p>
        </div>

        <div className="hidden md:block">
          <div className="w-40 h-32 bg-white/20 rounded" />
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mt-8">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 rounded bg-gray-200 overflow-hidden">
            <img
              src={jobSeeker.ppImagePath}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{jobSeeker.fullname}</h2>
            <p className="text-gray-600 text-sm">{jobSeeker.address}</p>
            <p className="text-gray-600 text-sm">
              Disabilitas: {jobSeeker.disabilityType}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-md mb-2">Tentang Kandidat</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {jobSeeker.about}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-md mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {jobSeeker.skills.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-200 rounded text-sm text-gray-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold text-sm">Pendidikan Terakhir</p>
            <p className="text-gray-700 text-sm">{jobSeeker.educationLevel}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold text-sm">Tahun Akademik</p>
            <p className="text-gray-700 text-sm">{jobSeeker.academicYear}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="font-semibold text-sm">Preferensi Pekerjaan</p>
          <p className="text-gray-700 text-sm">{jobSeeker.jobType}</p>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-md mb-1">Cover Letter</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {application.coverLetter}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-md mb-1">CV Kandidat</h3>
          <a
            href={jobSeeker.cvDocumentPath}
            target="_blank"
            className="text-blue-600 underline text-sm"
          >
            Lihat CV
          </a>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-md mb-2">Sertifikasi</h3>

          {jobSeeker.certificationFilePaths.length === 0 ? (
            <p className="text-gray-600 text-sm">Tidak ada sertifikasi.</p>
          ) : (
            jobSeeker.certificationFilePaths.map((path, i) => (
              <a
                key={i}
                href={path}
                target="_blank"
                className="text-blue-600 underline text-sm block"
              >
                Sertifikasi {i + 1}
              </a>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button
            className="px-5 py-2 bg-gray-100 text-gray-800 rounded text-sm
              hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition"
            onClick={() =>
              router.push(`/company/job-posting/${jobId}/applicants`)
            }
          >
            Kembali
          </button>

          <button
            className="px-5 py-2 bg-green-600 text-white rounded text-sm
              hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition"
            onClick={() => console.log("Terima Pelamar")}
          >
            Terima
          </button>

          <button
            className="px-5 py-2 bg-red-600 text-white rounded text-sm
              hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition"
            onClick={() => console.log("Tolak Pelamar")}
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}
