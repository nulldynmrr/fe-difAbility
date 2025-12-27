"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Bookmark,
  Briefcase,
  Clock,
  GraduationCap,
  DollarSign,
  Accessibility,
  Star,
  Flag,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import request from "@/utils/request";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import ApplyJobModal from "@/components/modal/applyModal";
import { toast } from "sonner";
import { formatWaktu } from "@/lib/time";
import { formatMoney } from "@/lib/money";

export default function Overview() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loadingApply, setLoadingApply] = useState(false);

  const fetchJob = useCallback(async () => {
    try {
      const res = await request.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (e) {
      toast.error("Gagal memuat detail pekerjaan");
    }
  }, [id]);

  const fetchMyProfile = useCallback(async () => {
    try {
      const res = await request.get("/jobseekers/me/profile");
      setProfileCompleted(res.data.profileCompleted === true);
    } catch (e) {
      setProfileCompleted(false);
    }
  }, []);

  useEffect(() => {
    fetchJob();
    fetchMyProfile();
  }, [fetchJob, fetchMyProfile]);

  if (!job) return null;

  function handleApply() {
    setShowApplyModal(true);
  }

  async function submitApplication() {
    if (!coverLetter.trim()) {
      toast.error("Cover letter wajib diisi");
      return;
    }

    setLoadingApply(true);

    try {
      await request.post(`/jobs/${job.id}/applications`, {
        coverLetter,
      });

      toast.success("Lamaran berhasil dikirim");
      setShowApplyModal(false);
      setCoverLetter("");
    } catch (error) {
      toast.error("Gagal mengirim lamaran");
    } finally {
      setLoadingApply(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10 mt-18">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-start md:items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>
              <p className="text-gray-500">{job.companyName}</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="w-12 h-12 border rounded-md flex items-center justify-center">
                <Bookmark size={18} />
              </button>

              <Button
                onClick={handleApply}
                className="flex items-center gap-2 px-4"
              >
                <Briefcase size={18} />
                Lamar Kerja
              </Button>
            </div>

            <p className="text-sm">
              Batas pendaftaran{" "}
              <span className="text-red-500">
                {formatWaktu(job.registrationDeadline, "date")}
              </span>
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-6">Job Overview</h2>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <Item
                  icon={Clock}
                  label="JOB EXPIRE IN"
                  value={formatWaktu(job.registrationDeadline, "date")}
                />
                <Item
                  icon={GraduationCap}
                  label="EDUCATION"
                  value={job.minimumEducation}
                />
                <Item
                  icon={DollarSign}
                  label="SALARY"
                  value={formatMoney(job.salary)}
                />
                <Item icon={Briefcase} label="JOB TYPE" value="Full Time" />
                <Item
                  icon={Briefcase}
                  label="EXPERIENCE"
                  value={`${job.minimumYearsExperience} Tahun`}
                />
                <Item
                  icon={Accessibility}
                  label="DISABILITY"
                  value={job.compatibleDisabilities.join(", ")}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Deskripsi Pekerjaan</h2>
              <p className="text-gray-600 break-words whitespace-normal">
                {job.jobDescription}
              </p>
            </div>
          </div>
        </section>
      </div>

      {showApplyModal && (
        <ApplyJobModal
          open={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          jobId={job.id}
        />
      )}
    </>
  );
}

function Item({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
