"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/Image";
import { Briefcase, Check, X } from "lucide-react";
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
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Minimal 1 huruf kapital & 1 angka")
    .min(8, "Password minimal 8 karakter"),

  confirmPassword: z.string().min(1, "Konfirmasi Password wajib diisi"),
});

export default function RegisterHumanResource() {
  const router = useRouter();
  const options = useAccessibilityOptions();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
    const c = {
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      number: /\d/.test(formData.password),
      match:
        formData.password === formData.confirmPassword &&
        formData.password.length > 0,
    };

    setCriteria(c);
    if (Object.values(c).every(Boolean)) setShowPasswordCriteria(false);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (name.includes("password")) setShowPasswordCriteria(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    toast.dismiss();

    const valid = regisSchema.safeParse(formData);
    if (!valid.success) {
      const err = {};
      valid.error.issues.forEach((i) => (err[i.path[0]] = i.message));
      setErrors(err);
      setLoading(false);
      return;
    }

    if (!criteria.match) {
      setErrors({ confirmPassword: "Password tidak sama" });
      setLoading(false);
      return;
    }

    try {
      const res = await request.post("/auth/registration", {
        email: formData.email,
        password: formData.password,
        role: "Company", 
      });

      toast.success("Registrasi Human Resource berhasil!");
      Cookies.set("token", res.data.token);
      router.push("/login");
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) toast.error("Email sudah terdaftar");
      else toast.error("Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-90 blur-xl"
          style={{
            background: "linear-gradient(to right, #bfdbfe, #e0f2fe, #ffffff)",
          }}
        />
        <div className="absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-sky-100 opacity-40 blur-[80px]" />
      </div>
      <div className="hidden md:block w-1/2 relative">
        <Image src="/assets/ilustrasi.svg" alt="HR" fill />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-12">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="text-blue-600 w-5 h-5" />
            <p className="text-blue-600 font-semibold">Human Resource</p>
          </div>

          <h1 className="text-3xl font-bold mb-6">
            <span className="text-blue-600">Daftar</span> HR
          </h1>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Konfirmasi Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Button type="submit" loading={loading} className="w-full mt-4">
              Daftar Human Resource
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
