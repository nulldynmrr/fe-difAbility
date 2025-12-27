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
import { z } from "zod";

function getFileUrl(relativePath) {
  if (!relativePath) return null;
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.substring(1)
    : relativePath;
  return `${process.env.NEXT_PUBLIC_HOST}/api/files/view?path=${cleanPath}`;
}

async function loadIndustries() {
  try {
    const res = await request.get("/enums/industry-types");
    console.log("Industry types loaded:", res.data);
    return res.data || [];
  } catch (error) {
    console.error("Failed to load industries:", error);
    return [];
  }
}

const companySchema = z.object({
  companyName: z
    .string()
    .min(1, "Nama perusahaan wajib diisi")
    .min(3, "Nama perusahaan minimal 3 karakter")
    .max(100, "Nama perusahaan maksimal 100 karakter"),

  companyDescription: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),

  address: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .max(200, "Alamat maksimal 200 karakter"),

  industryType: z.string().min(1, "Pilih industry type"),

  websiteUrl: z
    .string()
    .url("URL website tidak valid")
    .or(z.literal(""))
    .optional(),
  linkedinUrl: z
    .string()
    .url("URL LinkedIn tidak valid")
    .or(z.literal(""))
    .optional(),
  youtubeUrl: z
    .string()
    .url("URL YouTube tidak valid")
    .or(z.literal(""))
    .optional(),
  instagramUrl: z
    .string()
    .url("URL Instagram tidak valid")
    .or(z.literal(""))
    .optional(),
  twitterUrl: z
    .string()
    .url("URL Twitter tidak valid")
    .or(z.literal(""))
    .optional(),

  logoImagePath: z.string().optional(),
  agreeToTerms: z.boolean(),
});

