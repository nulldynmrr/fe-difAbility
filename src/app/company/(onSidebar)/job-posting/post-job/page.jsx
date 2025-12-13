"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import request from "@/utils/request";

export default function PostJob() {
  const router = useRouter();

  // ENUM
  const [educationLevels, setEducationLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [disabilityTypes, setDisabilityTypes] = useState([]);

  useEffect(() => {
    const loadEnums = async () => {
      try {
        const edu = await request.get("/enums/education-levels");
        const jt = await request.get("/enums/job-types");
        const dis = await request.get("/enums/disability-types");

        setEducationLevels(edu.data || []);
        setJobTypes(jt.data || []);
        setDisabilityTypes(dis.data || []);
      } catch {
        toast.error("Gagal memuat enum");
      }
    };

    loadEnums();
  }, []);

  const [form, setForm] = useState({
    title: "",
    jobDescription: "",
    salary: "",
    minimumEducation: "",
    minimumYearsExperience: "",
    jobType: "",
    compatibleDisabilities: [],
    registrationDeadline: "", // YYYY-MM-DD
  });

  const [errors, setErrors] = useState({});
  const disabilityRef = useRef(null);
  const [openDisability, setOpenDisability] = useState(false);

  // Tutup dropdown disabilitas
  useEffect(() => {
    const handler = (e) => {
      if (disabilityRef.current && !disabilityRef.current.contains(e.target)) {
        setOpenDisability(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Format Rupiah
  const formatRupiah = (num) => {
    if (!num) return "";
    return "Rp" + Number(num).toLocaleString("id-ID");
  };

  const handleSalaryInput = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 12) v = v.slice(0, 12);
    setForm({ ...form, salary: v });
  };

  const toggleDisability = (d) => {
    const exists = form.compatibleDisabilities.includes(d);
    setForm({
      ...form,
      compatibleDisabilities: exists
        ? form.compatibleDisabilities.filter((x) => x !== d)
        : [...form.compatibleDisabilities, d],
    });
  };

  // VALIDATION
  const validate = () => {
    const err = {};

    if (!form.title || form.title.length < 3 || form.title.length > 50)
      err.title = "Nama posisi harus 3-50 karakter.";

    if (!form.jobDescription || form.jobDescription.length < 10)
      err.jobDescription = "Deskripsi minimal 10 karakter.";

    if (form.jobDescription.length > 500)
      err.jobDescription = "Deskripsi maksimal 500 karakter.";

    if (!form.salary) err.salary = "Gaji wajib diisi.";

    if (!form.minimumEducation)
      err.minimumEducation = "Pendidikan wajib dipilih.";

    if (!form.minimumYearsExperience)
      err.minimumYearsExperience = "Pengalaman wajib diisi.";

    if (String(form.minimumYearsExperience).length > 2)
      err.minimumYearsExperience = "Maksimal 2 digit.";

    if (!form.jobType) err.jobType = "Pilih satu job type.";

    if (form.compatibleDisabilities.length === 0)
      err.compatibleDisabilities = "Pilih minimal satu disabilitas.";

    if (!form.registrationDeadline)
      err.registrationDeadline = "Deadline wajib diisi.";
    else {
      const inputDate = new Date(form.registrationDeadline + "T23:59:00");
      const now = new Date();
      if (inputDate <= now)
        err.registrationDeadline = "Deadline harus lebih besar dari sekarang.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ==============================
  //   SET DEADLINE → ALWAYS 23:59
  // ==============================
  const convertDateTo2359 = (dateOnly) => {
    const d = new Date(dateOnly + "T23:59:00");
    return d.toISOString();
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const finalDeadline = convertDateTo2359(form.registrationDeadline);

    try {
      await request.post(
        "/jobs",
        {
          title: form.title,
          jobDescription: form.jobDescription,
          salary: Number(form.salary),
          minimumEducation: form.minimumEducation,
          minimumYearsExperience: Number(form.minimumYearsExperience),
          jobType: form.jobType,
          compatibleDisabilities: form.compatibleDisabilities,
          registrationDeadline: finalDeadline,
        },
        { withCredentials: true }
      );

      toast.success("Lowongan berhasil diposting");
      router.push("/company/job-posting");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memposting lowongan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full rounded h-48 bg-blue-700 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Buat Postingan Pekerjaan Baru</h1>
          <p className="text-gray-200 text-lg mt-1">
            Pastikan informasi pekerjaan lengkap
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 className="font-semibold text-lg mb-6">Daftar Lowongan Kerja</h2>

        <div className="mb-4">
          <label className="text-sm font-semibold">Nama Posisi Kerja</label>
          <input
            maxLength={50}
            className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && (
            <p className="text-red-600 text-xs">{errors.title}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="text-sm font-semibold">Deskripsi Pekerjaan</label>
          <textarea
            rows="5"
            maxLength={500}
            className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
            value={form.jobDescription}
            onChange={(e) =>
              setForm({ ...form, jobDescription: e.target.value })
            }
          />
          <p className="text-xs text-gray-500">
            {form.jobDescription.length}/500 karakter
          </p>
          {errors.jobDescription && (
            <p className="text-red-600 text-xs">{errors.jobDescription}</p>
          )}
        </div>

        <h2 className="font-semibold text-lg mb-4">Overview Job</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold">Minimum Pendidikan</label>
            <select
              className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
              value={form.minimumEducation}
              onChange={(e) =>
                setForm({ ...form, minimumEducation: e.target.value })
              }
            >
              <option value="">Pilih Pendidikan</option>
              {educationLevels.map((ed) => (
                <option key={ed}>{ed}</option>
              ))}
            </select>
            {errors.minimumEducation && (
              <p className="text-red-600 text-xs">{errors.minimumEducation}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Target Gaji</label>
            <input
              type="text"
              className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
              value={formatRupiah(form.salary)}
              onChange={handleSalaryInput}
            />
            {errors.salary && (
              <p className="text-red-600 text-xs">{errors.salary}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold">
              Minimum Tahun Pengalaman
            </label>
            <input
              type="number"
              max={99}
              className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
              value={form.minimumYearsExperience}
              onChange={(e) =>
                setForm({
                  ...form,
                  minimumYearsExperience: e.target.value.slice(0, 2),
                })
              }
            />
            {errors.minimumYearsExperience && (
              <p className="text-red-600 text-xs">
                {errors.minimumYearsExperience}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Job Type</label>
            <select
              className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            >
              <option value="">Pilih Job Type</option>
              {jobTypes.map((jt) => (
                <option key={jt}>{jt}</option>
              ))}
            </select>
            {errors.jobType && (
              <p className="text-red-600 text-xs">{errors.jobType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative" ref={disabilityRef}>
            <label className="text-sm font-semibold">Disabilitas</label>

            <div
              className="mt-1 w-full p-2 bg-gray-100 rounded text-sm cursor-pointer"
              onClick={() => setOpenDisability(!openDisability)}
            >
              {form.compatibleDisabilities.length > 0
                ? form.compatibleDisabilities.join(", ")
                : "Pilih Disabilitas"}
            </div>

            {openDisability && (
              <div className="bg-white border border-gray-200 rounded shadow-sm mt-1 p-2 absolute z-20 w-full">
                {disabilityTypes.map((d) => (
                  <label key={d} className="flex items-center gap-2 p-1">
                    <input
                      type="checkbox"
                      checked={form.compatibleDisabilities.includes(d)}
                      onChange={() => toggleDisability(d)}
                    />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            )}

            {errors.compatibleDisabilities && (
              <p className="text-red-600 text-xs">
                {errors.compatibleDisabilities}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Batas Pendaftaran</label>
            <input
              type="date"
              className="mt-1 w-full p-2 bg-gray-100 rounded text-sm"
              value={form.registrationDeadline}
              onChange={(e) =>
                setForm({
                  ...form,
                  registrationDeadline: e.target.value,
                })
              }
            />
            {errors.registrationDeadline && (
              <p className="text-red-600 text-xs">
                {errors.registrationDeadline}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-800 transition"
            onClick={handleSubmit}
          >
            Posting Kerja
          </button>
        </div>
      </div>
    </div>
  );
}
