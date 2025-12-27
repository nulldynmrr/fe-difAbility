// "use client";

// import { useState, useCallback, useMemo } from "react";
// import Image from "@/components/ui/Image";
// import Button from "@/components/ui/Button";
// import { X, FileText, ImageIcon } from "lucide-react";
// import { getFileUrl } from "@/utils/fileUtils";
// import PdfPreviewCard from "@/components/ui/PDFPreview";

// export default function CandidateDetailModal({
//   candidate,
//   onClose,
//   onAccept,
//   onReject,
// }) {
//   if (!candidate) return null;

//   const profile = candidate.profile || {};

//   const [showCV, setShowCV] = useState(false);
//   const [showCert, setShowCert] = useState(false);
//   const [hrNotes, setHrNotes] = useState("");

//   const profileImage = useMemo(
//     () => getFileUrl(profile.ppImagePath) || "/default-profile.png",
//     [profile.ppImagePath]
//   );

//   const cvUrl = useMemo(
//     () => getFileUrl(candidate.cvDocumentPath),
//     [candidate.cvDocumentPath]
//   );

//   const certUrls = useMemo(
//     () => profile.certificationFilePaths?.map((path) => getFileUrl(path)) || [],
//     [profile.certificationFilePaths]
//   );

//   const toggleCV = useCallback(() => {
//     setShowCV((v) => !v);
//   }, []);

//   const toggleCert = useCallback(() => {
//     setShowCert((v) => !v);
//   }, []);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-bg-card w-full max-w-3xl rounded-xl border shadow-lg relative max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
//         >
//           <X size={22} />
//         </button>

//         <div className="p-6 space-y-6">
//           <div className="flex gap-4 items-center">
//             <Image
//               src={profileImage}
//               width={92}
//               height={92}
//               alt="Foto Kandidat"
//               className="rounded-full object-cover border"
//               unoptimized
//             />
//             <div>
//               <p className="text-xl font-bold">{profile.fullname || "-"}</p>
//               <p className="text-sm text-text-secondary">
//                 {profile.address || "-"}
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-primary-50 rounded-lg p-4">
//               <p className="text-sm text-text-secondary">Disabilitas</p>
//               <p className="font-semibold">{profile.disabilityType || "-"}</p>
//             </div>

//             <div className="bg-primary-50 rounded-lg p-4">
//               <p className="text-sm text-text-secondary">Pendidikan</p>
//               <p className="font-semibold">{profile.educationLevel || "-"}</p>
//             </div>
//           </div>
//           <div>
//             <p className="font-medium mb-2">Skills</p>
//             <div className="flex flex-wrap gap-2">
//               {profile.skills?.length ? (
//                 profile.skills.map((skill, i) => (
//                   <span
//                     key={i}
//                     className="px-3 py-1 rounded-full text-sm bg-primary-50 border"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               ) : (
//                 <p className="text-text-secondary">-</p>
//               )}
//             </div>
//           </div>
//           <div className="border rounded-lg p-4 space-y-3">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <FileText size={18} />
//                 <p className="font-medium">Curriculum Vitae</p>
//               </div>

//               {cvUrl && (
//                 <Button className="btn-secondary text-sm" onClick={toggleCV}>
//                   {showCV ? "Tutup" : "View"}
//                 </Button>
//               )}
//             </div>

//             {!cvUrl && <p className="text-text-secondary text-sm">-</p>}

//             {showCV && cvUrl && (
//               <PdfPreviewCard url={cvUrl} label="Curriculum Vitae (PDF)" />
//             )}
//           </div>

//           <div className="border rounded-lg p-4 space-y-3">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <ImageIcon size={18} />
//                 <p className="font-medium">Sertifikat</p>
//               </div>

//               {certUrls.length > 0 && (
//                 <Button className="btn-secondary text-sm" onClick={toggleCert}>
//                   {showCert ? "Tutup" : "View All"}
//                 </Button>
//               )}
//             </div>

//             {!certUrls.length && (
//               <p className="text-text-secondary text-sm">-</p>
//             )}

