"use client";

import React from "react";
import DisabilityImage from "@/components/ui/Image";
import Button from "@/components/ui/Button";
import { MapPin, DollarSign } from "lucide-react";

export default function JobCard({
  title,
  company,
  location,
  salary,
  remote,
  description,
}) {
  return (
    <article className="bg-bg-card border border-primary-50 rounded-lg p-6 shadow-sm" aria-labelledby={`job-${title.replace(/\s+/g, "-")}`}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary-50 rounded-md flex items-center justify-center" aria-hidden>
          <div className="w-12 h-12 bg-primary-100 rounded" />
        </div>

        <div className="flex-1">
          <h3 id={`job-${title.replace(/\s+/g, "-")}`} className="text-xl font-semibold text-primary-900">
            {title}
          </h3>

          <p className="text-sm text-primary-300">{company}</p>

          <div className="flex items-center gap-4 mt-3 text-sm text-primary-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {location}
            </span>
            {salary && (
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> {salary}
              </span>
            )}
            {remote && <span className="flex items-center gap-2">Remmote</span>}
          </div>

          <p className="mt-4 text-sm text-primary-400">{description}</p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <Button variant="primary" className="px-6 py-2" aria-label={`Lamar ke ${title}`}>
            Lamar Kerja
          </Button>
        </div>
      </div>
    </article>
  );
}
