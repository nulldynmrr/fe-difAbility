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

async function loadIndustries() {
  try {
    const res = await request.get("/enums/industry-types");
    return res.data || [];
  } catch {
    return [];
  }
}

export default function RegisterCompany() {
  const [industryTypes, setIndustryTypes] = useState([]);

  const [loading, setLoading] = useState(false);
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const err = {};

    if (!form.companyName) err.companyName = "Nama perusahaan wajib diisi";
    if (!form.companyDescription)
      err.companyDescription = "Deskripsi wajib diisi";
    if (!form.address) err.address = "Alamat wajib diisi";

    if (!form.industryType) err.industryType = "Pilih industry type";

    if (!logoFile) err.logoFile = "Logo perusahaan wajib diupload";

    if (!form.agreeToTerms)
      err.agreeToTerms = "Anda harus menyetujui persyaratan";

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

    let logoPath = null;

    try {
      const fd = new FormData();
      fd.append("file", logoFile);

      const uploadRes = await request.post("/files/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      logoPath = uploadRes.data;
    } catch (err) {
      toast.error("Upload logo gagal");
      setLoading(false);
      return;
    }

    try {
      await request.patch(
        "/companies/me/profile",
        {
          companyName: form.companyName,
          companyDescription: form.companyDescription,
          address: form.address,
          industryType: form.industryType,

          websiteUrl: form.websiteUrl || "",
          linkedinUrl: form.linkedinUrl || "",
          youtubeUrl: form.youtubeUrl || "",
          instagramUrl: form.instagramUrl || "",
          twitterUrl: form.twitterUrl || "",

          logoImagePath: logoPath,
          agreeToTerms: form.agreeToTerms,
        },
        { withCredentials: true }
      );

      toast.success("Profil perusahaan berhasil disimpan");
      window.location.href = "/company/dashboard";
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan profil");
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
            <span className="text-text-primary">Perusahaan Anda</span>
          </h2>
        </div>

        <form onSubmit={onSubmit} className="bg-bg-card rounded-lg p-8">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Informasi Perusahaan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              id="companyName"
              label="Nama Perusahaan"
              placeholder="Nama Perusahaan Anda"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              error={errors.companyName}
            />

            <Input
              id="websiteUrl"
              type="url"
              label="Website (opsional)"
              placeholder="https://example.com"
              value={form.websiteUrl}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
            />
          </div>

          <Textarea
            label="Deskripsi Perusahaan"
            placeholder="Tuliskan deskripsi perusahaan Anda"
            value={form.companyDescription}
            onChange={(e) => handleChange("companyDescription", e.target.value)}
            error={errors.companyDescription}
            rows={4}
          />

          <Textarea
            label="Alamat Perusahaan"
            placeholder="Alamat lengkap perusahaan"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
            rows={3}
          />

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">
              Industry Type
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
              <p className="text-red-500 text-sm">{errors.industryType}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
              Logo Perusahaan (PNG/JPG/JPEG)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="block w-full text-sm border p-2 rounded bg-gray-100"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
            {errors.logoFile && (
              <p className="text-red-500 text-sm">{errors.logoFile}</p>
            )}
          </div>

          <h3 className="text-xl font-bold mt-10 mb-4">Media Sosial</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              id="linkedinUrl"
              label="LinkedIn"
              value={form.linkedinUrl}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            />
            <Input
              id="youtubeUrl"
              label="YouTube"
              value={form.youtubeUrl}
              onChange={(e) => handleChange("youtubeUrl", e.target.value)}
            />
            <Input
              id="instagramUrl"
              label="Instagram"
              value={form.instagramUrl}
              onChange={(e) => handleChange("instagramUrl", e.target.value)}
            />
            <Input
              id="twitterUrl"
              label="Twitter"
              value={form.twitterUrl}
              onChange={(e) => handleChange("twitterUrl", e.target.value)}
            />
          </div>

          <div className="mt-6">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.agreeToTerms}
                onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-text-primary">
                Perusahaan kami setuju dengan Pernyataan Kelayakan & Persetujuan
                terkait dukungan disabilitas.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full mt-8">
            Simpan Profil Perusahaan
          </Button>
        </form>
      </div>
    </div>
  );
}
