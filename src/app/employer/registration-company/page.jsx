"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Accessibility, Plus } from "lucide-react";
import { useSpeechGuide } from "@/hooks/speech/useSpeechGuide";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    description: "",
    address: "",
    logoUrl: "",
    industries: ["", ""],
    linkedin: "",
    youtube: "",
    instagram: "",
    twitter: "",
    agreeToTerms: false,
  });

  const options = useAccessibilityOptions();

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman pendaftaran perusahaan. Silakan masukkan nama perusahaan dan informasi lainnya."
      : null,
    "#companyName",
    options.voiceAssistant
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIndustryChange = (index, value) => {
    const newIndustries = [...formData.industries];
    newIndustries[index] = value;
    setFormData((prev) => ({ ...prev, industries: newIndustries }));
  };

  const addIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industries: [...prev.industries, ""],
    }));
  };

  const onsubmit = () => {
    console.log("Form submitted:", formData);
    alert("Registrasi perusahaan berhasil!");
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

        <form className="bg-card rounded-lg border-0 p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Daftar Perusahaan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                id="companyName"
                label="Nama Perusahaan"
                placeholder="Nama Perusahaan Anda"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                required
              />

              <Input
                id="website"
                label="URL website (opsional)"
                placeholder="URL website Anda (opsional)"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Textarea
                id="description"
                label="Deskripsi Perusahaan"
                placeholder="Deskripsi Perusahaan Anda"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
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
                rows={3}
                required
              />
            </div>

            <div className="mb-6">
              <Input
                type="url"
                label="Logo Perusahaan"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Bidang Industri Perusahaan
              </label>
              {formData.industries.map((industry, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      placeholder={`Bidang Industri ${index + 1}`}
                      value={industry}
                      onChange={(e) =>
                        handleIndustryChange(index, e.target.value)
                      }
                      className="flex-1"
                      shortcutLabel={`J${index + 1}`}
                    />

                    {index === formData.industries.length - 1 && (
                      <Button
                        type="button"
                        onClick={addIndustry}
                        className="w-8 h-8 flex items-center justify-center"
                        variant="primary"
                        voiceLabel="Tambah bidang industri"
                        shortcutLabel="P"
                      >
                        <Plus className="text-white w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
                id="linkedin"
                label="Linkedin"
                placeholder="Linkedin Perusahaan (opsional)"
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />

              <Input
                id="youtube"
                label="Youtube"
                placeholder="Youtube Perusahaan (opsional)"
                type="url"
                value={formData.youtube}
                onChange={(e) => handleChange("youtube", e.target.value)}
              />

              <Input
                id="instagram"
                label="Instagram"
                placeholder="Instagram Perusahaan (opsional)"
                type="url"
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />

              <Input
                id="twitter"
                label="Twitter"
                placeholder="Twitter Perusahaan (opsional)"
                value={formData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
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
          </div>

          <Button
            onClick={onsubmit}
            className="w-full flex items-center justify-center gap-2"
          >
            Daftar Perusahaan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
