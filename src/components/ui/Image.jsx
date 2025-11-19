"use client";

import Image from "next/image";
import { useAccessibilityOptions } from "@/hooks/useAccessibilityOptions";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function DisabilityImage({
  src,
  alt,
  width,
  height,
  className = "",
  rounded = true,
  caption,
  ...props
}) {
  const { theme, dyslexia } = useAccessibilityOptions();
  const [isLoaded, setIsLoaded] = useState(false);

  // Hapus efek border
  useEffect(() => {
    if (theme === "high-contrast") {
      document.documentElement.style.removeProperty("--image-border");
    }
  }, [theme]);

  return (
    <figure
      className={clsx(
        "flex flex-col items-center justify-center transition-all duration-300 focus-within:ring-2",
        {
          "ring-primary-200 ring-offset-2": theme !== "high-contrast",
          "ring-primary-50 ring-4": theme === "high-contrast",
        },
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={clsx(
          "object-cover",
          rounded && "rounded-lg",
          "transition-all duration-300 ease-in-out",
          {
            "opacity-0": !isLoaded,
            "opacity-100": isLoaded,
            "contrast-125 saturate-150": theme === "color-blind",
            "filter grayscale contrast-150": theme === "high-contrast",
          }
        )}
        {...props}
      />

      {caption && (
        <figcaption
          className={clsx(
            "mt-2 text-sm text-text-secondary text-center transition-all duration-200",
            {
              "font-lexend tracking-wider": dyslexia,
              "text-primary-100": theme === "high-contrast",
            }
          )}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
