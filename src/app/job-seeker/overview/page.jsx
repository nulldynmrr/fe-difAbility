"use client";

import React, { useState, useEffect } from "react";
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

// API base URL - update this with your backend URL
const API_URL = "http://localhost:8080/api";

export default function Overview() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobData, setJobData] = useState({
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
    description: `Loading job details...`,
    responsibilities: [
      "Loading...",
      "Loading...",
      "Loading...",
    ],
    reviews: [
      {
        rating: 4,
        date: "Loading...",
        text: "Loading review...",
      }
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job data from API
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        // Get the job ID from the URL or use a default one
        const jobId = window.location.pathname.split('/').pop();
        const token = localStorage.getItem('token'); // Make sure to get the token from your auth context or localStorage

        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job data');
        }

        const data = await response.json();

        // Update state with API data
        setJobData({
          title: data.title || "No Title",
          company: data.companyName || "No Company",
          deadline: data.deadline ? new Date(data.deadline).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) : "No Deadline",
          postedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).toUpperCase() : "No Date",
          expireDate: data.deadline ? new Date(data.deadline).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).toUpperCase() : "No Expiry",
          education: data.educationLevel || "Not specified",
          salary: data.salary || "Negotiable",
          location: data.location || "Location not specified",
          jobType: data.jobType || "Full Time",
          experience: data.experience || "Not specified",
          disability: Array.isArray(data.supportedDisabilities) ?
            data.supportedDisabilities.join(', ') :
            (data.supportedDisabilities || "Not specified"),
          description: data.description || "No description available",
          responsibilities: Array.isArray(data.responsibilities) && data.responsibilities.length > 0 ?
            data.responsibilities :
            ["No responsibilities listed"],
          reviews: Array.isArray(data.reviews) && data.reviews.length > 0 ?
            data.reviews :
            [{
              rating: 0,
              date: "No reviews yet",
              text: "Be the first to review this job"
            }]
        });
      } catch (err) {
        console.error('Error fetching job data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  // Handle bookmark toggle
  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/jobs/${jobData.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error updating bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">Showing sample data instead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{jobData.title}</h1>
          <p className="text-gray-600">{jobData.company}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <Bookmark className="w-6 h-6" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <Button>Lamar Sekarang</Button>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Deskripsi Pekerjaan</h2>
          <p className="text-gray-700 whitespace-pre-line">{jobData.description}</p>

          <h2 className="text-lg font-semibold mt-6 mb-4">Tanggung Jawab Pekerjaan</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {jobData.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Ringkasan</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Ditutup pada</p>
                  <p>{jobData.deadline}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Briefcase className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Jenis Pekerjaan</p>
                  <p>{jobData.jobType}</p>
                </div>
              </div>
              <div className="flex items-start">
                <GraduationCap className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Pendidikan Minimal</p>
                  <p>{jobData.education}</p>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Gaji</p>
                  <p>{jobData.salary}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Lokasi</p>
                  <p>{jobData.location}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Accessibility className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Disabilitas yang Didukung</p>
                  <p>{jobData.disability}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ulasan Karyawan</h2>
        <div className="space-y-6">
          {jobData.reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}