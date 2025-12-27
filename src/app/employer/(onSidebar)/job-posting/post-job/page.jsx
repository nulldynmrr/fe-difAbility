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
import { formatMoney } from "@/lib/money";

export default function PostJob() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    minimumEducation: "",
    minimumYearsExperience: "",
    compatibleDisabilities: [],
    registrationDeadline: "",
    jobType: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [educationOptions, setEducationOptions] = useState([]);
  const [disabilityOptions, setDisabilityOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);

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
      .get("/enums/job-types")
      .then((res) =>
        setJobTypeOptions(res.data.map((v) => ({ label: v, value: v })))
      );
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSalaryInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    handleChange("salary", raw);
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setErrors({});
    toast.dismiss();

    const payload = {
      title: form.title,
      jobDescription: form.description,
      salary: Number(form.salary),
      minimumEducation: form.minimumEducation,
      minimumYearsExperience: Number(form.minimumYearsExperience),
      compatibleDisabilities: form.compatibleDisabilities,
      registrationDeadline: `${form.registrationDeadline}T23:59:59`,
      jobType: form.jobType,
    };

    try {
      await request.post("/jobs", payload);
      toast.success("Lowongan berhasil diposting");
      router.push("/employer/job-posting");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memposting lowongan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 mt-10">
      <HeaderCard
        title="Posting Lowongan Kerja"
        subtitle="Mendukung kesempatan kerja untuk disabilitas"
      />

      <div className="mt-8 bg-card p-6 rounded border space-y-4">
        <Input
          label="Nama Posisi Kerja"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        <Input
          label="Target Gaji"
          value={formatMoney(form.salary)}
          onChange={handleSalaryInput}
          error={errors.salary}
          required
        />

        <Textarea
          label="Deskripsi Pekerjaan"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          rows={4}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputDropdown
            label="Minimum Pendidikan"
            options={educationOptions}
            value={form.minimumEducation}
            onChange={(v) => handleChange("minimumEducation", v)}
            error={errors.minimumEducation}
          />

          <Input
            type="number"
            label="Pengalaman Kerja (Tahun)"
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

          <InputDropdown
            label="Tipe Pekerjaan"
            options={jobTypeOptions}
            value={form.jobType}
            onChange={(v) => handleChange("jobType", v)}
            error={errors.jobType}
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
        </div>

        <Button className="w-full mt-4" onClick={onSubmit} disabled={loading}>
          {loading ? "Memposting..." : "Posting Lowongan"}
        </Button>
      </div>
    </div>
  );
}
