"use client";

import { useEffect, useState } from "react";
import request from "@/utils/request";
import Button from "@/components/ui/Button";
import HeaderCard from "@/components/card/HeaderCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Users, MessageCircle } from "lucide-react";
import CandidateDetailModal from "@/components/modal/applicantsModal";

const ITEMS_PER_PAGE = 5;

export default function SeeAllApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [creatingChat, setCreatingChat] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchAllApplicants() {
      setLoading(true);
      try {
        const jobsRes = await request.get("/jobs");
        const jobs = jobsRes.data;

        const allApplications = await Promise.all(
          jobs.map(async (job) => {
            const appRes = await request.get(`/jobs/${job.jobId}/applications`);
            return appRes.data.map((app) => ({
              ...app,
              jobTitle: job.title,
              jobCompanyName: job.companyName,
            }));
          })
        );

        const flattenedApplicants = allApplications.flat();

        const enriched = await Promise.all(
          flattenedApplicants.map(async (app) => {
            const jsRes = await request.get(
              `/jobseekers/${app.jobSeekerId}/profile`
            );

            return {
              ...app,
              profile: {
                ...jsRes.data,
                skills: jsRes.data.skills || [],
                certificationFilePaths: jsRes.data.certifFilePaths || [],
              },
            };
          })
        );

        setApplicants(enriched);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllApplicants();
  }, []);

  const onCreateChat = async (jobSeekerId) => {
    setCreatingChat(jobSeekerId);
    try {
      const response = await request.post("/chat/conversations", {
        initialMessage:
          "Halo, saya tertarik untuk berdiskusi mengenai lamaran Anda",
        jobSeekerId,
      });
      window.location.href = `/chat/${response.data.id}`;
    } catch (error) {
      console.error(error);
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

  const totalPages = Math.ceil(applicants.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = applicants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6 space-y-6 mt-12">
      <HeaderCard
        title="Semua Kandidat Pelamar"
        subtitle="Mendukung kesempatan kerja untuk disabilitas"
      />

      <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-border/60">
          <h2 className="font-semibold">Daftar Kandidat</h2>
        </div>

        <table className="w-full text-sm">
          {currentData.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 text-center w-full text-text-secondary">
                    <Users className="w-10 h-10 mb-2 opacity-60" />
                    <p>Belum ada pelamar</p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {currentData.length > 0 && (
            <thead className="bg-primary-50">
              <tr>
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Nama Kandidat</th>
                <th className="p-4 text-left">Skills</th>
                <th className="p-4 text-left">Detail</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
          )}

          <tbody>
            {currentData.map((a, idx) => (
              <tr
                key={a.applicationId}
                className="border-t border-border/60 hover:bg-primary-50/50 transition"
              >
                <td className="p-4">{startIndex + idx + 1}</td>
                <td className="p-4 font-medium">{a.profile.fullname}</td>
                <td className="p-4 flex flex-wrap gap-2">
                  {a.profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs bg-primary-50 text-primary-300"
                    >
                      {skill}
                    </span>
                  ))}
                </td>
                <td className="p-4 text-text-secondary">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      {a.profile.certificationFilePaths?.length || 0} Sertifikat
                    </li>
                    <li>{a.profile.disabilityType}</li>
                    <li>{a.profile.educationLevel}</li>
                    <li>
                      {a.jobTitle} - {a.jobCompanyName}
                    </li>
                  </ul>
                </td>
                <td className="p-4 flex gap-2">
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
                    {creatingChat === a.jobSeekerId ? "Loading..." : "Chat"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-end p-4 border-t border-border/60">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
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
