"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function CandidateOverview() {
  const candidateData = {
    name: "profile",
    email: "m@example.com",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    jobTypes: ["Paruh Waktu", "Full Time", "Disleksia-friendly"],
    skills: ["Figma", "Figma", "Figma"],
    education: "Fresh Gradution",
    experiences: [
      {
        position: "[Position Job]",
        company: "[Compoany Profile]",
        dateRange: "12 Januari 2025 - 12 Maret 2025",
        job1: "Job 1",
        job2: "Job 2",
      },
      {
        position: "[Position Job]",
        company: "[Compoany Profile]",
        dateRange: "12 Januari 2025 - 12 Maret 2025",
        job1: "Job 1",
        job2: "Job 2",
      },
      {
        position: "[Position Job]",
        company: "[Compoany Profile]",
        dateRange: "12 Januari 2025 - 12 Maret 2025",
        job1: "Job 1",
        job2: "Job 2",
      },
    ],
    cvName: "CV - [nama Profile]",
    cvUpdateDate: "update 24 Oktober 2025",
    certificationName: "Sertifikasi - [nama Profile]",
    certificationUpdateDate: "update 24 Oktober 2025",
  };

  const handleCancel = () => {
    // Handle cancel logic
    console.log("Cancel clicked");
  };

  const handleAccept = () => {
    // Handle accept logic
    console.log("Candidate accepted");
  };

  return (
    <div className="min-h-screen bg-bg p-6">
      {/* Top Banner */}
      <div className="bg-primary-300 rounded-xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Siap memberi banyak lowongan pekerjaan
          </h2>
          <p className="text-white/90 text-lg">
            Meningkatkan kepercayaan kepada disabilitas
          </p>
        </div>
        {/* Illustration - simplified representation */}
        <div className="absolute right-8 top-4 w-48 h-48 opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2">
            {/* Person in wheelchair with laptop */}
            <circle cx="60" cy="140" r="25" />
            <rect x="35" y="120" width="50" height="30" rx="5" />
            <rect x="45" y="100" width="30" height="20" rx="2" />
            {/* Standing person with book */}
            <circle cx="140" cy="100" r="20" />
            <rect x="130" y="120" width="20" height="40" />
            <rect x="125" y="80" width="30" height="25" rx="2" />
            {/* Stack of books */}
            <rect x="160" y="110" width="25" height="5" />
            <rect x="155" y="115" width="25" height="5" />
            <rect x="160" y="120" width="25" height="5" />
          </svg>
        </div>
      </div>

      {/* Detail Kandidat Section */}
      <div className="bg-card rounded-lg shadow-md border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Detail Kandidat</h1>

        {/* Candidate Profile */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xl font-medium text-text-primary">P</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{candidateData.name}</h2>
            <p className="text-sm text-text-secondary">{candidateData.email}</p>
          </div>
        </div>

        {/* Deskripsi Kandidat */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-3">Deskripsi Kandidat</h3>
          <p className="text-text-secondary leading-relaxed">{candidateData.description}</p>
        </div>

        {/* Tipe Pekerjaan */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-3">Tipe Pekerjaan</h3>
          <div className="flex flex-wrap gap-2">
            {candidateData.jobTypes.map((jobType, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-gray-200 text-text-secondary text-sm font-medium"
              >
                {jobType}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidateData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-gray-200 text-text-secondary text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-3">Education</h3>
          <p className="text-text-secondary">{candidateData.education}</p>
        </div>

        {/* Pengalaman */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-3">Pengalaman</h3>
          <div className="space-y-3">
            {candidateData.experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg p-4 border border-blue-100"
              >
                <div className="font-semibold text-text-primary mb-2">
                  {exp.position} - {exp.company}
                </div>
                <div className="text-sm text-text-secondary mb-2">{exp.dateRange}</div>
                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                  <li>{exp.job1}</li>
                  <li>{exp.job2}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CV */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-2">CV</h3>
          <p className="text-text-secondary">{candidateData.cvName}</p>
          <p className="text-sm text-text-secondary">{candidateData.cvUpdateDate}</p>
        </div>

        {/* Sertifikasi */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-2">Sertikasi</h3>
          <p className="text-text-secondary">{candidateData.certificationName}</p>
          <p className="text-sm text-text-secondary">{candidateData.certificationUpdateDate}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="px-6"
            voiceLabel="Batal"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleAccept}
            className="px-6"
            voiceLabel="Diterima"
          >
            Diterima
          </Button>
        </div>
      </div>
    </div>
  );
}
