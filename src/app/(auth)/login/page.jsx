"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import { Accessibility } from "lucide-react";

import Cookies from "js-cookie";
import { toast } from "sonner";
import request, { getCurrentUser } from "@/utils/request";
import { z } from "zod";

import { useSpeechGuide } from "@/hooks/speech/useSpeechGuide";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

const formSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState([]);

  const options = useAccessibilityOptions();

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman login. Silakan masukkan username dan password kamu."
      : null,
    "#username",
    options.voiceAssistant
  );

  useEffect(() => {
    const verify = searchParams.get("verify");
    const message = searchParams.get("message");

    if (verify === "success") {
      toast.dismiss();
      toast.success("Verifikasi email berhasil!");
    } else if (message) {
      toast.dismiss();
      toast.error(message);
    }

    if (verify || message) {
      const np = new URLSearchParams(searchParams.toString());
      np.delete("verify");
      np.delete("message");
      router.replace(`?${np.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getValidationError = (field) => {
    const err = validations.find((v) => v.name === field);
    return err?.message;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidations([]);

    if (options.voiceAssistant) {
      const u = new SpeechSynthesisUtterance(
        "Sedang memproses login. Mohon tunggu."
      );
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }

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
        setLoading(false);
        return;
      }

      const res = await request.post("/auth/session", {
        username: formData.username,
        password: formData.password,
      });

      if (res.status === 200 || res.status === 201) {
        const data = res.data;

        if (data.token) {
          Cookies.set("token", data.token, { expires: 1 });

          const user = getCurrentUser();

          if (!user) {
            toast.error("Token tidak valid");
            setLoading(false);
            return;
          }

          if (user.role === "Company" || user.role === "COMPANY") {
            router.push("/employer/dashboard");
          } else if (user.role === "Job Seeker") {
            router.push("/job-seeker/dashboard");
          } else if (user.role === "Human Resource") {
            router.push("/employer/dashboard");
          } else if (user.role === "Admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }

          toast.success("Login berhasil");
        } else {
          toast.error("Token tidak diterima");
        }
      } else {
        toast.error("Login gagal");
      }

      setLoading(false);
    } catch (error) {
      let msg = "";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          msg =
            data?.errorAdminRouteL2 ||
            data?.errorAdminRouteL3 ||
            data?.message ||
            "Username atau password salah";

          if (msg.toLowerCase().includes("password")) {
            setValidations([{ name: "password", message: msg }]);
          } else {
            setValidations([{ name: "username", message: msg }]);
          }
        } else if (status === 404) {
          msg = "Akun tidak ditemukan";
          setValidations([{ name: "username", message: msg }]);
        } else if (status === 400) {
          msg = "Input tidak valid";
        } else {
          msg = data?.message || "Server error";
        }
      } else {
        msg = "Network error";
      }

      toast.error(msg);
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
        <div className="absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-sky-100 opacity-40 blur-[120px]"></div>
      </div>

      <div className="relative flex min-h-screen z-10">
        <div className="relative w-1/2 h-screen hidden md:block">
          <Image
            src="/assets/ilustrasi.svg"
            alt="Ilustrasi siswa sedang belajar dengan komputer"
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
              label="Username or Email"
              placeholder="Masukkan Username atau Email"
              shortcutLabel="ctrl+u"
              value={formData.username}
              onChange={handleChange}
              error={getValidationError("username")}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Masukkan kata sandi"
              shortcutLabel="ctrl+p"
              value={formData.password}
              onChange={handleChange}
              error={getValidationError("password")}
            />

            <Button
              type="submit"
              className="mt-4 w-full py-2"
              shortcutLabel="enter"
              loading={loading}
            >
              Masuk
            </Button>

            <p className="text-text-secondary text-center mt-2">
              Belum punya Akun?{" "}
              <a
                className="text-primary-300 font-semibold"
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
