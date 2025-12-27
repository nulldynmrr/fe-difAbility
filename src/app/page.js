"use client";

import { useEffect } from "react";
import SpeechSearchBar from "@/components/ui/Search";
import { Users, Shield, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useShortcuts } from "@/hooks/useShortcuts";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "@/components/ui/Image";
import Button from "@/components/ui/Button";
import { Twitter, Facebook, Linkedin, Accessibility } from "lucide-react";

export default function Home() {
  const items = [
    {
      icon: Users,
      title: "Ramah Aksesibilitas",
      desc: "Mendukung screen reader, tema kontras, dan font disleksia.",
    },
    {
      icon: Shield,
      title: "Perusahaan Terverifikasi",
      desc: "Hanya perusahaan yang berkomitmen.",
    },
    {
      icon: Zap,
      title: "Pencarian Cepat",
      desc: "Lowongan sesuai kemampuan dalam hitungan detik.",
    },
  ];

  const faqs = [
    {
      q: "Apakah platform ini gratis?",
      a: "Ya, pencari kerja dapat menggunakan seluruh fitur secara gratis.",
    },
    {
      q: "Apakah semua perusahaan sudah diverifikasi?",
      a: "Setiap perusahaan melalui proses verifikasi berkomitmen penuh.",
    },
    {
      q: "Jenis disabilitas apa saja yang didukung?",
      a: "Kami mendukung berbagai jenis disabilitas fisik, sensorik, dan kognitif.",
    },
  ];

  useShortcuts({
    "ctrl+k": () => document.getElementById("search")?.focus(),
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <main className="bg-bg text-foreground font-lexend">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-50 text-primary-300 font-semibold mb-6">
            <Accessibility className="w-5 h-5" />
            <span>Disability-Friendly</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Temukan Pekerjaan{" "}
            <span className="text-primary-300">Tanpa Hambatan</span>
          </h1>

          <p className="text-muted-foreground mb-8 text-lg">
            Cari lowongan dari perusahaan yang mendukung inklusi & aksesibilitas.
          </p>

          <SpeechSearchBar placeholder="Saya mau kerja..." />
        </div>
        <div className="mt-12 flex justify-center" data-aos="fade-up">
          <Button className="p-0 bg-transparent hover:bg-transparent">
            <Image
              src="/assets/ilustrasi.svg"
              alt="Ilustrasi Aksesibilitas"
              width={500}
              height={350}
            />
          </Button>
        </div>
      </section>

      <section className="py-20 bg-bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2">Mengapa Memilih Kami?</h2>
            <p className="text-muted-foreground">
              Dirancang khusus untuk kenyamanan penyandang disabilitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                  className="p-6 rounded-xl border border-border text-center hover:border-primary-300 transition"
                >
                  <Icon className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">FAQ</h2>
            <p className="text-muted-foreground">
              Pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-5 border border-border rounded-xl bg-bg-card"
              >
                <p className="font-semibold mb-1">{f.q}</p>
                <p className="text-muted-foreground text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tentang Kami</h3>
            <p className="text-muted-foreground text-sm">
              Platform pencarian kerja ramah disabilitas yang inklusif.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary-300">Beranda</a></li>
              <li><a href="/jobs" className="hover:text-primary-300">Lowongan</a></li>
              <li><a href="/about" className="hover:text-primary-300">Tentang</a></li>
              <li><a href="/contact" className="hover:text-primary-300">Kontak</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Hubungi Kami</h3>
            <div className="flex space-x-4">
              <Twitter />
              <Facebook />
              <Linkedin />
            </div>
          </div>
        </div>

        <div className="text-center text-sm py-6 border-t border-border">
          © {new Date().getFullYear()} Disability-Friendly Job Platform
        </div>
      </footer>
    </main>
  );
}
