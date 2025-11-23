"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SeeApplicants() {
  const [currentPage, setCurrentPage] = useState(2);

  const candidates = [
    {
      id: 1,
      name: "Hanif Almansyah",
      skills: ["Figma", "Figma", "Figma"],
      certificates: 4,
      experience: "12 Tahun Berpengalaman",
      disability: "Tunarungu",
    },
    {
      id: 2,
      name: "Michele",
      skills: ["Figma", "Figma", "Figma"],
      certificates: 4,
      experience: "12 Tahun Berpengalaman",
      disability: "Tunarungu",
    },
    {
      id: 3,
      name: "Hanif Almansyah",
      skills: ["Figma", "Figma", "Figma"],
      certificates: 4,
      experience: "12 Tahun Berpengalaman",
      disability: "Tunarungu",
    },
    {
      id: 4,
      name: "Michele",
      skills: ["Figma", "Figma", "Figma"],
      certificates: 4,
      experience: "12 Tahun Berpengalaman",
      disability: "Tunarungu",
    },
  ];

  const skillColors = [
    "bg-pink-200 text-pink-800",
    "bg-purple-200 text-purple-800",
    "bg-yellow-200 text-yellow-800",
  ];

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
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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

      {/* Job Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Job Card */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-300">UI</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">
              UI Designer
            </h3>
          </div>
        </div>

        {/* Candidates Accepted Card */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-4xl font-bold text-text-primary mb-2">18</div>
          <div className="text-text-secondary">Kandindat diterima</div>
        </div>

        {/* Remaining Workers Card */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-4xl font-bold text-text-primary mb-2">12</div>
          <div className="text-text-secondary">Sisa pekerja</div>
        </div>
      </div>

      {/* Candidate List Section */}
      <div className="bg-card rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-text-primary">
            Kandidat Pekerja / UI Designer
          </h3>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            voiceLabel="Buka data kandidat diterima"
          >
            Buka data kandidat diterima
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Nama Kandidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  All
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
              {candidates.map((candidate, index) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">
                      {candidate.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            skillColors[skillIndex % skillColors.length]
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary space-y-1">
                      <div>{candidate.certificates} Sertikat</div>
                      <div>{candidate.experience}</div>
                      <div>{candidate.disability}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="primary"
                      className="text-sm"
                      voiceLabel={`Lihat Kandidat ${candidate.name}`}
                    >
                      Lihat Kandidat
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary-300 text-white"
                  : "border border-gray-300 text-text-secondary hover:bg-gray-50"
              }`}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
            disabled={currentPage === 5}
            className="px-4 py-2 rounded-lg border border-gray-300 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
