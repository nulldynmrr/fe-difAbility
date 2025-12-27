"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { getCurrentUser } from "@/utils/request";
import { toast } from "sonner";

import HeaderCard from "@/components/card/HeaderCard";
import Image from "@/components/ui/Image";

import { FileText, Award, X, Edit } from "lucide-react";

export default function JobSeekerProfile() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState("");

  React.useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const normalizeImageSrc = (path) => {
    if (!path) return "/avatar.png";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/${path}`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await request.get("/jobseekers/me/profile");
        const data = res.data;

        setProfile({
          fullname: data.fullname || "-",
          email: data.email || "m@example.com",
          about: data.about || "-",
          address: data.address || "-",
          disabilityType: data.disabilityType || "-",
          skills: Array.isArray(data.skills) ? data.skills : [],
          educationLevel: data.educationLevel || "-",
          academicYear: data.academicYear || "-",
          jobType: data.jobType || "-",
          ppImagePath: data.ppImagePath || "",
          cvDocumentPath: data.cvDocumentPath || "",
          certificationFilePaths: Array.isArray(data.certificationFilePaths)
            ? data.certificationFilePaths
            : [],
        });
      } catch (e) {
        toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getFileUrl = (path) =>
    path ? `${process.env.NEXT_PUBLIC_HOST}/${path}` : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <HeaderCard
        title="Cari pekerjaan dengan mudah, tanpa halangan apa pun"
        subtitle="Ribuan lowongan dari perusahaan yang peduli aksesibilitas"
        showSearch={false}
      />

      <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-card rounded-lg p-4 border border-border/40 md:col-span-1 space-y-6">
          <div className="flex items-center gap-3 mb-16">
            {/* <Image
              src={normalizeImageSrc(profile.ppImagePath)}
              width={56}
              height={56}
              alt="profile"
              className="rounded-full object-cover"
            /> */}


            <div className="flex-1">
              <p className="font-semibold">{profile.fullname}</p>
            </div>
            <button
              onClick={() => router.push("/job-seeker/update-profile")}
              className="text-gray-400 hover:text-black"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <Section title="Tipe Pekerjaan">
            <Chip text={profile.jobType} />
            <Chip text="Disleksia-friendly" />
          </Section>

          <Section title="Skills">
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <Chip key={i} text={s} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada skill</p>
            )}
          </Section>

          <Section title="Education">
            <p className="text-sm text-gray-700">
              {profile.educationLevel} ({profile.academicYear})
            </p>
          </Section>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard value="12" label="lamar kerja" />
            <StatCard value="2" label="diterima kerja" />
            <StatCard value="6" label="dalam proses" />
            <StatCard value="4" label="ditolak kerja" />
          </div>

          <div className="bg-bg-card rounded-lg p-4 border border-border/40 space-y-6">
            <Section title="Tentang Saya">
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.about}
              </p>
            </Section>

            {profile.cvDocumentPath && (
              <Section title="CV">
                <FileCard
                  icon={<FileText />}
                  title={`CV - ${profile.fullname}`}
                  onClick={() => {
                    setModalFile(getFileUrl(profile.cvDocumentPath));
                    setModalOpen(true);
                  }}
                />
              </Section>
            )}

            {profile.certificationFilePaths.length > 0 && (
              <Section title="Sertifikasi">
                <div className="space-y-2">
                  {profile.certificationFilePaths.map((c, i) => (
                    <FileCard
                      key={i}
                      icon={<Award />}
                      title={`Sertifikasi ${i + 1}`}
                      onClick={() => {
                        setModalFile(getFileUrl(c));
                        setModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3"
              onClick={() => setModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {modalFile.endsWith(".pdf") ? (
              <iframe src={modalFile} className="w-full h-[600px]" />
            ) : (
              <img src={modalFile} className="w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <p className="font-semibold text-sm">{title}</p>
    {children}
  </div>
);

const Chip = ({ text }) => (
  <span className="px-3 py-1 text-xs bg-gray-100 rounded-full">{text}</span>
);

const StatCard = ({ value, label }) => (
  <div className="bg-bg-card p-4 rounded-lg border border-border/40 text-center">
    <p className="text-xl font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const FileCard = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg w-full flex items-center gap-3 text-left"
  >
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="font-medium text-sm">{title}</p>
      {/* <p className="text-xs text-blue-600">Lihat file</p> */}
    </div>
  </button>
);
