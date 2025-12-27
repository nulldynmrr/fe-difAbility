"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import request from "@/utils/request";

export default function ApplyJobModal({
  open,
  onClose,
  coverLetter,
  setCoverLetter,
  jobId,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!coverLetter.trim()) {
      setError("Cover letter wajib diisi");
      return;
    }
    if (coverLetter.length < 10) {
      setError("Cover letter minimal 10 karakter");
      return;
    }
    if (coverLetter.length > 500) {
      setError("Cover letter maksimal 500 karakter");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await request.post(`/jobs/${jobId}/applications`, { coverLetter });
      toast.success("Lamaran berhasil dikirim");
      setCoverLetter("");
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Kamu sudah melamar pekerjaan ini sebelumnya");
        onClose();
      } else {
        toast.error("Gagal mengirim lamaran");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-bg-card w-full max-w-lg rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Cover Letter</h2>

        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tulis cover letter kamu..."
          className="w-full h-32 border rounded-md p-3 text-sm"
        />

        <p className="text-gray-400 text-xs text-right">
          {coverLetter.length}/500
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Batal
          </button>

          <Button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm"
          >
            {loading ? "Mengirim..." : "Kirim Lamaran"}
          </Button>
        </div>
      </div>
    </div>
  );
}
