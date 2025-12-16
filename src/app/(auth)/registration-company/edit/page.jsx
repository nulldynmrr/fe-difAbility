"use client";

import React, { useEffect, useState, useCallback } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Accessibility } from "lucide-react";
import { useSpeechGuide } from "@/hooks/speech/useSpeechGuide";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";
import { z } from "zod";
import request from "@/utils/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const regisSchema = z.object({
  companyName: z.string().min(1, "Nama wajib diisi"),
  companyDescription: z.string().min(1, "Deskripsi wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  industryType: z.string().min(1, "Industri wajib diisi"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  logoImgPath: z.string().optional(),
});

const EditRegistrasiCompany = () => {
  const router = useRouter();
  const options = useAccessibilityOptions();

  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    address: "",
    industryType: "",
    websiteUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    logoImgPath: "",
  });

  const [industryOptions, setIndustryOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const INDUSTRY_LABEL = {
    HEALTHCARE: "Kesehatan",
    EDUCATION: "Pendidikan",
    TECHNOLOGY: "Teknologi",
    FINANCE: "Keuangan",
    MANUFACTURING: "Manufaktur",
    RETAIL: "Retail",
    HOSPITALITY: "Perhotelan",
  };

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman profil perusahaan. Silakan perbarui data perusahaan Anda."
      : null,
    "#companyName",
    options.voiceAssistant
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange("logoImgPath", file.name);
    }
  };

  useEffect(() => {
    request
      .get("/enums/industry-types")
      .then((res) => setIndustryOptions(res.data || []))
      .catch(() => toast.error("Gagal memuat daftar industri"));
  }, []);

  const fetchProfile = useCallback(async () => {
    setFetching(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Sesi berakhir");
        router.push("/login");
        return;
      }

      const response = await request.get("/companies/me/profile");

      setFormData({
        companyName: response.data?.companyName ?? response.data?.name ?? "",
        companyDescription:
          response.data?.companyDescription ?? response.data?.description ?? "",
        address: response.data?.address ?? "",
        industryType: response.data?.industryType ?? "",
        websiteUrl: response.data?.websiteUrl ?? "",
        linkedinUrl: response.data?.linkedinUrl ?? "",
        youtubeUrl: response.data?.youtubeUrl ?? "",
        instagramUrl: response.data?.instagramUrl ?? "",
        twitterUrl: response.data?.twitterUrl ?? "",
        logoImgPath:
          response.data?.logoImgPath ?? response.data?.logoImagePath ?? "",
      });
    } catch (err) {
      if (err.response) {
        toast.dismiss();
      } else {
        toast.error("Gagal memuat data perusahaan");
      }
    } finally {
      setFetching(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrors({});

    const valid = regisSchema.safeParse(formData);
    if (!valid.success) {
      const errMap = {};
      valid.error.issues.forEach((e) => {
        errMap[e.path[0]] = e.message;
      });
      setErrors(errMap);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        address: formData.address,
        industryType: formData.industryType,
        websiteUrl: formData.websiteUrl,
        linkedinUrl: formData.linkedinUrl,
        youtubeUrl: formData.youtubeUrl,
        instagramUrl: formData.instagramUrl,
        twitterUrl: formData.twitterUrl,
        logoImagePath: formData.logoImgPath,
      };

      await request.patch("/companies/me/profile", payload);

      toast.success("Profil perusahaan berhasil diperbarui");
      router.push("/company/dashboard");
    } catch {
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat data perusahaan...</p>
      </div>
    );
  }

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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Accessibility className="text-primary-200" />
          </div>
          <h2 className="text-3xl font-bold">
            Kelola Profil <span className="text-primary-200">Perusahaan</span>
          </h2>
        </div>

        <form onSubmit={onSubmit} className="bg-bg-card p-8 rounded-lg">
          <Input
            id="companyName"
            label="Nama Perusahaan"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            error={errors.companyName}
            required
          />

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Bidang Industri
            </label>

            <select
              value={formData.industryType}
              onChange={(e) => handleChange("industryType", e.target.value)}
              className="w-full border rounded px-3 py-2 bg-bg-card"
              required
            >
              <option value="">Pilih bidang industri</option>

              {industryOptions.map((value) => (
                <option key={value} value={value}>
                  {INDUSTRY_LABEL[value] || value}
                </option>
              ))}
            </select>

            {errors.industryType && (
              <p className="text-sm text-red-500 mt-1">{errors.industryType}</p>
            )}
          </div>

          <Textarea
            label="Deskripsi"
            value={formData.companyDescription}
            onChange={(e) => handleChange("companyDescription", e.target.value)}
            error={errors.companyDescription}
            rows={4}
            className="mt-4"
            required
          />

          <Textarea
            label="Alamat"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
            rows={3}
            className="mt-4"
            required
          />

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Logo Perusahaan (opsional)
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <Button type="submit" className="w-full mt-6" loading={loading}>
            Simpan Perubahan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditRegistrasiCompany;
