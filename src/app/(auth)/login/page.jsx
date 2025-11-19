"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import { Accessibility } from "lucide-react";
import { useSpeechGuide } from "@/hooks/speech/useSpeechGuide";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const options = useAccessibilityOptions();

  useSpeechGuide(
    options.voiceAssistant
      ? "Halo, kamu berada di halaman login. Silakan masukkan email kamu untuk masuk ke akun."
      : null,
    "#email",
    options.voiceAssistant
  );

  const onLogin = () => {
    if (options.voiceAssistant) {
      const u = new SpeechSynthesisUtterance("Sedang memproses login...");
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen relative bg-bg">
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        data-theme="default"
      >
        <div
          className="absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-90 blur-3xl"
          style={{
            background: "linear-gradient(to right, #bfdbfe, #e0f2fe, #ffffff)",
          }}
        ></div>
        <div className="absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-sky-100 opacity-40 blur-[150px]"></div>
      </div>

      <div className="flex min-h-screen">
        <div className="relative w-1/2 h-screen hidden md:block">
          <Image
            src="/assets/ilustrasi.svg"
            alt="Ilustrasi siswa sedang belajar dengan komputer"
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-12">
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

          <div className="space-y-4 w-full max-w-md">
            <Input
              id="email"
              label="Email"
              placeholder="email kamu"
              shortcutLabel="ctrl+e"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="kata sandi kamu"
              shortcutLabel="ctrl+p"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              onClick={onLogin}
              className="mt-4 w-full py-2"
              shortcutLabel="enter"
            >
              Masuk
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
