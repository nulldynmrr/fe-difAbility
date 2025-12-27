"use client";

import { Calendar, Coins, Briefcase } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuthMe } from "@/hooks/useAuthMe";
import { getFileUrl } from "@/utils/fileUtils";

const getInitials = (text = "") =>
  text
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function JobCard({ job }) {
  const { user, loading } = useAuthMe();

  if (loading) return null;

  const companyLogoUrl = getFileUrl(job.company?.logoImagePath);

  return (
    <div className="bg-bg-card p-6 border border-border/40 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-lg overflow-hidden bg-primary-50 text-primary-300 font-semibold text-sm">
          {companyLogoUrl ? (
            <img
              src={companyLogoUrl}
              alt={job.companyName || "Company"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                const parent = e.target.parentElement;
                if (parent) {
                  parent.innerHTML = getInitials(
                    job.companyName || "Perusahaan"
                  );
                }
              }}
            />
          ) : (
            getInitials(job.companyName || "Perusahaan")
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            {job.title}
          </h3>
          <p className="text-text-secondary text-sm">
            {job.companyName || "Nama Perusahaan"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 text-text-secondary text-sm mb-3">
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
          <span>{job.jobType || "Semua Job Type"}</span>
        </div>
      </div>

      <p className="text-text-secondary text-sm mb-4 break-words break-all">
        {job.jobDescription || "-"}
      </p>

      <div className="flex gap-3">
        {(user?.role === "Company" || user?.role === "Human Resource") && (
          <Button
            href={
              user.role === "Company"
                ? `/company/see-applicants/${job.id}`
                : `/employer/see-applicants/${job.id}`
            }
            className="mt-4"
          >
            Lihat Pelamar
          </Button>
        )}

        {(!user || user?.role === "Job Seeker") && (
          <Button href={`/job-seeker/overview/${job.id}`} className="mt-4">
            Lamar
          </Button>
        )}
      </div>
    </div>
  );
}