export default function RegisterCompany() {
  const [industryTypes, setIndustryTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [logoFile, setLogoFile] = useState(null);

  const [form, setForm] = useState({
    companyName: "",
    companyDescription: "",
    address: "",
    industryType: "",
    websiteUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    logoImagePath: "",
    agreeToTerms: false,
  });

  const options = useAccessibilityOptions();

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman onboarding perusahaan. Silakan lengkapi profil perusahaan."
      : null,
    "#companyName",
    options.voiceAssistant
  );

  useEffect(() => {
    loadIndustries().then((data) => setIndustryTypes(data));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await request.get("/companies/me/profile");

        if (res?.data) {
          const d = res.data;
          const formData = {
            companyName: d.companyName || "",
            companyDescription: d.companyDescription || "",
            address: d.address || "",
            industryType: d.industryType || "",
            websiteUrl: d.websiteUrl || "",
            linkedinUrl: d.linkedinUrl || "",
            youtubeUrl: d.youtubeUrl || "",
            instagramUrl: d.instagramUrl || "",
            twitterUrl: d.twitterUrl || "",
            logoImagePath: d.logoImagePath || "",
            agreeToTerms: true,
          };

          setForm(formData);
          setIsEditMode(true);
        }
      } catch (error) {
        console.log(
          "Error details:",
          error.response?.status,
          error.response?.data
        );
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const err = {};

    try {
      companySchema.parse({
        companyName: form.companyName,
        companyDescription: form.companyDescription,
        address: form.address,
        industryType: form.industryType,
        websiteUrl: form.websiteUrl,
        linkedinUrl: form.linkedinUrl,
        youtubeUrl: form.youtubeUrl,
        instagramUrl: form.instagramUrl,
        twitterUrl: form.twitterUrl,
        logoImagePath: form.logoImagePath,
        agreeToTerms: form.agreeToTerms,
      });
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        zodError.errors.forEach((error) => {
          const field = error.path[0];
          err[field] = error.message;
        });
      }
    }

    if (!isEditMode && !logoFile && !form.logoImagePath)
      err.logoFile = "Logo perusahaan wajib diupload";

    if (!isEditMode && !form.agreeToTerms)
      err.agreeToTerms = "Anda harus menyetujui persyaratan";

    console.log("Validation errors:", err);
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

    let logoPath = form.logoImagePath;

    if (logoFile) {
      try {
        const fd = new FormData();
        fd.append("file", logoFile);

        const uploadRes = await request.post("/files/upload/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        logoPath = uploadRes.data;
      } catch (err) {
        console.error("Logo upload failed:", err.response?.data || err.message);
        toast.error("Upload logo gagal");
        setLoading(false);
        return;
      }
    } else {
      console.log("No new logo file, using existing:", logoPath);
    }

    const payload = {
      companyName: form.companyName,
      companyDescription: form.companyDescription,
      address: form.address,
      industryType: form.industryType,
      websiteUrl: form.websiteUrl || null,
      linkedinUrl: form.linkedinUrl || null,
      youtubeUrl: form.youtubeUrl || null,
      instagramUrl: form.instagramUrl || null,
      twitterUrl: form.twitterUrl || null,
      logoImagePath: logoPath,
      agreeToTerms: form.agreeToTerms,
    };

    try {
      const method = isEditMode ? "patch" : "post";
      const response = await request[method]("/companies/me/profile", payload, {
        withCredentials: true,
      });

      toast.success(
        isEditMode
          ? "Profil perusahaan berhasil diperbarui"
          : "Profil perusahaan berhasil dibuat"
      );

      window.location.href = "/company/dashboard";
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Error Data:", error.response?.data);
      console.error("Full Error:", error);

      toast.error(error.response?.data?.message || "Gagal menyimpan profil");
    }

    setLoading(false);
  };

  if (loadingProfile) {
    console.log("Loading profile...");
    return null;
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
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-primary-200 rounded-full w-max mx-auto bg-card mb-4">
            <Accessibility className="text-primary-200 w-4 h-4" />
            <span className="text-primary-200 text-sm font-medium">
              disability-friendly
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            <span className="text-primary-200">
              {isEditMode ? "Edit Profil" : "Lengkapi Profil"}
            </span>{" "}
            <span className="text-text-primary">Perusahaan Anda</span>
          </h2>
        </div>

        <div className="bg-bg-card rounded-lg p-8">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Informasi Perusahaan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input
                id="companyName"
                label="Nama Perusahaan"
                placeholder="Nama Perusahaan Anda"
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                error={errors.companyName}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {form.companyName.length}/100 karakter (minimal 3)
              </div>
            </div>

            <Input
              id="websiteUrl"
              type="url"
              label="Website (opsional)"
              placeholder="https://example.com"
              value={form.websiteUrl}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              error={errors.websiteUrl}
            />
          </div>

          <Textarea
            label="Deskripsi Perusahaan"
            placeholder="Tuliskan deskripsi perusahaan Anda (minimal 10 karakter)"
            value={form.companyDescription}
            onChange={(e) => handleChange("companyDescription", e.target.value)}
            error={errors.companyDescription}
            rows={4}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {form.companyDescription.length}/500 karakter (minimal 10)
          </div>

          <Textarea
            label="Alamat Perusahaan"
            placeholder="Alamat lengkap perusahaan (minimal 5 karakter)"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
            rows={3}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {form.address.length}/200 karakter (minimal 5)
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">
              Industry Type <span className="text-red-500">*</span>
            </label>
            <select
              className="border p-2 rounded w-full bg-gray-100 text-blue-700"
              value={form.industryType}
              onChange={(e) => handleChange("industryType", e.target.value)}
            >
              <option value="">Pilih Industry</option>
              {industryTypes.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            {errors.industryType && (
              <p className="text-red-500 text-sm mt-1">{errors.industryType}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Logo Perusahaan (PNG/JPG/JPEG){" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="block w-full text-sm border p-2 rounded bg-gray-100"
              onChange={(e) => {
                const file = e.target.files[0];
                console.log("📁 File selected:", file?.name);
                setLogoFile(file);
              }}
            />
          </div>

          <h3 className="text-xl font-bold mt-10 mb-4">
            Media Sosial{" "}
            <span className="text-sm font-normal text-text-secondary">
              (opsional)
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              id="linkedinUrl"
              label="LinkedIn"
              placeholder="https://linkedin.com/company/..."
              value={form.linkedinUrl}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              error={errors.linkedinUrl}
            />
            <Input
              id="youtubeUrl"
              label="YouTube"
              placeholder="https://youtube.com/@..."
              value={form.youtubeUrl}
              onChange={(e) => handleChange("youtubeUrl", e.target.value)}
              error={errors.youtubeUrl}
            />
            <Input
              id="instagramUrl"
              label="Instagram"
              placeholder="https://instagram.com/..."
              value={form.instagramUrl}
              onChange={(e) => handleChange("instagramUrl", e.target.value)}
              error={errors.instagramUrl}
            />
            <Input
              id="twitterUrl"
              label="Twitter"
              placeholder="https://twitter.com/..."
              value={form.twitterUrl}
              onChange={(e) => handleChange("twitterUrl", e.target.value)}
              error={errors.twitterUrl}
            />
          </div>

          {!isEditMode && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-text-primary mb-3">
                Pernyataan Kelayakan & Persetujuan Perusahaan
              </h3>

              <div className="text-sm text-text-primary space-y-3 mb-4 leading-relaxed">
                <p>
                  Kami menyatakan bahwa perusahaan kami berkomitmen untuk
                  menciptakan lingkungan kerja yang ramah disabilitas. Seluruh
                  informasi yang kami berikan pada formulir ini adalah benar,
                  lengkap, dan sesuai dengan kondisi aktual perusahaan kami.
                </p>

                <p>Kami siap untuk:</p>

                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    Menerima dan memberikan kesempatan kerja yang setara bagi
                    kandidat dengan berbagai jenis disabilitas.
                  </li>
                  <li>
                    Menyediakan fasilitas pendukung yang memungkinkan seluruh
                    karyawan, termasuk penyandang disabilitas, dapat bekerja
                    dengan aman dan nyaman.
                  </li>
                  <li>
                    Menerapkan kebijakan yang menghargai keberagaman serta
                    mendukung kesetaraan di tempat kerja.
                  </li>
                </ul>

                <p>
                  Dengan mengirimkan formulir ini, kami menyatakan kesiapan
                  perusahaan kami untuk menjadi bagian dari inisiatif perusahaan
                  disability-friendly dan berpartisipasi aktif dalam menciptakan
                  dunia kerja bagi semua.
                </p>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={(e) =>
                    handleChange("agreeToTerms", e.target.checked)
                  }
                  className="mt-1 w-4 h-4 text-primary-300 border-gray-300 rounded focus:ring-primary-200 cursor-pointer"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-text-primary cursor-pointer"
                >
                  Perusahaan Kami setuju atas Pernyataan Kelayakan & Persetujuan
                  Perusahaan terhadap disabilitas
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>
          )}

          <Button onClick={onSubmit} loading={loading} className="w-full mt-8">
            {loading
              ? "Loading..."
              : isEditMode
              ? "Simpan Perubahan"
              : "Daftar Perusahaan"}
          </Button>

          {!isEditMode && (
            <p className="text-text-secondary text-center mt-4 text-sm">
              Sudah punya Akun?{" "}
              <a className="text-primary-300 font-semibold" href="/login">
                Masuk
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
