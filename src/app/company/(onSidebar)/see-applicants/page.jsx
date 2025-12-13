"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function SeeApplicants() {
  const router = useRouter();

  const jobs = [
    {
      jobId: 1,
      title: "UI Designer",
      location: "Jakarta Selatan",
      applicants: [
        {
          applicationId: 10,
          jobSeekerId: 100,
          fullname: "Hanif Almansyah",
          cvDocumentPath: "/cv/hanif.pdf",
          coverLetter:
            "Saya sangat tertarik dengan posisi ini dan memiliki pengalaman...",
        },
        {
          applicationId: 11,
          jobSeekerId: 101,
          fullname: "Michele",
          cvDocumentPath: "/cv/michele.pdf",
          coverLetter:
            "Dengan latar belakang desain dan pengalaman UI, saya yakin dapat berkontribusi...",
        },
      ],
    },

    {
      jobId: 2,
      title: "Frontend Developer",
      location: "Bandung",
      applicants: [
        {
          applicationId: 20,
          jobSeekerId: 200,
          fullname: "Hanim Almansyah",
          cvDocumentPath: "/cv/hanif.pdf",
          coverLetter:
            "Saya memiliki pengalaman React dan Next.js selama 2 tahun...",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">
      <div className="w-full rounded-sm h-40 bg-blue-700 text-white p-6 flex items-center">
        <div className="z-10">
          <h2 className="text-3xl font-bold">Daftar Pelamar</h2>
          <p className="text-gray-200 text-lg mt-1">
            Meningkatkan kepercayaan kepada disabilitas
          </p>
        </div>
      </div>

      {jobs.map((job) => (
        <div
          key={job.jobId}
          className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 mt-10"
        >
          <h3 className="text-xl font-bold mb-4">Informasi Pekerjaan</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {job.title.substring(0, 2).toUpperCase()}
              </span>
            </div>

            <div>
              <p className="text-lg font-semibold">{job.title}</p>
              <p className="text-gray-600 text-base">{job.location}</p>
              <p className="text-gray-700 text-base mt-1">
                Total Pelamar:{" "}
                <span className="font-semibold">{job.applicants.length}</span>
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold">
                Kandidat untuk posisi:{" "}
                <span className="text-blue-600">{job.title}</span>
              </h3>
            </div>

            <div className="overflow-x-auto bg-white">
              <table className="w-full text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                      No
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                      Nama Kandidat
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                      CV
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                      Cover Letter
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {job.applicants.map((item, index) => (
                    <tr key={item.applicationId}>
                      <td className="px-6 py-4">{index + 1}</td>

                      <td className="px-6 py-4 font-medium">{item.fullname}</td>

                      <td className="px-6 py-4">
                        <a
                          href={`http://localhost:8080/api/files/view?path=${item.cvDocumentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View CV
                        </a>
                      </td>

                      <td className="px-6 py-4 text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{item.coverLetter}</p>
                      </td>

                      <td className="px-6 py-4">
                        <Button
                          variant="primary"
                          className="text-base rounded-xs transition hover:bg-blue-600"
                          onClick={() =>
                            router.push(
                              `/company/job-posting/${job.jobId}/applicants/${item.applicationId}`
                            )
                          }
                        >
                          Lihat Kandidat
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {job.applicants.length === 0 && (
              <p className="text-base text-gray-600 p-6">Belum ada pelamar.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