//             {showCert && (
//               <div className="grid grid-cols-2 gap-3">
//                 {certUrls.map((file, i) => (
//                   <PdfPreviewCard
//                     key={i}
//                     url={file}
//                     label={`Sertifikat ${i + 1}`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="border rounded-lg p-4 space-y-2">
//             <p className="font-medium text-sm">Catatan HR</p>
//             <textarea
//               value={hrNotes}
//               onChange={(e) => setHrNotes(e.target.value)}
//               placeholder="Tulis catatan penilaian kandidat..."
//               className="w-full border rounded-md p-2 text-sm min-h-[90px]"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end gap-3 p-4 border-t">
//           <Button className="btn-secondary" onClick={() => onReject(hrNotes)}>
//             Tolak
//           </Button>

//           <Button className="btn-primary" onClick={() => onAccept(hrNotes)}>
//             Terima Kandidat
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "@/components/ui/Image";
import Button from "@/components/ui/Button";
import { X, FileText, ImageIcon } from "lucide-react";
import { getFileUrl } from "@/utils/fileUtils";
import PdfPreviewCard from "@/components/ui/PDFPreview";

export default function CandidateDetailModal({
  candidate,
  onClose,
  onAccept,
  onReject,
}) {
  if (!candidate) return null;

  const profile = candidate.profile || {};

  const [showCV, setShowCV] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [hrNotes, setHrNotes] = useState("");

  const profileImage = useMemo(() => {
    return getFileUrl(profile.ppImagePath) || "/default-profile.png";
  }, [profile.ppImagePath]);

  const cvUrl = useMemo(() => {
    return getFileUrl(candidate.cvDocumentPath);
  }, [candidate.cvDocumentPath]);

  const certUrls = useMemo(() => {
    return (
      profile.certificationFilePaths?.map((path) => getFileUrl(path)) || []
    );
  }, [profile.certificationFilePaths]);

  const toggleCV = useCallback(() => {
    setShowCV((v) => !v);
  }, []);

  const toggleCert = useCallback(() => {
    setShowCert((v) => !v);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-bg-card w-full max-w-3xl rounded-xl border shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <X size={22} />
        </button>

        <div className="p-6 space-y-6">
          <div className="flex gap-4 items-center">
            <Image
              src={profileImage}
              width={92}
              height={92}
              alt="Foto Kandidat"
              className="rounded-full object-cover border"
              unoptimized
            />
            <div>
              <p className="text-xl font-bold">
                {profile.fullname || "-"}
              </p>
              <p className="text-sm text-text-secondary">
                {profile.address || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-sm text-text-secondary">Disabilitas</p>
              <p className="font-semibold">
                {profile.disabilityType || "-"}
              </p>
            </div>

            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-sm text-text-secondary">Pendidikan</p>
              <p className="font-semibold">
                {profile.educationLevel || "-"}
              </p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm bg-primary-50 border"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-text-secondary">-</p>
              )}
            </div>
          </div>

          {/* CV */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <p className="font-medium">Curriculum Vitae</p>
              </div>

              {cvUrl && (
                <Button
                  className="btn-secondary text-sm"
                  onClick={toggleCV}
                >
                  {showCV ? "Tutup" : "View"}
                </Button>
              )}
            </div>

            {!cvUrl && (
              <p className="text-text-secondary text-sm">-</p>
            )}

            {showCV && cvUrl && (
              <PdfPreviewCard
                url={cvUrl}
                label="Curriculum Vitae (PDF)"
              />
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} />
                <p className="font-medium">Sertifikat</p>
              </div>

              {certUrls.length > 0 && (
                <Button
                  className="btn-secondary text-sm"
                  onClick={toggleCert}
                >
                  {showCert ? "Tutup" : "View All"}
                </Button>
              )}
            </div>

            {!certUrls.length && (
              <p className="text-text-secondary text-sm">-</p>
            )}

            {showCert && (
              <div className="grid grid-cols-2 gap-3">
                {certUrls.map((file, i) => (
                  <PdfPreviewCard
                    key={i}
                    url={file}
                    label={`Sertifikat ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <p className="font-medium text-sm">Catatan HR</p>
            <textarea
              value={hrNotes}
              onChange={(e) => setHrNotes(e.target.value)}
              placeholder="Tulis catatan penilaian kandidat..."
              className="w-full border rounded-md p-2 text-sm min-h-[90px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <Button
            className="btn-secondary"
            onClick={() => onReject(hrNotes)}
          >
            Tolak
          </Button>

          <Button
            className="btn-primary"
            onClick={() => onAccept(hrNotes)}
          >
            Terima Kandidat
          </Button>
        </div>
      </div>
    </div>
  );
}
