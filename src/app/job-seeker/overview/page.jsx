"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  DollarSign,
  MapPin,
  Accessibility,
  Search,
  Mic,
  Star,
  Flag,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function Overview() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [jobData] = useState({
    title: "UI Designer",
    company: "Lui Company",
    deadline: "28 Oktober 2025",
    postedDate: "24 OCT, 2025",
    expireDate: "28 OCT, 2025",
    education: "Graduation",
    salary: "12 JUTA",
    location: "JAKARTA SELATAN",
    jobType: "Full Time",
    experience: "10-15 TAHUN",
    disability: "Disleksia, Tunarungu",
    description:
      "Deskripsi lengkap pekerjaan akan ditampilkan di sini sesuai data dari backend.",
    responsibilities: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    ],
    reviews: [
      {
        rating: 4,
        date: "25 Oktober 2025",
        text: "Pengalaman kerja di sini cukup menantang. Ada beberapa kesulitan dalam akses, keterbatasan karir, dan beban kerja. Namun lingkungan kerja cukup suportif.",
      },
      {
        rating: 4,
        date: "25 Oktober 2025",
        text: "Perusahaan cukup terbuka terhadap disabilitas, walaupun masih ada ruang perbaikan di pelatihan dan sistem kerja.",
      },
    ],
  });

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handleApply = () => {
    // TODO: connect apply job to backend
  };

  const handleReport = (index) => {
    // TODO: report review to backend
  };

  const handleSearch = () => {
    // TODO: search job
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="bg-card border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary-300">disLok</span>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-text-secondary hover:text-primary-300">
                Pelatihan & Skill
              </a>
              <a className="text-text-secondary hover:text-primary-300">
                Komunitas
              </a>
              <a className="text-text-secondary hover:text-primary-300">
                Tentang Kami
              </a>
              <Button variant="primary">Update Profile</Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <h1 className="text-3xl font-bold">Job Details</h1>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="flex items-center border rounded-md px-3 py-2 flex-1 min-w-[280px]">
                <Search size={18} className="text-primary-300 mr-2" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari postingan lain"
                  className="flex-1 outline-none bg-transparent"
                />
                <button
                  type="button"
                  aria-label="Pencarian suara"
                  className="ml-2 text-primary-300"
                >
                  <Mic size={18} />
                </button>
              </div>

              <Button variant="primary" onClick={handleSearch}>
                Cari
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-3xl font-bold">{jobData.title}</h2>
              <p className="text-text-secondary mb-4">{jobData.company}</p>

              <div className="flex gap-4 mb-3">
                <button
                  onClick={handleBookmark}
                  aria-label="Bookmark"
                  className={`p-3 rounded-lg border ${
                    isBookmarked
                      ? "border-primary-300 bg-primary-50"
                      : "border-gray-300"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      isBookmarked ? "fill-primary-300 text-primary-300" : ""
                    }`}
                  />
                </button>

                <Button
                  variant="primary"
                  className="flex-1 flex items-center gap-2 justify-center"
                  onClick={handleApply}
                >
                  <Briefcase size={18} />
                  Lamar Kerja
                </Button>
              </div>

              <p className="text-sm text-text-secondary">
                Batas pendaftaran {jobData.deadline}
              </p>
            </div>

            {/* OVERVIEW */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-4">Job Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  [Calendar, "Job Posted", jobData.postedDate],
                  [Clock, "Expire", jobData.expireDate],
                  [GraduationCap, "Education", jobData.education],
                  [DollarSign, "Salary", jobData.salary],
                  [MapPin, "Location", jobData.location],
                  [Briefcase, "Type", jobData.jobType],
                  [Briefcase, "Experience", jobData.experience],
                  [Accessibility, "Disability", jobData.disability],
                ].map(([Icon, label, value], i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Icon size={18} className="text-primary-300" />
                      <span className="text-sm">{label}</span>
                    </div>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-3">Deskripsi Pekerjaan</h3>
              <p className="text-text-secondary leading-relaxed">
                {jobData.description}
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-3">
                Tanggung Jawab / Jobdesk
              </h3>
              <ul className="space-y-2">
                {jobData.responsibilities.map((item, i) => (
                  <li key={i} className="flex gap-2 text-text-secondary">
                    <span className="text-primary-300">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h3 className="text-2xl font-bold mb-4">Ulasan</h3>

          <div className="space-y-6">
            {jobData.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "fill-primary-300 text-primary-300"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">
                    {review.date}
                  </span>
                </div>

                <p className="text-text-secondary mb-2">{review.text}</p>

                <button
                  onClick={() => handleReport(index)}
                  className="text-sm flex items-center gap-1 text-text-secondary hover:text-primary-300"
                >
                  <Flag size={14} />
                  Laporkan
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
