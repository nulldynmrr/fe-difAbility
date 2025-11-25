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

  const jobData = {
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
    disability: "Diselksia, Tunarungu",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
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
        text: "Pengalaman kerja di sini cukup menantang. Ada beberapa kesulitan dalam akses, keterbatasan karir, kurangnya pelatihan, diskriminasi, dan masalah beban kerja. Namun, ada hal positif seperti bonus, tunjangan, lingkungan kerja, dan sistem kerja yang baik.",
      },
      {
        rating: 4,
        date: "25 Oktober 2025",
        text: "Pengalaman kerja di sini cukup menantang. Ada beberapa kesulitan dalam akses, keterbatasan karir, kurangnya pelatihan, diskriminasi, dan masalah beban kerja. Namun, ada hal positif seperti bonus, tunjangan, lingkungan kerja, dan sistem kerja yang baik.",
      },
    ],
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleApply = () => {
    // Handle apply logic
    console.log("Applying for job");
  };

  const handleReport = (reviewIndex) => {
    // Handle report logic
    console.log("Reporting review", reviewIndex);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header Section */}
      <header className="bg-card border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-300">
                disLok
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-text-secondary hover:text-primary-300 transition-colors font-medium"
              >
                Pelatihan & Skil
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-primary-300 transition-colors font-medium"
              >
                Komunitas
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-primary-300 transition-colors font-medium"
              >
                Tentang Kami
              </a>
              <Button
                variant="primary"
                className="ml-4"
                voiceLabel="Update Profile"
              >
                Update Profile
              </Button>
            </div>
          </div>

          {/* Main Header with Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-text-primary">
              Job Details
            </h1>
            <div className="w-full md:w-auto flex items-center gap-2">
              <form
                onSubmit={handleSearch}
                className="flex-1 md:flex-initial flex items-center bg-gray-50 rounded-md border border-gray-300 p-2 min-w-[300px]"
              >
                <Search className="text-primary-300 mr-2" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="cari postingan lain"
                  className="flex-1 bg-transparent outline-none text-text-primary"
                />
                <button
                  type="button"
                  className="ml-2 text-primary-300 hover:text-primary-300 transition-colors"
                  aria-label="Aktifkan pencarian suara"
                >
                  <Mic size={20} />
                </button>
              </form>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSearch}
                className="hidden md:block"
                voiceLabel="Cari"
              >
                Cari
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Title and Company */}
            <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                {jobData.title}
              </h2>
              <p className="text-lg text-text-secondary mb-6">
                {jobData.company}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleBookmark}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isBookmarked
                      ? "border-primary-300 bg-primary-50 text-primary-300"
                      : "border-gray-300 hover:border-primary-300 hover:bg-primary-50"
                  }`}
                  aria-label={
                    isBookmarked ? "Hapus dari bookmark" : "Tambah ke bookmark"
                  }
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
                <Button
                  variant="primary"
                  onClick={handleApply}
                  className="flex-1 flex items-center justify-center gap-2"
                  voiceLabel="Lamar Kerja"
                >
                  <Briefcase className="w-5 h-5" />
                  Lamar Kerja
                </Button>
              </div>
              <p className="text-sm text-text-secondary">
                Batas pendaftaran {jobData.deadline}
              </p>
            </div>

            {/* Job Overview */}
            <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Job Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Job Posted</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.postedDate}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Job Expire In</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.expireDate}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <GraduationCap className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Education</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.education}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <DollarSign className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Salary</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.salary}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.location}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Briefcase className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Job Type</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.jobType}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Briefcase className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.experience}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Accessibility className="w-5 h-5 text-primary-300" />
                    <span className="text-sm font-medium">Disability</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {jobData.disability}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Job Description */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Description */}
            <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Deskripsi Pekerjaan
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                {jobData.description}
              </p>
              <p className="text-text-secondary leading-relaxed">
                {jobData.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Tanggung Jawab / Jobdesck
              </h3>
              <ul className="space-y-2">
                {jobData.responsibilities.map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-text-secondary"
                  >
                    <span className="text-primary-300 mt-1">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Social Media */}
            <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-text-primary mb-4">
                Media Sosial Perusahaan
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path
                      d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                      fill="white"
                    />
                    <line
                      x1="17.5"
                      y1="6.5"
                      x2="17.51"
                      y2="6.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-card rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-text-primary mb-6">Ulasan</h3>
          <div className="space-y-6">
            {jobData.reviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
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
                <p className="text-text-secondary leading-relaxed mb-3">
                  {review.text}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleReport(index)}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary-300 transition-colors"
                    aria-label="Laporkan ulasan"
                  >
                    <Flag className="w-4 h-4" />
                    Laporkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
