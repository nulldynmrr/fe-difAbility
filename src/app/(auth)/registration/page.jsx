"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/Image";
import { Accessibility, Building2, Check, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import request from "@/utils/request";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { z } from "zod";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

const regisSchema = z.object({
  email: z
    .string()
    .email("Format email harus name@example.com")
    .min(1, "Email wajib diisi"),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password harus mengandung minimal 1 huruf kapital dan 1 angka"
    )
    .min(8, "Password minimal 8 karakter")
    .min(1, "Password wajib diisi"),

  confirmPassword: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password harus mengandung minimal 1 huruf kapital dan 1 angka"
    )
    .min(8, "Password minimal 8 karakter")
    .min(1, "Konfirmasi Password wajib diisi"),

  role: z.string().min(1, "Role wajib dipilih"),
});

const Register = () => {
  const router = useRouter();
  const options = useAccessibilityOptions();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    match: false,
  });

  useEffect(() => {
    const newCriteria = {
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      number: /\d/.test(formData.password),
      match:
        formData.confirmPassword === formData.password &&
        formData.password.length > 0,
    };

    setCriteria(newCriteria);

    const allValid = Object.values(newCriteria).every(Boolean);
    if (allValid) {
      setShowPasswordCriteria(false);
    }
  }, [formData.password, formData.confirmPassword]);

  const strengthScore =
    Object.values(criteria).filter(Boolean).length /
    Object.keys(criteria).length;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "password" || name === "confirmPassword") {
      setShowPasswordCriteria(true);
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const getValidationError = (field) => errors[field] || "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    toast.dismiss();
    setLoading(true);

    if (options.voiceAssistant) {
      const utterance = new SpeechSynthesisUtterance(
        "Sedang memproses pendaftaran. Mohon tunggu."
      );
      utterance.lang = "id-ID";
      window.speechSynthesis.speak(utterance);
    }

    const validated = regisSchema.safeParse(formData);

    if (!validated.success) {
      const newErrors = {};
      validated.error.issues.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    if (!criteria.match) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Password konfirmasi tidak sama",
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await request.post("/auth/registration", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

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
      const status = err.response?.status;

      if (status === 409) {
        toast.error("Email sudah terdaftar");
        setLoading(false);
        return;
      }

      toast.error(
        errorData?.message ||
          "Terjadi kesalahan pada server. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordCriteriaItems = [
    { key: "length", label: "Minimal 8 karakter", met: criteria.length },
    {
      key: "uppercase",
      label: "Minimal 1 huruf kapital",
      met: criteria.uppercase,
    },
    { key: "number", label: "Minimal 1 angka", met: criteria.number },
    { key: "match", label: "Password sama", met: criteria.match },
  ];

  const roleOptions = [
    { value: "Job Seeker", icon: Accessibility, label: "Job Seeker" },
    { value: "Company", icon: Building2, label: "Company" },
  ];

  return (
    <div className="min-h-screen relative bg-bg">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-90 blur-xl"
          style={{
            background: "linear-gradient(to right, #bfdbfe, #e0f2fe, #ffffff)",
          }}
        />
        <div className="absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-sky-100 opacity-40 blur-[80px]" />
      </div>

      <div className="fixed left-0 top-0 w-1/2 h-screen hidden md:block z-10">
        <Image
          src="/assets/ilustrasi.svg"
          alt="Ilustrasi siswa sedang belajar dengan komputer"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-20 ml-0 md:ml-[50%] w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center px-12">
        <div className="mt-8 w-full max-w-md py-10">
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

          <form onSubmit={onSubmit} className="space-y-2 w-full">
            {/* INPUTS */}
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
              placeholder="Masukkan kata sandi"
              value={formData.password}
              onChange={handleChange}
              error={getValidationError("password")}
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Konfirmasi Password"
              placeholder="Masukkan ulang kata sandi"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={getValidationError("confirmPassword")}
            />

            {showPasswordCriteria && (
              <div className="mt-2 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-sm">
                <div className="flex flex-wrap gap-2">
                  {passwordCriteriaItems.map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center px-2 py-1 rounded-md ${
                        item.met
                          ? "bg-blue-100 text-blue-700"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${
                          item.met ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      >
                        {item.met ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="font-medium block mt-4">Pilih Role</label>

            <div className="grid grid-cols-2 gap-4">
              {roleOptions.map((role) => (
                <div
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center ${
                    formData.role === role.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <role.icon className="w-8 h-8 text-blue-600 mb-1" />
                  <p className="font-semibold text-sm">{role.label}</p>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="mt-4 w-full py-2"
              loading={loading}
            >
              Masuk
            </Button>

            <p className="text-center mt-2">
              Sudah punya Akun?{" "}
              <a href="/login" className="text-blue-600 font-semibold">
                Masuk
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
