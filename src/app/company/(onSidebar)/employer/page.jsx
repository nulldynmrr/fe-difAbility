"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import api from "@/utils/request";

export default function HRPage() {
  const [hrList, setHrList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHRs = async () => {
    setLoading(true);
    console.log("Fetching HR list...");
    try {
      const { data } = await api.get("/companies/me/humanresources");
      console.log("Fetched HR data:", data);
      setHrList(data);
    } catch (error) {
      console.error("Error fetching HRs:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hapus HR
  const deleteHR = async (hrId) => {
    if (!confirm("Apakah yakin ingin menghapus HR ini?")) return;
    console.log("Deleting HR with ID:", hrId);
    try {
      const res = await api.delete(`/companies/me/humanresources/${hrId}`);
      console.log("Delete response:", res.data);
      toast.success("HR berhasil dihapus");
      setHrList(hrList.filter((hr) => hr.id !== hrId));
    } catch (error) {
      console.error("Error deleting HR:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchHRs();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Data Human Resources</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg">
            <thead className="bg-primary-200 text-white">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Kontak</th>
                <th className="px-4 py-2 text-left">Company ID</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hrList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    Tidak ada data HR
                  </td>
                </tr>
              )}
              {hrList.map((hr, idx) => (
                <tr
                  key={hr.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{hr.fullName}</td>
                  <td className="px-4 py-2">{hr.contact}</td>
                  <td className="px-4 py-2">{hr.companyId}</td>
                  <td className="px-4 py-2">
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => deleteHR(hr.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
