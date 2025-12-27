"use client";

import { useState } from "react";
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

export default function Login() {
  const router = useRouter();
  const options = useAccessibilityOptions();

  const formSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  });

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState([]);

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman login. Silakan masukkan username dan password kamu."
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

      const res = await request.post("/auth/session", formData);
      const data = res.data;

      if (!data?.token) {
        toast.error("Token tidak diterima dari server");
        return;
      }

      Cookies.set("token", data.token, { expires: 1, path: "/" });

      const decoded = jwtDecode(data.token);
      const role = decoded.role?.toUpperCase();

      toast.success("Login berhasil");

      switch (role) {
        case "COMPANY":
          router.push("/company/dashboard");
          break;
        case "HUMAN_RESOURCE":
          router.push("/employer/dashboard");
          break;
        case "JOB_SEEKER":
          router.push("/job-seeker/dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      let msg = "Network error";

      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          msg = data?.message || "Username atau password salah";
          setValidations([
            {
              name: msg.toLowerCase().includes("password")
                ? "password"
                : "username",
              message: msg,
            },
          ]);
        } else if (status === 404) {
          msg = "Akun tidak ditemukan";
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
            alt="Ilustrasi pencari kerja"
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-24 w-full md:w-1/2 flex flex-col justify-start px-12 pt-16 pb-10 backdrop-blur-sm">
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
              id="username"
              name="username"
              label="Username atau Email"
              placeholder="Masukkan username atau email"
              value={formData.username}
              onChange={handleChange}
              error={getValidationError("username")}
              disabled={loading}
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
              disabled={loading}
            />

            <Button
              type="submit"
              className="mt-4 w-full py-2"
              loading={loading}
            >
              Masuk
            </Button>

            <p className="text-text-secondary text-center mt-2">
              Belum punya akun?{" "}
              <a
                className="text-primary-300 font-semibold hover:text-primary-400 transition-colors"
                href="/registration"
              >
                Daftar
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
