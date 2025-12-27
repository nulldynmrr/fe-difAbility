"use client";

import { useEffect, useState } from "react";
import request from "@/utils/request";

export default function PdfPreviewCard({ url, label }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPdf = async () => {
      try {
        const res = await request.get(url.replace("/api", ""), {
          responseType: "blob",
        });

        const objectUrl = URL.createObjectURL(res.data);
        if (active) setBlobUrl(objectUrl);
      } catch (e) {
        console.error("Gagal load PDF:", e);
        setError(true);
      }
    };

    loadPdf();

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url]);

  if (error) {
    return (
      <p className="text-sm text-red-500">
        Gagal memuat dokumen
      </p>
    );
  }

  if (!blobUrl) {
    return (
      <p className="text-sm text-text-secondary">
        Memuat dokumen...
      </p>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-bg-card">
      <div className="px-3 py-2 text-sm font-medium border-b">
        {label}
      </div>
      <iframe
        src={blobUrl}
        className="w-full h-[420px]"
        title={label}
      />
    </div>
  );
}
