"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import request from "@/utils/request";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import InputDropdown from "@/components/ui/dropdown";
import CheckboxDropdown from "@/components/ui/checkbox";
import Button from "@/components/ui/Button";
import HeaderCard from "@/components/card/HeaderCard";
import { z } from "zod";

/* ================= VALIDATION ================= */
const postJobSchema = z.object({
  title: z.string().min(3, "Minimal 3 karakter"),
  description: z.string().min(10, "Minimal 10 karakter"),
  salary: z.string().min(1, "Gaji wajib diisi"),
  minimumEducation: z.string().min(1, "Pilih pendidikan"),
  minimumYearsExperience: z.string().min(1, "Wajib diisi"),
  compatibleDisabilities: z.array(z.string()).min(1, "Pilih minimal 1"),
  registrationDeadline: z.string().min(1, "Deadline wajib"),
  publicationStatus: z.string().min(1, "Status publikasi wajib"),
});

/* ================= COMPONENT ================= */
export default function PostJob() {
  const router = useRouter();

  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    minimumEducation: "",
    minimumYearsExperience: "",
    compatibleDisabilities: [],
    registrationDeadline: "",
    publicationStatus: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ===== ENUM OPTIONS ===== */
  const [educationOptions, setEducationOptions] = useState([]);
  const [disabilityOptions, setDisabilityOptions] = useState([]);
  const [publicationOptions, setPublicationOptions] = useState([]);

  /* ================= FETCH ENUM ================= */
  useEffect(() => {
    request
      .get("/enums/education-levels")
      .then((res) =>
        setEducationOptions(res.data.map((v) => ({ label: v, value: v })))
      );

    request
      .get("/enums/disability-types")
      .then((res) =>
        setDisabilityOptions(res.data.map((v) => ({ label: v, value: v })))
      );

    request
      .get("/enums/publication-statuses")
      .then((res) =>
        setPublicationOptions(res.data.map((v) => ({ label: v, value: v })))
      );
  }, []);

  /* ================= HANDLER ================= */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatRupiah = (v) =>
    v ? "Rp" + Number(v).toLocaleString("id-ID") : "";

  const handleSalaryInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    handleChange("salary", raw);
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setErrors({});
    toast.dismiss();

    const validation = postJobSchema.safeParse(form);
    if (!validation.success) {
      const errMap = {};
      validation.error.issues.forEach((i) => {
        errMap[i.path[0]] = i.message;
      });
      setErrors(errMap);
      toast.error("Lengkapi semua field");
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      salary: Number(form.salary),
      minimumEducation: form.minimumEducation,
      minimumYearsExperience: Number(form.minimumYearsExperience),
      compatibleDisabilities: form.compatibleDisabilities,
      registrationDeadline: `${form.registrationDeadline}T23:59:59`,
      publicationStatus: form.publicationStatus, // ✅ DARI API ENUM
    };

    console.log("POST /api/jobs payload:", payload);

    try {
      await request.post("/jobs", payload);
      toast.success("Lowongan berhasil diposting");
      router.push("/company/job-posting");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memposting lowongan");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-6 mt-10">
      <HeaderCard
        title="Posting Lowongan Kerja"
        subtitle="Mendukung kesempatan kerja untuk disabilitas"
      />

      <div className="mt-8 bg-card p-6 rounded border">
        <Input
          label="Nama Posisi Kerja"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        <Input
          label="Target Gaji"
          value={formatRupiah(form.salary)}
          onChange={handleSalaryInput}
          error={errors.salary}
          required
          className="mt-4"
        />

        <Textarea
          label="Deskripsi Pekerjaan"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          rows={4}
          className="mt-4"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputDropdown
            label="Minimum Pendidikan"
            options={educationOptions}
            value={form.minimumEducation}
            onChange={(v) => handleChange("minimumEducation", v)}
            error={errors.minimumEducation}
          />

          <Input
            type="number"
            label="Pengalaman (Tahun)"
            value={form.minimumYearsExperience}
            onChange={(e) =>
              handleChange("minimumYearsExperience", e.target.value.slice(0, 2))
            }
            error={errors.minimumYearsExperience}
          />

          <CheckboxDropdown
            label="Disabilitas"
            options={disabilityOptions}
            value={form.compatibleDisabilities}
            onChange={(v) => handleChange("compatibleDisabilities", v)}
            error={errors.compatibleDisabilities}
          />

          <Input
            type="date"
            label="Batas Pendaftaran"
            value={form.registrationDeadline}
            onChange={(e) =>
              handleChange("registrationDeadline", e.target.value)
            }
            error={errors.registrationDeadline}
          />

          <InputDropdown
            label="Status Publikasi"
            options={publicationOptions}
            value={form.publicationStatus}
            onChange={(v) => handleChange("publicationStatus", v)}
            error={errors.publicationStatus}
          />
        </div>

        <Button className="mt-6 w-full" onClick={onSubmit} disabled={loading}>
          {loading ? "Memposting..." : "Posting Lowongan"}
        </Button>
      </div>
    </div>
  );
}
