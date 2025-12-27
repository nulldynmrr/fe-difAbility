"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import request from "@/utils/request";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import HeaderCard from "@/components/card/HeaderCard";
import { Users, MessageCircle } from "lucide-react";
import CandidateDetailModal from "@/components/modal/applicantsModal";

const ITEMS_PER_PAGE = 5;

export default function SeeApplicants() {
  const { jobId } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [creatingChat, setCreatingChat] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    async function fetchAll() {
      try {
        const jobRes = await request.get(`/jobs/${jobId}`);
        const jobData = jobRes.data;
        setJob(jobData);

        if (jobData.companyId) {
          const companyRes = await request.get(
            `/companies/${jobData.companyId}/profile`
          );
          setCompany(companyRes.data);
        }

        const appRes = await request.get(`/jobs/${jobId}/applications`);

        const enriched = await Promise.all(
          appRes.data.map(async (app) => {
            const jsRes = await request.get(
              `/jobseekers/${app.jobSeekerId}/profile`
            );

            return {
              ...app,
              profile: {
                ...jsRes.data,
                skills: jsRes.data.skills || [],
                certificationFilePaths:
                  jsRes.data.certificationFilePaths || [],
              },
            };
          })
        );

        setApplicants(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [jobId]);

  const onCreateChat = async (jobSeekerId) => {
    setCreatingChat(jobSeekerId);
    try {
      const response = await request.post("/chat/conversations", {
        jobId: Number(jobId),
        jobSeekerId: jobSeekerId,
        initialMessage:
          "Halo, saya tertarik untuk berdiskusi mengenai lamaran Anda",
      });

      router.push(`/chat/${response.data.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Gagal membuat chat");
    } finally {
      setCreatingChat(null);
    }
  };

  const openCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
    setShowModal(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!job) return <p className="p-6">Job tidak ditemukan</p>;

  const totalPages = Math.ceil(applicants.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = applicants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 space-y-6 mt-12">
      <HeaderCard
        title="Posting Lowongan Kerja"
        subtitle="Mendukung kesempatan kerja untuk disabilitas"
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card p-6 overflow-hidden rounded-xl border border-border/60">
          <p className="font-bold text-xl">{job.title}</p>
          <p className="text-sm">{job.companyName}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/60">
          <p className="text-2xl font-bold">{applicants.length}</p>
          <p className="text-text-secondary text-sm">Jumlah Kandidat</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/60">
          <p className="text-2xl font-bold">
            {job.quota ? job.quota - applicants.length : "0"}
          </p>
          <p className="text-text-secondary text-sm">Jumlah Diterima</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-border/60">
          <h2 className="font-semibold">
            Kandidat Pekerja / {job.title}
          </h2>
          {Array.isArray(applicants) && applicants.length !== 0 && (
            <Button className="btn-primary">
              Buka data kandidat diterima
            </Button>
          )}
        </div>

        <table className="w-full text-sm">
          {Array.isArray(applicants) && applicants.length !== 0 && (
            <thead className="bg-primary-50">
              <tr>
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Nama Kandidat</th>
                <th className="p-4 text-left">Skills</th>
                <th className="p-4 text-left">All</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
          )}
          <tbody>
            {Array.isArray(applicants) && applicants.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 text-center w-full text-text-secondary">
                    <Users className="w-10 h-10 mb-2 opacity-60" />
                    <p>Belum ada pelamar</p>
                  </div>
                </td>
              </tr>
            )}

            {currentData.map((a, idx) => (
              <tr
                key={a.applicationId}
                className="border-t border-border/60 hover:bg-primary-50/50 transition"
              >
                <td className="p-4">{startIndex + idx + 1}</td>

                <td className="p-4 font-medium">
                  {a.profile.fullname}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {a.profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-primary-50 text-primary-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4 text-text-secondary">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      {a.profile.certificationFilePaths?.length || 0} Sertifikat
                    </li>
                    <li>{a.profile.disabilityType}</li>
                    <li>{a.profile.educationLevel}</li>
                  </ul>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="btn-primary"
                      onClick={() => openCandidateModal(a)}
                    >
                      Lihat Kandidat
                    </Button>

                    <Button
                      size="sm"
                      className="btn-primary flex items-center gap-2"
                      onClick={() => onCreateChat(a.jobSeekerId)}
                      disabled={creatingChat === a.jobSeekerId}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {creatingChat === a.jobSeekerId
                        ? "Loading..."
                        : "Chat"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end p-4 border-t border-border/60">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPage((p) => Math.max(p - 1, 1))
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

   
      {showModal && selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={closeCandidateModal}
          onAccept={(notes) => {
            console.log("ACCEPT", selectedCandidate.applicationId, notes);
            closeCandidateModal();
          }}
          onReject={(notes) => {
            console.log("REJECT", selectedCandidate.applicationId, notes);
            closeCandidateModal();
          }}
        />
      )}
    </div>
  );
}
