"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Accessibility } from "lucide-react";
import { useSpeechGuide } from "@/hooks/speech/useSpeechGuide";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

import request from "@/utils/request";
import { toast } from "sonner";

async function loadEnums() {
  try {
    const [disabilities, education, jobTypes] = await Promise.all([
      request.get("/enums/disability-types"),
      request.get("/enums/education-levels"),
      request.get("/enums/job-types"),
    ]);

    return {
      disabilityTypes: disabilities.data || [],
      educationLevels: education.data || [],
      jobTypes: jobTypes.data || [],
    };
  } catch {
    return {
      disabilityTypes: [],
      educationLevels: [],
      jobTypes: [],
    };
  }
}

export default function OnboardingJobSeeker() {
  const [disabilityTypes, setDisabilityTypes] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [ppFile, setPpFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    about: "",
    address: "",
    disabilityType: "",
    skills: "",
    educationLevel: "",
    academicYear: "",
    jobType: "",
  });

  const options = useAccessibilityOptions();

  useSpeechGuide(
    options.voiceAssistant
      ? "Selamat datang di halaman onboarding jobseeker. Lengkapi profil Anda."
      : null,
    "#fullName",
    options.voiceAssistant
  );

  useEffect(() => {
    loadEnums().then((data) => {
      setDisabilityTypes(data.disabilityTypes);
      setEducationLevels(data.educationLevels);
      setJobTypes(data.jobTypes);
    });
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const err = {};

    if (!form.fullName) err.fullName = "Nama wajib diisi";
    if (!form.about) err.about = "Tentang diri wajib diisi";
    if (!form.address) err.address = "Alamat wajib diisi";
    if (!form.disabilityType) err.disabilityType = "Pilih disabilitas";
    if (!form.skills) err.skills = "Isi minimal satu skill";
    if (!form.educationLevel) err.educationLevel = "Pilih pendidikan";
    if (!form.academicYear) err.academicYear = "Isi tahun akademik";
    if (!form.jobType) err.jobType = "Pilih job type";

    if (!ppFile) err.ppFile = "Foto profil wajib diupload";
    if (!cvFile) err.cvFile = "CV wajib diupload";

    return err;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      toast.error("Periksa kembali input Anda");
      return;
    }

    setLoading(true);

    let ppPath = null;
    let cvPath = null;
    let certPaths = [];

    try {
      const fd1 = new FormData();
      fd1.append("file", ppFile);

      const ppRes = await request.post("/files/upload/image", fd1, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      ppPath = ppRes.data;

      const fd2 = new FormData();
      fd2.append("file", cvFile);

      const cvRes = await request.post("/files/upload/document", fd2, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      cvPath = cvRes.data;

      for (const f of certFiles) {
        const fd = new FormData();
        fd.append("file", f);

        const res = await request.post("/files/upload/document", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        certPaths.push(res.data);
      }
    } catch (err) {
      toast.error("Upload dokumen gagal");
      setLoading(false);
      return;
    }

    try {
      await request.patch(
        "/jobseekers/me/profile",
        {
          fullName: form.fullName,
          about: form.about,
          address: form.address,
          disabilityType: form.disabilityType,
          skills: form.skills.split(",").map((s) => s.trim()),
          educationLevel: form.educationLevel,
          academicYear: form.academicYear,
          jobType: form.jobType,
          ppImagePath: ppPath,
          cvDocumentPath: cvPath,
          certificationFilePaths: certPaths,
        },
        { withCredentials: true }
      );

      toast.success("Profil berhasil disimpan");
      window.location.href = "/jobseeker/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan profil");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-60 blur-[120px]"
          style={{
            background:
              "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)",
            transform: "translate(30%, -30%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-primary-200 rounded-full w-max mx-auto bg-card mb-4">
            <Accessibility className="text-primary-200 w-4 h-4" />
            <span className="text-primary-200 text-sm font-medium">
              disability-friendly
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            <span className="text-primary-200">Lengkapi Profil</span>{" "}
            <span className="text-text-primary">Pencari Kerja</span>
          </h2>
        </div>

        <form onSubmit={onSubmit} className="bg-bg-card rounded-lg p-8">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Informasi Diri
          </h3>

          <Input
            id="fullName"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={errors.fullName}
          />

          <Textarea
            label="Tentang Diri"
            placeholder="Ceritakan tentang diri Anda"
            value={form.about}
            onChange={(e) => handleChange("about", e.target.value)}
            error={errors.about}
            rows={4}
          />

          <Textarea
            label="Alamat"
            placeholder="Alamat lengkap tempat tinggal"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
            rows={3}
          />

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Disabilitas
            </label>
            <select
              className="border p-2 rounded w-full bg-gray-100"
              value={form.disabilityType}
              onChange={(e) => handleChange("disabilityType", e.target.value)}
            >
              <option value="">Pilih Disabilitas</option>
              {disabilityTypes.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.disabilityType && (
              <p className="text-red-500 text-sm">{errors.disabilityType}</p>
            )}
          </div>

          <Input
            label="Skills"
            placeholder="Pisahkan dengan koma. Contoh: HTML, Communication"
            value={form.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            error={errors.skills}
            className="mt-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Pendidikan
              </label>
              <select
                className="border p-2 rounded w-full bg-gray-100"
                value={form.educationLevel}
                onChange={(e) => handleChange("educationLevel", e.target.value)}
              >
                <option value="">Pilih Pendidikan</option>
                {educationLevels.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              {errors.educationLevel && (
                <p className="text-red-500 text-sm">{errors.educationLevel}</p>
              )}
            </div>

            <Input
              label="Tahun Akademik"
              placeholder="Contoh: 2020"
              value={form.academicYear}
              onChange={(e) => handleChange("academicYear", e.target.value)}
              error={errors.academicYear}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Jenis Pekerjaan
            </label>
            <select
              className="border p-2 rounded w-full bg-gray-100"
              value={form.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
            >
              <option value="">Pilih Job Type</option>
              {jobTypes.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
            {errors.jobType && (
              <p className="text-red-500 text-sm">{errors.jobType}</p>
            )}
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold mb-1">
              Foto Profil
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="block w-full text-sm border p-2 rounded bg-gray-100"
              onChange={(e) => setPpFile(e.target.files[0])}
            />
            {errors.ppFile && (
              <p className="text-red-500 text-sm">{errors.ppFile}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Upload CV (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              className="block w-full text-sm border p-2 rounded bg-gray-100"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
            {errors.cvFile && (
              <p className="text-red-500 text-sm">{errors.cvFile}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Sertifikat (opsional)
            </label>
            <input
              type="file"
              multiple
              accept="application/pdf,image/*"
              className="block w-full text-sm border p-2 rounded bg-gray-100"
              onChange={(e) => setCertFiles(Array.from(e.target.files))}
            />
          </div>

          <Button type="submit" loading={loading} className="w-full mt-8">
            Simpan Profil
          </Button>
        </form>
      </div>
    </div>
  );
}
