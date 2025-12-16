"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { Calendar, Briefcase, Coins } from "lucide-react";
import HeaderCard from "@/components/card/HeaderCard";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          request.get("/companies/me/profile", { withCredentials: true }),
          request.get("/jobs", { withCredentials: true }),
        ]);

        const data = profileRes.data;

        const logoUrl = data.logoImgPath
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/view?path=${data.logoImgPath}`
          : null;

        setProfile({
          companyName: data.name || "-",
          companyDescription: data.description || "-",
          address: data.address || "-",
          industryType: data.industryType || "-",
          websiteUrl: data.websiteUrl || "-",
          linkedinUrl: data.linkedinUrl || "-",
          youtubeUrl: data.youtubeUrl || "-",
          instagramUrl: data.instagramUrl || "-",
          twitterUrl: data.twitterUrl || "-",
          logoImagePath: logoUrl,
          agreeToTerms: data.agreeToTerms || false,
        });

        setJobs(jobsRes.data || []);
      } catch (error) {
        toast.error("Gagal mengambil data perusahaan");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalPosting = jobs.length;
  const stillOpen = jobs.filter(
    (job) => job.publicationStatus === "Open"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat dashboard...
      </div>
    );
  }

  console.log("jobs", jobs);
  console.log(profile);

  return (
    <div className="min-h-screen  p-6 mt-10">
      <HeaderCard
        title="Siap memberi banyak lowongan pekerjaan"
        subtitle="Meningkatkan kepercayaan kepada disabilitas"
      />

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4  mt-8">
          <div className="bg-white p-6 md:col-span-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 overflow-hidden">
                {profile.logoImagePath ? (
                  <img
                    src={profile.logoImagePath}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {profile.companyName}
                </p>
                <p className="text-gray-600 text-xs">
                  {profile.companyDescription}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/registration-company/edit")}
              className="text-gray-600 hover:text-black"
            >
              ✎
            </button>
          </div>

          <div className="bg-white p-6 text-center">
            <p className="text-xl font-bold">{totalPosting}</p>
            <p className="text-xs text-gray-600">Posting Lamaran</p>
          </div>

          <div className="bg-white p-6 text-center">
            <p className="text-xl font-bold">{stillOpen}</p>
            <p className="text-xs text-gray-600">Sedang berjalan</p>
          </div>
        </div>
      )}

      <OpenJobsSection jobs={jobs} />
    </div>
  );
}

function DashboardJobCard({ job }) {
  return (
    <div className="bg-white p-6 border border-gray-200">
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-gray-600 text-sm mb-3">
        {job.companyName || "Nama Perusahaan"}
      </p>

      <div className="flex flex-wrap gap-5 text-gray-700 text-sm mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>
            {job.registrationDeadline
              ? new Date(job.registrationDeadline).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Coins size={16} />
          <span>
            {job.salary ? `${job.salary.toLocaleString("id-ID")} / bulan` : "-"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Briefcase size={16} />
          <span>{job.jobType || "Remote"}</span>
        </div>
      </div>

      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
        {job.jobDescription}
      </p>

      <div className="flex gap-3">
        <button className="border border-blue-600 text-blue-600 px-4 py-2 text-sm hover:bg-blue-50">
          Edit Postingan
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
          Lihat Pelamar
        </button>
      </div>
    </div>
  );
}

/* ============================= */
/* Open Jobs Section */
/* ============================= */

function OpenJobsSection({ jobs }) {
  const openJobs = jobs.filter((job) => job.publicationStatus === "Open");

  return (
    <div className="bg-white p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">Posting Lamaran Kerja</h3>

      <div className="space-y-4">
        {openJobs.map((job) => (
          <DashboardJobCard key={job.id} job={job} />
        ))}
      </div>

      {openJobs.length === 0 && (
        <p className="text-gray-500 text-sm">Tidak ada lowongan terbuka.</p>
      )}
    </div>
  );
}
