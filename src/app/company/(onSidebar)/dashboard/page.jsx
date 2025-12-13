"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { Calendar, Briefcase, Coins } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          request.get("/companies/me/profile", { withCredentials: true }),
          request.get("/jobs", { withCredentials: true }),
        ]);

        const data = profileRes.data;

        const logoUrl = data.logoImagePath
          ? `http://localhost:8080/api/files/view?path=${data.logoImagePath}`
          : null;

        setProfile({
          companyName: data.companyName,
          companyDescription: data.companyDescription,
          address: data.address,
          industryType: data.industryType,
          logoImagePath: logoUrl,
        });

        setJobs(jobsRes.data || []);
      } catch {
        toast.error("Gagal mengambil data perusahaan");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalPosting = jobs.length;
  const stillOpen = jobs.filter((j) => j.publicationStatus === "Open").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">
      <div className="w-full rounded-sm h-40 bg-blue-700 text-white p-6 flex items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Perusahaan</h1>
          <p className="text-gray-200 text-lg mt-1">
            Ringkasan aktivitas dan statistik lowongan kerja
          </p>
        </div>
      </div>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-xs p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xs bg-gray-200 overflow-hidden">
                  {profile.logoImagePath ? (
                    <img
                      src={profile.logoImagePath}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile.companyName}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {profile.address || "Alamat tidak tersedia"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/company/edit-profile")}
                className="p-2 text-gray-700 hover:text-black"
              >
                <svg
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.4776 0C14.8335 0 14.3014 0.269499 13.7978 0.653733C13.3207 1.01776 12.7909 1.54756 12.1556 2.1829L6.67473 7.66374C6.25384 8.08393 5.92105 8.41617 5.71696 8.84083C5.51286 9.26548 5.46131 9.73289 5.39612 10.324L5.37843 10.4838C5.25649 11.581 5.15597 12.4853 5.17898 13.1977C5.20304 13.9428 5.36405 14.6252 5.89744 15.1586C6.43084 15.692 7.11328 15.853 7.85833 15.8771C8.57071 15.9001 9.47506 15.7996 10.5722 15.6776L10.7321 15.6599C11.3232 15.5947 11.7906 15.5432 12.2152 15.3391C12.6399 15.135 12.9721 14.8022 13.3923 14.3813L18.8731 8.90043C19.5085 8.26512 20.0383 7.73536 20.4023 7.25824C20.7866 6.75463 21.0561 6.22256 21.0561 5.57843C21.0561 4.9343 20.7866 4.40222 20.4023 3.89862C20.0383 3.4215 19.5085 2.89174 18.8732 2.25644L18.7997 2.18293C18.1643 1.54757 17.6346 1.01777 17.1574 0.653733C16.6538 0.269499 16.1218 0 15.4776 0ZM18.3048 7.34491L13.7111 2.75128C14.1168 2.35162 14.4305 2.05772 14.7077 1.84627C15.0779 1.56383 15.2933 1.5 15.4776 1.5C15.6619 1.5 15.8774 1.56383 16.2476 1.84627C16.6351 2.1419 17.0941 2.59867 17.7757 3.28033C18.4574 3.96199 18.9142 4.42101 19.2098 4.80849C19.4922 5.17866 19.5561 5.39413 19.5561 5.57843C19.5561 5.76272 19.4922 5.97819 19.2098 6.34836C18.9983 6.62551 18.7044 6.93927 18.3048 7.34491ZM12.6492 3.81066L17.2454 8.40685L12.4039 13.2483C11.8765 13.7758 11.7307 13.9077 11.5655 13.9872C11.4002 14.0666 11.2061 14.098 10.4647 14.1803C9.29475 14.3103 8.49843 14.397 7.90674 14.3779C7.33517 14.3594 7.10441 14.2443 6.9581 14.098C6.81179 13.9516 6.69665 13.7209 6.6782 13.1493C6.65909 12.5576 6.74571 11.7613 6.87571 10.5913C6.95808 9.84997 6.98947 9.65589 7.06891 9.49061C7.14835 9.32533 7.28029 9.17957 7.80773 8.65213L12.6492 3.81066Z"
                    fill="black"
                  />
                  <path
                    d="M7.75899 2.67846C8.17317 2.6735 8.50491 2.33371 8.49995 1.91953C8.49498 1.50534 8.15519 1.17361 7.74101 1.17857C5.31449 1.20766 3.64894 1.34043 2.37024 2.26946C1.88209 2.62412 1.45281 3.0534 1.09815 3.54155C0.512324 4.34787 0.250006 5.29225 0.123728 6.45779C-1.45286e-05 7.59992 -8.0335e-06 9.03953 1.32337e-07 10.8761V10.9666C-8.0335e-06 12.8031 -1.45286e-05 14.2427 0.123728 15.3848C0.250006 16.5504 0.512324 17.4948 1.09815 18.3011C1.45281 18.7892 1.88209 19.2185 2.37024 19.5732C3.17656 20.159 4.12094 20.4213 5.28648 20.5476C6.42859 20.6713 7.86817 20.6713 9.70465 20.6713H9.79527C11.6318 20.6713 13.0714 20.6713 14.2135 20.5476C15.3791 20.4213 16.3234 20.159 17.1298 19.5732C17.6179 19.2185 18.0472 18.7892 18.4018 18.3011C19.3309 17.0224 19.4637 15.3568 19.4927 12.9303C19.4977 12.5161 19.166 12.1763 18.7518 12.1714C18.3376 12.1664 17.9978 12.4981 17.9928 12.9123C17.9629 15.4131 17.7945 16.585 17.1883 17.4194C16.9262 17.7802 16.6089 18.0975 16.2481 18.3596C15.7401 18.7287 15.0899 18.9439 14.052 19.0563C13 19.1703 11.6416 19.1713 9.75 19.1713C7.85843 19.1713 6.49999 19.1703 5.44804 19.0563C4.41013 18.9439 3.75992 18.7287 3.25191 18.3596C2.89111 18.0975 2.57382 17.7802 2.31168 17.4194C1.94259 16.9114 1.72745 16.2612 1.615 15.2233C1.50103 14.1713 1.5 12.8129 1.5 10.9213C1.5 9.02974 1.50103 7.6713 1.615 6.61936C1.72745 5.58144 1.94259 4.93123 2.31168 4.42322C2.57382 4.06242 2.89111 3.74513 3.25191 3.48299C4.08627 2.8768 5.25819 2.70844 7.75899 2.67846Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xs p-6 flex flex-col justify-center text-center">
            <p className="text-xl font-bold text-gray-900">{totalPosting}</p>
            <p className="text-gray-600 text-xs mt-1">Total Posting</p>
          </div>

          <div className="bg-white rounded-xs p-6 flex flex-col justify-center text-center">
            <p className="text-xl font-bold text-gray-900">{stillOpen}</p>
            <p className="text-gray-600 text-xs mt-1">Masih Terbuka</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xs p-6 mt-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800">Industri</p>
          <p className="text-gray-700 text-base mt-1">
            {profile.industryType || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-700 text-sm mt-1 leading-relaxed">
            {profile.companyDescription || "-"}
          </p>
        </div>
      </div>

      <OpenJobsSection jobs={jobs} />
    </div>
  );
}

function DashboardJobCard({ job }) {
  return (
    <div className="bg-white p-5 rounded-xs border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>

      <p className="text-gray-600 text-xs mb-3">
        {job.companyName || "Nama Perusahaan"}
      </p>

      <div className="flex gap-6 text-gray-700 text-xs mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>
            {job.registrationDeadline
              ? new Date(job.registrationDeadline).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Deadline tidak tersedia"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Coins size={14} />
          <span>
            {job.salary
              ? `Rp${job.salary.toLocaleString("id-ID")} / bulan`
              : "Gaji tidak tersedia"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Briefcase size={14} />
          <span>{job.jobType || "Tidak ditentukan"}</span>
        </div>
      </div>

      <p className="text-gray-700 text-xs line-clamp-3 break-all">
        {job.jobDescription}
      </p>
    </div>
  );
}

function OpenJobsSection({ jobs }) {
  const openJobs = jobs.filter((j) => j.publicationStatus === "Open");

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Lowongan yang Masih Terbuka
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {openJobs.map((job) => (
          <DashboardJobCard key={job.id} job={job} />
        ))}
      </div>

      {openJobs.length === 0 && (
        <p className="text-gray-500 text-sm">Tidak ada lowongan terbuka.</p>
      )}
    </div>
  );
}
