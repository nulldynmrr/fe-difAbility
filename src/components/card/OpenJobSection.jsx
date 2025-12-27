import DashboardJobCard from "./JobsCard";
import { Inbox } from "lucide-react";
import { getCurrentUser } from "@/utils/request";
import Button from "@/components/ui/Button";

function OpenJobsSection({ jobs = [] }) {
  const user = getCurrentUser();
  const openJobs = jobs.filter((job) => job.publicationStatus === "Open");

  if (openJobs.length === 0) {
    return (
      <div className="w-full bg-bg p-5 rounded-lg flex flex-col items-center justify-center gap-3">
        <Inbox className="w-10 h-10 text-gray-400" />
        {user?.role === "JOB_SEEKER" ? (
          <>
            <h3 className="text-lg font-semibold">Update Porfile kamu</h3>
          </>
        ) : (
          <h3 className="text-lg font-semibold">Posting Lamaran Kerja</h3>
        )}
        {user?.role === "JOB_SEEKER" ? (
          <p className="text-gray-500 text-sm text-center">
            Agar lamaran pekerjaan muncul
          </p>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            Tidak ada lowongan terbuka diperusahaan mu.
          </p>
        )}

        <Button
          href="/job-seeker/update-profile"
          type="submit"
          className="mt-4  py-2"
          shortcutLabel="enter"
        >
          Update Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-bg w-full">
      <h3 className="text-lg font-semibold mb-4">Daftar Lowongan Pekerjaan</h3>

      <div className="space-y-4">
        {openJobs.map((job) => (
          <DashboardJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default OpenJobsSection;
