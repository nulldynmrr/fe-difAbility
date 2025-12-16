"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { Linkedin, Instagram, Youtube, Twitter, Facebook } from "lucide-react";

export default function CompanyProfile() {
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
          linkedinUrl: data.linkedinUrl || "",
          youtubeUrl: data.youtubeUrl || "",
          instagramUrl: data.instagramUrl || "",
          twitterUrl: data.twitterUrl || "",
          facebookUrl: data.facebookUrl || "",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat profil perusahaan...
      </div>
    );
  }

  const totalPosting = jobs.length;
  const stillOpen = jobs.filter(
    (job) => job.publicationStatus === "Open"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-6 md:col-span-2 flex justify-between items-center rounded shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 overflow-hidden rounded">
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
                    {profile.companyName || "-"}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {profile.companyDescription ||
                      "Deskripsi perusahaan belum tersedia."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/registration-company/edit")}
                className="text-gray-600 hover:text-black"
                title="Edit Profile"
              >
                ✎
              </button>
            </div>

            <div className="bg-white p-6 text-center rounded shadow">
              <p className="text-xl font-bold">{totalPosting}</p>
              <p className="text-xs text-gray-600">Posting Lamaran</p>
            </div>

            <div className="bg-white p-6 text-center rounded shadow">
              <p className="text-xl font-bold">{stillOpen}</p>
              <p className="text-xs text-gray-600">Sedang berjalan</p>
            </div>
          </div>
        )}

        {profile && (
          <div className="bg-white p-6 mt-6 rounded shadow">
            {profile.logoImagePath && (
              <img
                src={profile.logoImagePath}
                alt={`${profile.companyName} Logo`}
                className="w-24 h-24 object-cover mb-4 rounded"
              />
            )}

            <p className="text-xs text-gray-700 mb-1">Bidang Industri</p>
            <p className="text-lg font-bold text-gray-800 mb-6">
              {profile.industryType || "Belum terisi"}
            </p>

            <p className="text-xs text-gray-700 mb-1">Deskripsi Perusahaan</p>
            <p className="text-lg font-bold text-gray-800 mb-6">
              {profile.companyDescription ||
                "Deskripsi perusahaan belum tersedia."}
            </p>

            <p className="text-xs text-gray-700 mb-1">Alamat</p>
            <p className="text-lg font-bold text-gray-800 mb-6">
              {profile.address || "Alamat belum tersedia."}
            </p>

            <p className="text-xs text-gray-700 mb-1">Website Perusahaan</p>
            <a
              href={profile.websiteUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mb-12 block"
            >
              {profile.websiteUrl || "-"}
            </a>

            <div className="flex space-x-3 mt-8">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                >
                  <Linkedin size={20} className="text-blue-700" />
                </a>
              )}
              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                >
                  <Twitter size={20} className="text-white" />
                </a>
              )}
              {profile.instagramUrl && (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-50 hover:bg-pink-100 transition"
                >
                  <Instagram size={20} className="text-pink-600" />
                </a>
              )}
              {profile.youtubeUrl && (
                <a
                  href={profile.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 transition"
                >
                  <Youtube size={20} className="text-red-600" />
                </a>
              )}
              {profile.facebookUrl && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                >
                  <Facebook size={20} className="text-blue-700" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
