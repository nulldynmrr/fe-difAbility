"use client";

import React, { useState } from "react";
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
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  industryType: z.string().min(1, "Industri wajib diisi"),
  websiteUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  youtubeUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  instagramUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  twitterUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  logoImgPath: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat & ketentuan",
  }),
});

const RegisterCompany = () => {
  const router = useRouter();
  const options = useAccessibilityOptions();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    industryType: "",
    websiteUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    logoImgPath: "",
    agreeToTerms: false,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman pendaftaran perusahaan. Silakan masukkan nama perusahaan dan informasi lainnya."
      : null,
    "#name",
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
      setLogoFile(file);
      handleChange("logoImgPath", file.name);
    }
  };

  const onsubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    setErrors({});
    toast.dismiss();

    if (!formData.agreeToTerms) {
      setErrors({ agreeToTerms: "Anda harus menyetujui syarat & ketentuan" });

      toast.error("Anda harus menyetujui Pernyataan Kelayakan & Persetujuan");

      if (options.voiceAssistant) {
        const u = new SpeechSynthesisUtterance(
          "Silakan setujui pernyataan kelayakan dan persetujuan terlebih dahulu."
        );
        u.lang = "id-ID";
        window.speechSynthesis.speak(u);
      }

      setLoading(false);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali");
      setLoading(false);
      router.push("/login");
      return;
    }

    if (options.voiceAssistant) {
      const u = new SpeechSynthesisUtterance(
        "Sedang memproses pendaftaran perusahaan. Mohon tunggu."
      );
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }

    const validasi = regisSchema.safeParse(formData);

    if (!validasi.success) {
      const newErr = {};
      validasi.error.issues.forEach((err) => {
        newErr[err.path[0]] = err.message;
      });
      setErrors(newErr);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        industryType: formData.industryType,
        agreeToTerms: formData.agreeToTerms,
      };

      const response = await request.post("/companies/me/profile", payload);

      if (
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data?.code === 200
      ) {
        toast.success("Profil perusahaan berhasil diperbarui!");

        if (options.voiceAssistant) {
          const u = new SpeechSynthesisUtterance(
            "Pendaftaran perusahaan berhasil!"
          );
          u.lang = "id-ID";
          window.speechSynthesis.speak(u);
        }

        router.push("/company/dashboard");
        return;
      }

      toast.error("Terjadi kesalahan, silakan coba lagi.");
    } catch (err) {
      const errorData = err.response?.data;
      const status = err.response?.status;

      console.error("REGISTER COMPANY ERROR:", errorData);

      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        toast.error(
          "Tidak dapat terhubung ke server. Pastikan backend berjalan dan CORS sudah dikonfigurasi."
        );
      } else if (status === 401) {
        toast.error("Sesi Anda telah berakhir");
        setTimeout(() => router.push("/login"), 2000);
      } else if (status === 400) {
        const msg = errorData?.message || "Data yang dikirim tidak valid";
        toast.error(msg);
      } else if (status === 404) {
        toast.error(
          "Endpoint tidak ditemukan. Pastikan Anda sudah login sebagai Company"
        );
      } else if (status === 409) {
        toast.error("Data perusahaan sudah terdaftar");
      } else {
        const msg =
          errorData?.message ||
          "Terjadi kesalahan pada server. Silakan coba lagi.";
        toast.error(msg);
      }

      if (options.voiceAssistant) {
        const u = new SpeechSynthesisUtterance(
          "Terjadi kesalahan. Silakan coba lagi."
        );
        u.lang = "id-ID";
        window.speechSynthesis.speak(u);
      }
    } finally {
      setLoading(false);
    }
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
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-primary-200 rounded-full mb-6 w-max mx-auto bg-card">
              <Accessibility className="text-primary-200 w-4 h-4" />
              <span className="text-primary-200 text-sm font-medium">
                disability-friendly
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-3">
              <span className="text-primary-200">Rekrut lebih mudah</span>
              <span className="text-text-primary">
                , pasang loker gratis sekarang
              </span>
            </h2>
            <p className="text-text-secondary">
              <span className="text-primary-200 font-medium">
                Ribuan lowongan
              </span>{" "}
              dari perusahaan yang peduli aksesibilitas
            </p>
          </div>
        </div>

        <form
          onSubmit={onsubmit}
          className="bg-bg-card rounded-lg border-0 p-8"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Daftar Perusahaan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Input
                  id="name"
                  label="Nama Perusahaan"
                  placeholder="Nama Perusahaan Anda"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  error={errors.name}
                  required
                />
              </div>

              <div>
                <Input
                  id="industryType"
                  label="Industri"
                  placeholder="Technology, Healthcare, Education, Finance"
                  value={formData.industryType}
                  onChange={(e) => handleChange("industryType", e.target.value)}
                  error={errors.industryType}
                  required
                />
                <p className="text-xs text-text-secondary mt-1">
                  Pilihan: Technology, Healthcare, Education, Finance,
                  E-Commerce, Media, Others
                </p>
              </div>
            </div>

            <div className="mb-6">
              <Input
                id="websiteUrl"
                label="URL Website (opsional)"
                placeholder="https://example.com"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                error={errors.websiteUrl}
              />
            </div>

            <div className="mb-6">
              <Textarea
                id="description"
                label="Deskripsi Perusahaan"
                placeholder="Deskripsi Perusahaan Anda"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={errors.description}
                rows={4}
                required
              />
            </div>

            <div className="mb-6">
              <Textarea
                id="address"
                label="Alamat Perusahaan"
                placeholder="Alamat Perusahaan Anda"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                error={errors.address}
                rows={3}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Logo Perusahaan (opsional)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
               file:rounded-md file:border-0 file:text-sm file:font-semibold 
               file:bg-primary-200 file:text-white hover:file:bg-primary-300 cursor-pointer"
              />

              {formData.logoImgPath && (
                <p className="text-xs text-text-secondary mt-2">
                  File: {formData.logoImgPath}
                </p>
              )}
              <p className="text-xs text-text-secondary mt-1">
                Upload logo: POST /api/files/upload/image (format: png/jpg/jpeg)
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-text-primary mb-1">
              Media Sosial Perusahaan{" "}
              <span className="text-sm font-normal text-text-secondary">
                (opsional)
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Input
                id="linkedinUrl"
                label="Linkedin"
                placeholder="https://linkedin.com/company/..."
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                error={errors.linkedinUrl}
              />

              <Input
                id="youtubeUrl"
                label="Youtube"
                placeholder="https://youtube.com/@..."
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                error={errors.youtubeUrl}
              />

              <Input
                id="instagramUrl"
                label="Instagram"
                placeholder="https://instagram.com/..."
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => handleChange("instagramUrl", e.target.value)}
                error={errors.instagramUrl}
              />

              <Input
                id="twitterUrl"
                label="Twitter"
                placeholder="https://twitter.com/..."
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => handleChange("twitterUrl", e.target.value)}
                error={errors.twitterUrl}
              />
            </div>
          </div>

          <div className="mb-6" id="agreeToTermsContainer">
            <h3 className="text-lg font-bold text-text-primary mb-4">
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
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
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
              <p className="text-red-500 text-sm mt-2">{errors.agreeToTerms}</p>
            )}
          </div>

          <Button type="submit" className="mt-4 w-full py-2" loading={loading}>
            Daftar Perusahaan
          </Button>

          <p className="text-text-secondary text-center mt-4 text-sm">
            Sudah punya Akun?{" "}
            <a className="text-primary-300 font-semibold" href="/login">
              Masuk
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
