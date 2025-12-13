"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const API_URL = "http://localhost:8080/api";

export default function CandidateOverview() {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const token = localStorage.getItem('token');
        const candidateId = window.location.pathname.split('/').pop();

        const response = await fetch(`${API_URL}/candidates/${candidateId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidate data');
        }

        const data = await response.json();
        setCandidateData(data);
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError(err.message);
        // Fallback to sample data
        setCandidateData({
          name: "Profile",
          email: "m@example.com",
          description: `Loading candidate information...`,
          jobTypes: ["Loading..."],
          skills: ["Loading..."],
          education: "Loading...",
          experiences: [{
            position: "Loading...",
            company: "Loading...",
            dateRange: "Loading...",
            job1: "Loading...",
            job2: "Loading...",
          }],
          cvName: "CV - Loading...",
          cvUpdateDate: "update ...",
          certificationName: "Sertifikasi - Loading...",
          certificationUpdateDate: "update ...",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, []);

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem('token');
      const candidateId = window.location.pathname.split('/').pop();

      const response = await fetch(`${API_URL}/applications/${candidateId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject application');
      }

      // Handle successful rejection (e.g., show success message, redirect, etc.)
      console.log('Application rejected');
    } catch (err) {
      console.error('Error rejecting application:', err);
    }
  };

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem('token');
      const candidateId = window.location.pathname.split('/').pop();

      const response = await fetch(`${API_URL}/applications/${candidateId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept application');
      }

      // Handle successful acceptance (e.g., show success message, redirect, etc.)
      console.log('Application accepted');
    } catch (err) {
      console.error('Error accepting application:', err);
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
}