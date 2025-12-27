"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Edit,
  UserPlus,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react";
import api from "@/utils/request";
import { transformCompanyData } from "@/utils/fileUtils";
import Button from "@/components/ui/Button";

export default function CompanyProfile() {
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showHRModal, setShowHRModal] = useState(false);
  const [generatingHR, setGeneratingHR] = useState(false);
  const [hrCredential, setHrCredential] = useState(null);

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/companies/me/profile");
      setCompany(transformCompanyData(res.data));
    } catch {
      toast.error("Gagal mengambil data perusahaan");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data || []);
    } catch {
      toast.error("Gagal mengambil data lowongan");
    }
  }, []);

  useEffect(() => {
    fetchCompany();
    fetchJobs();
  }, [fetchCompany, fetchJobs]);

  const handleGenerateHR = async () => {
    setShowHRModal(true);
    setGeneratingHR(true);
    setHrCredential(null);

    try {
      console.log("POST /companies/me/humanresources");

      const res = await api.post("/companies/me/humanresources");

      console.log("Response data:", res.data);

      setHrCredential({
        username: res.data.generatedUsername,
        password: res.data.generatedPassword,
      });

      toast.success("HR berhasil dibuat");
    } catch (error) {
      console.error("Generate HR error:", error);
      toast.error("Gagal membuat HR");
    } finally {
      setGeneratingHR(false);
    }
  };

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
        {company && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-6 md:col-span-2 flex justify-between items-center rounded border border-border/40">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                  {company.logoImagePath ? (
                    <img
                      src={company.logoImagePath}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">Logo</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{company.companyName}</p>
                  <p className="text-xs text-gray-600">
                    {company.industryType}
                  </p>
                </div>
              </div>
              <button onClick={() => router.push("/profile-company")}>
                <Edit size={20} />
              </button>
            </div>

            <div className="bg-white p-6 text-center rounded border border-border/40">
              <p className="text-xl font-bold">{totalPosting}</p>
              <p className="text-xs text-gray-600">Posting Lamaran</p>
            </div>

            <div className="bg-white p-6 text-center rounded border border-border/40">
              <p className="text-xl font-bold">{stillOpen}</p>
              <p className="text-xs text-gray-600">Sedang Berjalan</p>
            </div>
          </div>
        )}

        {company && (
          <div className="bg-white p-6 mt-6 rounded border border-border/40">
            <p className="text-xs text-gray-500 mb-1">Deskripsi</p>
            <p className="mb-6">{company.companyDescription}</p>

            <p className="text-xs text-gray-500 mb-1">Alamat</p>
            <p className="mb-6">{company.address}</p>

            {company.websiteUrl && (
              <>
                <p className="text-xs text-gray-500 mb-1">Website</p>
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  className="text-blue-600"
                >
                  {company.websiteUrl}
                </a>
              </>
            )}

            <div className="flex gap-3 mt-6">
              {company.linkedinUrl && <Linkedin />}
              {company.instagramUrl && <Instagram />}
              {company.youtubeUrl && <Youtube />}
              {company.twitterUrl && <Twitter />}
              {company.facebookUrl && <Facebook />}
            </div>
          </div>
        )}

        <div className="bg-white p-6 mt-6 rounded border border-border/40">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Human Resources</h3>
            <Button
              className="btn-primary flex items-center gap-2"
              onClick={handleGenerateHR}
            >
              <UserPlus size={16} />
              Generate HR
            </Button>
          </div>
        </div>
      </div>

      {showHRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Generate HR Account</h2>

            {generatingHR && (
              <p className="text-sm text-gray-600">Sedang membuat akun HR...</p>
            )}

            {!generatingHR && hrCredential && (
              <div className="space-y-3">
                <div className="border border-border/40 p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p>{hrCredential.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hrCredential.username);
                      toast.success("Username disalin");
                    }}
                  >
                    Copy
                  </button>
                </div>

                <div className="border border-border/40 p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Password</p>
                    <p>{hrCredential.password}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hrCredential.password);
                      toast.success("Password disalin");
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                className="btn-secondary"
                onClick={() => setShowHRModal(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
