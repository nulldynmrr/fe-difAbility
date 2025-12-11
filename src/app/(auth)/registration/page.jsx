"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Accessibility, Building2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import request from "@/utils/request";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { z } from "zod";

const regisSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password harus mengandung minimal 1 huruf kapital dan 1 karakter spesial"
    ),

  role: z.string().min(1, "Role wajib dipilih"),
});

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getValidationError = (field) => errors[field] || "";

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    toast.dismiss();

    const validated = regisSchema.safeParse(formData);

    if (!validated.success) {
      const newErr = {};
      validated.error.issues.forEach((err) => {
        newErr[err.path[0]] = err.message;
      });
      setErrors(newErr);
      setLoading(false);
      return;
    }

    try {
      const response = await request.post("/auth/registration", formData);

      if (
        response?.status === 201 ||
        response?.status === 200 ||
        response?.data?.code === 201
      ) {
        toast.success("Registrasi berhasil! Silakan masuk.");
        Cookies.set("token", response.data.token);

        router.push("/login");
        return;
      }

      toast.error("Terjadi kesalahan, silakan coba lagi.");
    } catch (err) {
      const errorData = err.response?.data;
      console.log("REGISTER ERROR:", errorData);

      if (response?.status === 409) {
        toast.success("Email sudah ada");
        setLoading(false);
        return;
      }

      const msg =
        errorData?.message ||
        "Terjadi kesalahan pada server. Silakan coba lagi.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-bg">
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        data-theme="default"
      >
        <div
          className="absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-90 blur-xl"
          style={{
            background: "linear-gradient(to right, #bfdbfe, #e0f2fe, #ffffff)",
          }}
        ></div>
        <div className="absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-sky-100 opacity-40 blur-[80px]"></div>
      </div>

      <div className="flex min-h-screen z-100">
        <div className="relative w-1/2 h-screen hidden md:block">
          <Image
            src="/assets/ilustrasi.svg"
            alt="Ilustrasi siswa sedang belajar dengan komputer"
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start px-12 pt-10 pb-10 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center space-x-2 p-2 border border-blue-300 rounded-3xl mb-6 w-max">
            <Accessibility className="text-blue-600 w-5 h-5" />
            <p className="text-blue-600 font-semibold">disability-friendly</p>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-600">Masuk</span> hingga sampai kerja
          </h1>

          <p className="mb-8 text-gray-600">
            <span className="text-blue-500">Ribuan lowongan</span> dari
            perusahaan yang peduli aksesibilitas
          </p>

          <form onSubmit={onSubmit} className="space-y-2 w-full max-w-md">
            <Input
              id="email"
              name="email"
              label="Email"
              placeholder="Masukkan Email"
              value={formData.email}
              onChange={handleChange}
              error={getValidationError("email")}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="kata sandi kamu"
              value={formData.password}
              onChange={handleChange}
              error={getValidationError("password")}
            />

            <label className="font-medium">Pilih Role</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "Job Seeker" }))
                }
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition ${
                  formData.role === "Job Seeker"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <Accessibility className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-semibold">Job Seeker</p>
              </div>
              <div
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "Company" }))
                }
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition ${
                  formData.role === "Company"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-semibold">Company</p>
              </div>
            </div>

            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}

            <Button
              type="submit"
              className="mt-4 w-full py-2"
              loading={loading}
            >
              Masuk
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
