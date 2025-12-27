"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { Linkedin, Instagram, Youtube, Twitter, Facebook } from "lucide-react";

export default function CompanyProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const authMe = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/auth/me", { withCredentials: true });
      setUser(response.data || null);
    } catch (err) {
      console.error(err);
      setUser(null);
      toast.error("Gagal memuat data pengguna");
    }
  }, []);

  const fetchCompanyProfile = useCallback(async (companyId) => {
    setLoading(true);
    try {
      const [profileRes, jobsRes] = await Promise.all([
        request.get(`/companies/${companyId}/profile`, {
          withCredentials: true,
        }),
        request.get("/jobs", { withCredentials: true }),
      ]);

      const data = profileRes.data;
      const logoUrl = data.logoImgPath
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/view?path=${data.logoImgPath}`
        : null;

      setProfile({
        companyName: data.name || null,
        companyDescription: data.description || null,
        address: data.address || null,
        industryType: data.industryType || null,
        websiteUrl: data.websiteUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        instagramUrl: data.instagramUrl || null,
        twitterUrl: data.twitterUrl || null,
        facebookUrl: data.facebookUrl || null,
        logoImagePath: logoUrl,
      });

      setJobs(jobsRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data perusahaan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    authMe();
  }, [authMe]);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompanyProfile(user.companyId);
    }
  }, [user, fetchCompanyProfile]);

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
          <div className="bg-white p-6 mt-6 rounded border border-border/40">
            {profile.industryType && (
              <>
                <p className="text-xs text-gray-700 mb-1">Bidang Industri</p>
                <p className="text-lg font-bold text-gray-800 mb-6">
                  {profile.industryType}
                </p>
              </>
            )}

            {profile.companyDescription && (
              <>
                <p className="text-xs text-gray-700 mb-1">
                  Deskripsi Perusahaan
                </p>
                <p className="text-lg font-bold text-gray-800 mb-6">
                  {profile.companyDescription}
                </p>
              </>
            )}

            {profile.address && (
              <>
                <p className="text-xs text-gray-700 mb-1">Alamat</p>
                <p className="text-lg font-bold text-gray-800 mb-6">
                  {profile.address}
                </p>
              </>
            )}

            {profile.websiteUrl && (
              <>
                <p className="text-xs text-gray-700 mb-1">Website Perusahaan</p>
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mb-12 block"
                >
                  {profile.websiteUrl}
                </a>
              </>
            )}

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
