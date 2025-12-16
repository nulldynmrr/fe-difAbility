"use client";

import { usePathname } from "next/navigation";
import SpeechSearchBar from "@/components/ui/Search";
import DisabilityImage from "@/components/ui/Image";

export default function HeaderCard({
  title,
  subtitle,
  placeholder = "Cari pekerjaan...",
  imageSrc = "/assets/ilustrasi.svg",
  imageAlt = "illustration",
  showSearch = true,
}) {
  const pathname = usePathname();

  const hideSearch =
    pathname?.includes("/company") || pathname?.includes("/employer");

  const showedSearch = showSearch && !hideSearch;

  return (
    <section className="relative min-h-[180px] bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-8 text-white overflow-hidden flex items-center">
      <div className="w-full max-w-6xl mx-auto flex items-center">
        <div className="flex-1 z-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm opacity-90">{subtitle}</p>

          {showedSearch && (
            <div className="mt-6 max-w-xl">
              <SpeechSearchBar placeholder={placeholder} />
            </div>
          )}
        </div>

        <div className="hidden md:block absolute bottom-0 right-6">
          <DisabilityImage
            src={imageSrc}
            alt={imageAlt}
            width={260}
            height={180}
            rounded={false}
          />
        </div>
      </div>
    </section>
  );
}
