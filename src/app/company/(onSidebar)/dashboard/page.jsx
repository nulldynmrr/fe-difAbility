"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import HeaderCard from "@/components/card/HeaderCard";
import OpenJobs from "@/components/card/OpenJobSection";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import request from "@/utils/request";
import { transformCompanyData } from "@/utils/fileUtils";

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllJobs = useCallback(async () => {
    try {
      const jobsRes = await request.get("/jobs");
      setJobs(jobsRes.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Gagal mengambil data lowongan");
    }
  }, []);

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    try {
      const companyRes = await request.get("/companies/me/profile");
      const data = companyRes.data;

      const transformedCompany = transformCompanyData(data);

      setCompany(transformedCompany);
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Gagal mengambil data perusahaan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllJobs();
    fetchCompany();
  }, [fetchAllJobs, fetchCompany]);

  const totalPosting = jobs.length;
  const stillOpen = jobs.filter(
    (job) => job.publicationStatus === "OPEN"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mt-10 bg-bg">
      <HeaderCard
        title="Siap memberi banyak lowongan pekerjaan"
        subtitle="Meningkatkan kepercayaan kepada disabilitas"
      />

      {company && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-bg-card p-6 md:col-span-2 flex justify-between items-center rounded-lg border border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-border rounded-lg overflow-hidden flex items-center justify-center">
                {company.logoImagePath ? (
                  <img
                    src={company.logoImagePath}
                    alt={`Logo ${company.companyName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Image failed to load:",
                        company.logoImagePath
                      );
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<span class="text-text-secondary text-sm">Logo</span>';
                    }}
                  />
                ) : (
                  <span className="text-text-secondary text-sm">Logo</span>
                )}
              </div>

              <div>
                <p className="font-semibold text-2xl text-text-primary">
                  {company.companyName || "Perusahaan"}
                </p>
                <p className="text-text-secondary text-xs line-clamp-2">
                  {company.industryType}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/profile-company")}
              className="text-text-secondary hover:text-text-primary text-lg transition-colors"
              title="Edit Profil Perusahaan"
            >
              <Edit size={20} />
            </button>
          </div>

          <div className="bg-bg-card p-6 text-center rounded-lg border border-border/40">
            <p className="text-3xl font-bold text-text-primary">
              {totalPosting}
            </p>
            <p className="text-xs text-text-secondary">Posting Lamaran</p>
          </div>

          <div className="bg-bg-card p-6 text-center rounded-lg border border-border/40">
            <p className="text-3xl font-bold text-text-primary">{stillOpen}</p>
            <p className="text-xs text-text-secondary">Sedang berjalan</p>
          </div>
        </div>
      )}

      <OpenJobs jobs={jobs} />
    </div>
  );
}
