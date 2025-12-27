"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import OpenJobs from "@/components/card/OpenJobSection";
import { Calendar, Briefcase, Coins, X, Copy } from "lucide-react";

export default function JobPosting() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hrData, setHrData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmSaved, setConfirmSaved] = useState(false);

  const authMe = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/auth/me");
      setUser(response.data || []);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setUser([]);
      } else {
        toast.error("Gagal memuat data lowongan");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/jobs");
      setJobs(response.data || []);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setJobs([]);
      } else {
        toast.error("Gagal memuat data lowongan");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    authMe();
  }, [fetchJobs, authMe]);

  const openJobs = jobs.filter((j) => j.publicationStatus === "Open");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat...
      </div>
    );


  return (
    <div className="min-h-screen mt-18">
      <div className="w-full rounded-sm h-40 bg-blue-700 text-white p-6 flex items-center">
        <div>
          <h1 className="text-3xl font-bold">Posting Kerja Perusahaan</h1>
          <p className="text-gray-200 text-lg mt-2">
            Kelola dan pantau semua lowongan perusahaan Anda
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end items-center">
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/employer/job-posting/post-job")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xs text-sm mb-8
            hover:bg-blue-700 transition rounded-xl" 
          >
            Buat Postingan Baru
          </button>
        </div>
      </div>

      <div
        className={`col-span-1 ${
          jobs.length !== 0 ? "lg:col-span-9" : "lg:col-span-12"
        } bg-bg border border-border/40 rounded-xl p-5 h-fit`}
      >
        <OpenJobs jobs={jobs} />
      </div>

      {showModal && hrData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => {
                if (confirmSaved) setShowModal(false);
                else
                  alert("Silakan simpan username & password sebelum menutup!");
              }}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">HR Account Created</h3>

            <div className="flex items-center justify-between mb-2">
              <p>
                <strong>Username:</strong> {hrData.generatedUsername}
              </p>
              <button onClick={() => copyToClipboard(hrData.generatedUsername)}>
                <Copy size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p>
                <strong>Password:</strong> {hrData.generatedPassword}
              </p>
              <button onClick={() => copyToClipboard(hrData.generatedPassword)}>
                <Copy size={16} />
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={confirmSaved}
                  onChange={(e) => setConfirmSaved(e.target.checked)}
                />
                Saya sudah menyimpan informasi login
              </label>
            </div>

            <button
              onClick={() => {
                if (confirmSaved) setShowModal(false);
                else alert("Silakan centang kotak konfirmasi sebelum menutup!");
              }}
              disabled={!confirmSaved}
              className={`mt-4 w-full px-4 py-2 text-white rounded transition ${
                confirmSaved
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
