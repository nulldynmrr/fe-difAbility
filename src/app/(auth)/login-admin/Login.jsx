"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import { Accessibility } from "lucide-react";

import Cookies from "js-cookie";
import { toast } from "sonner";
import request from "@/utils/request";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

import { useSpeechGuide } from "@/hooks/speech/useSpeechGuide";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

const formSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  otp: z.string().min(4, "OTP minimal 4 karakter"),
});

export default function LoginAdmin() {
  const router = useRouter();
  const options = useAccessibilityOptions();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState([]);

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman login admin. Silakan masukkan username, password, dan kode OTP."
      : null,
    "#username",
    options.voiceAssistant
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const getValidationError = (field) =>
    validations.find((v) => v.name === field)?.message;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidations([]);

    try {
      const validation = formSchema.safeParse(formData);
      if (!validation.success) {
        setValidations(
          validation.error.issues.map((err) => ({
            name: err.path[0],
            message: err.message,
          }))
        );
        toast.error("Input tidak valid");
        return;
      }

      Cookies.remove("token");
      Cookies.remove("token", { path: "/" });

      const res = await request.post("/auth/admin-session", formData);
      const data = res.data;

      if (!data?.token) {
        toast.error("Token tidak diterima dari server");
        return;
      }

      Cookies.set("token", data.token, {
        expires: 1,
        path: "/",
      });

      const decoded = jwtDecode(data.token);
      const role = decoded.role?.toUpperCase();

      if (role !== "ADMIN") {
        toast.error("Akses ditolak");
        return;
      }

      toast.success("Login admin berhasil");
      router.push("/admin");
    } catch (error) {
      let msg = "Network error";

      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          msg = data?.message || "Username, password, atau OTP salah";
          setValidations([
            {
              name: "username",
              message: msg,
            },
          ]);
        } else if (status === 404) {
          msg = "Akun admin tidak ditemukan";
          setValidations([{ name: "username", message: msg }]);
        } else if (status === 400) {
          msg = "Input tidak valid";
        } else {
          msg = data?.message || "Server error";
        }
      }

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-bg">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-90 blur-xl"
          style={{
            background: "linear-gradient(to right, #bfdbfe, #e0f2fe, #ffffff)",
          }}
        />
        <div className="absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-sky-100 opacity-40 blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen z-10">
        <div className="relative w-1/2 h-screen hidden md:block">
          <Image
            src="/assets/ilustrasi.svg"
            alt="Ilustrasi admin"
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-24 w-full md:w-1/2 flex flex-col justify-start px-12 pt-16 pb-10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 p-2 border border-blue-300 rounded-3xl mb-6 w-max">
            <Accessibility className="text-blue-600 w-5 h-5" />
            <p className="text-blue-600 font-semibold">admin-access</p>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-600">Login</span> Admin
          </h1>

          <form onSubmit={onSubmit} className="space-y-2 w-full max-w-md">
            <Input
              id="username"
              name="username"
              label="Username atau Email"
              value={formData.username}
              onChange={handleChange}
              error={getValidationError("username")}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={getValidationError("password")}
            />

            <Input
              id="otp"
              name="otp"
              label="Kode OTP"
              value={formData.otp}
              onChange={handleChange}
              error={getValidationError("otp")}
            />

            <Button type="submit" className="mt-4 w-full py-2" loading={loading}>
              Masuk
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
