"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/dropdown";
import Button from "@/components/ui/Button";
import UploadFile from "@/components/ui/uploadImage";
import request from "@/utils/request";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    about: "",
    address: "",
    disabilityType: "",
    skills: [""],
    educationLevel: "",
    academicYear: "",
    jobType: "",
    ppImgPath: "",
    cvFilePath: "",
    certifFilePaths: [],
  });

  const [enums, setEnums] = useState({
    disabilityTypes: [],
    educationLevels: [],
    jobTypes: [],
  });

  useEffect(() => {
    async function init() {
      try {
        const [disabilityRes, educationRes, jobTypeRes, profileRes] =
          await Promise.all([
            request.get("/enums/disability-types"),
            request.get("/enums/education-levels"),
            request.get("/enums/job-types"),
            request.get("/jobseekers/me/profile"),
          ]);

        setEnums({
          disabilityTypes: disabilityRes.data.map((v) => ({
            label: v,
            value: v,
          })),
          educationLevels: educationRes.data.map((v) => ({
            label: v,
            value: v,
          })),
          jobTypes: jobTypeRes.data.map((v) => ({ label: v, value: v })),
        });

        const profile = profileRes.data;

        setFormData({
          fullname: profile.fullname || "",
          about: profile.about || "",
          address: profile.address || "",
          disabilityType: profile.disabilityType || "",
          skills: profile.skills?.length ? profile.skills : [""],
          educationLevel: profile.educationLevel || "",
          academicYear: profile.academicYear || "",
          jobType: profile.jobType || "",
          ppImgPath: profile.ppImgPath || "",
          cvFilePath: profile.cvDocumentPath || "",
          certifFilePaths: profile.certificationFilePaths || [],
        });
      } catch (error) {
        console.error("Init error:", error);
        toast.error("Gagal memuat data");
      }
    }

    init();
  }, []);

  const MAX_FILE_SIZE = 5_000_000;

  const uploadFile = async (file, type) => {
    if (!file) return null;

    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return null;
    }

    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("File harus berupa PDF");
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File terlalu besar (maks 5MB)");
      return null;
    }

    try {
      const endpoint =
        type === "image" ? "/files/upload/image" : "/files/upload/document";
      const response = await request.uploadFile(endpoint, file);
      const filePath =
        response.data?.path || response.data?.filePath || response.data;
      toast.success("File berhasil diupload");
      return filePath;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload file gagal");
      return null;
    }
  };

  const handleFileUpload = async (file, field, type = "pdf") => {
    const path = await uploadFile(file, type);
    if (!path) return;

    if (field === "certifFilePaths") {
      setFormData((p) => ({
        ...p,
        certifFilePaths: [...p.certifFilePaths, path],
      }));
    } else {
      setFormData((p) => ({ ...p, [field]: path }));
    }
  };

  const addSkill = () =>
    setFormData((p) => ({ ...p, skills: [...p.skills, ""] }));
  const removeSkill = (index) =>
    setFormData((p) => ({
      ...p,
      skills: p.skills.filter((_, i) => i !== index),
    }));
  const updateSkill = (index, value) =>
    setFormData((p) => ({
      ...p,
      skills: p.skills.map((s, i) => (i === index ? value : s)),
    }));
  const removeCertificate = (index) =>
    setFormData((p) => ({
      ...p,
      certifFilePaths: p.certifFilePaths.filter((_, i) => i !== index),
    }));

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (!formData.ppImgPath) return toast.error("Foto profil wajib diupload");
      if (!formData.cvFilePath) return toast.error("CV wajib diupload");

      const payload = {
        fullname: formData.fullname,
        about: formData.about.trim(),
        address: formData.address,
        disabilityType: formData.disabilityType,
        skills: formData.skills.filter(Boolean),
        educationLevel: formData.educationLevel,
        academicYear: formData.academicYear,
        jobType: formData.jobType,
        ppImgPath: formData.ppImgPath,
        cvDocumentPath: formData.cvFilePath,
        certificationFilePaths: formData.certifFilePaths,
      };

      await request.patch("/jobseekers/me/profile", payload);
      toast.success("Profil berhasil diperbarui");
      router.push("/job-seeker/profile");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6 mt-12">
        <h1 className="text-xl font-semibold">Update Profil Job Seeker</h1>

        <UploadFile
          label="Foto Profil (Image) *"
          accept="image/*"
          onUpload={(file) => handleFileUpload(file, "ppImgPath", "image")}
          uploadedFiles={formData.ppImgPath ? [formData.ppImgPath] : []}
          buttonText="Pilih Foto"
          disabled={loading}
        />

        <Input
          label="Nama Lengkap"
          value={formData.fullname}
          onChange={(e) =>
            setFormData((p) => ({ ...p, fullname: e.target.value }))
          }
        />
        <Textarea
          label="Tentang Saya"
          value={formData.about}
          onChange={(e) =>
            setFormData((p) => ({ ...p, about: e.target.value }))
          }
        />
        <Textarea
          label="Alamat"
          value={formData.address}
          onChange={(e) =>
            setFormData((p) => ({ ...p, address: e.target.value }))
          }
        />
        <Select
          label="Disability Type"
          options={enums.disabilityTypes}
          value={formData.disabilityType}
          onChange={(v) => setFormData((p) => ({ ...p, disabilityType: v }))}
        />
        <Select
          label="Education Level"
          options={enums.educationLevels}
          value={formData.educationLevel}
          onChange={(v) => setFormData((p) => ({ ...p, educationLevel: v }))}
        />
        <Input
          label="Academic Year"
          value={formData.academicYear}
          onChange={(e) =>
            setFormData((p) => ({ ...p, academicYear: e.target.value }))
          }
        />
        <Select
          label="Job Type"
          options={enums.jobTypes}
          value={formData.jobType}
          onChange={(v) => setFormData((p) => ({ ...p, jobType: v }))}
        />

        <div className="space-y-3">
          <label className="font-medium block">Skills</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Masukkan skill"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="flex-1"
              />
              {formData.skills.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeSkill(index)}
                  variant="danger"
                  className="px-4"
                >
                  Hapus
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={addSkill} variant="secondary">
            + Tambah Skill
          </Button>
        </div>

        <UploadFile
          label="CV (PDF) *"
          accept="application/pdf"
          onUpload={(file) => handleFileUpload(file, "cvFilePath", "pdf")}
          uploadedFiles={formData.cvFilePath ? [formData.cvFilePath] : []}
          buttonText="Pilih CV"
          disabled={loading}
        />

        <UploadFile
          label="Sertifikat (Optional, PDF)"
          accept="application/pdf"
          multiple
          onUpload={(files) =>
            files.forEach((file) =>
              handleFileUpload(file, "certifFilePaths", "pdf")
            )
          }
          uploadedFiles={formData.certifFilePaths}
          buttonText="Pilih Sertifikat"
          disabled={loading}
        />

        <Button type="button" onClick={onSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>
    </>
  );
}
