"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import request from "@/utils/request";
import HeaderCard from "@/components/card/HeaderCard";
import OpenJobs from "@/components/card/OpenJobSection";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [salaryFilters, setSalaryFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await request.get("/jobs");
      const data = response.data || [];
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    let tempJobs = [...jobs];

    if (salaryFilters.length > 0) {
      tempJobs = tempJobs.filter((job) => {
        return salaryFilters.some((range) => {
          const [minStr, maxStr] = range
            .replace(/Rp|Juta/g, "")
            .split("–")
            .map((s) => s.trim());
          const min = parseInt(minStr.replace(/\./g, "")) * 1_000_000;
          const max = parseInt(maxStr.replace(/\./g, "")) * 1_000_000;
          return job.salary >= min && job.salary <= max;
        });
      });
    }

    if (typeFilters.length > 0) {
      tempJobs = tempJobs.filter((job) => typeFilters.includes(job.type));
    }

    setFilteredJobs(tempJobs);
  }, [salaryFilters, typeFilters, jobs]);

  const handleSalaryChange = (range) => {
    setSalaryFilters((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleTypeChange = (type) => {
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg mt-16 py-6 px-2 md:px-52">
        <HeaderCard
          title="Siap memberi banyak lowongan pekerjaan"
          subtitle="Meningkatkan kepercayaan kepada disabilitas"
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 md:mt-8">
          {jobs.length !== 0 && (
            <aside className="col-span-1 lg:col-span-3 bg-bg border border-border/40 rounded-xl p-5 h-fit lg:sticky lg:top-6">
              <h4 className="font-semibold text-lg mb-4 text-text-secondary">
                Filter
              </h4>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Gaji Minimum
                  </label>
                  <div className="space-y-2">
                    {[
                      "Rp 0 – 1 Juta",
                      "Rp 1 – 3 Juta",
                      "Rp 4 – 10 Juta",
                      "Rp 10 – 100 Juta",
                    ].map((range, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={salaryFilters.includes(range)}
                          onChange={() => handleSalaryChange(range)}
                        />
                        <span>{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                    Tipe Pekerjaan
                  </label>
                  <div className="space-y-2">
                    {["Remote", "On-site", "Hybrid"].map((type, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={typeFilters.includes(type)}
                          onChange={() => handleTypeChange(type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          <div
            className={`col-span-1 ${
              jobs.length !== 0 ? "lg:col-span-9" : "lg:col-span-12"
            } bg-bg border border-border/40 rounded-xl p-5 h-fit`}
          >
            <OpenJobs jobs={filteredJobs} />
          </div>
        </section>
      </div>
    </>
  );
}
