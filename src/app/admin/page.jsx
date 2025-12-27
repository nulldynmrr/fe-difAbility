"use client";

import React, { useState, useEffect, useCallback } from "react";
import request from "@/utils/request";
import { toast } from "sonner";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await request.get("/logs");
      setLogs(response.data || []);
    } catch (err) {
      toast.dismiss();
      setLogs([]);
      toast.error("Gagal memuat activity log");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLogs();
  }, [fetchAllLogs]);

  if (isLoading) {
    return <p>Memuat aktivitas...</p>;
  }

  return (
    <section className="mt-12">
      <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>

      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-sidebar/20 border border-black/10 dark:border-white/10"
            >
              <div className="w-9 h-9 flex items-center justify-center bg-muted rounded-full flex-shrink-0">
                <span className="font-bold text-sm">
                  {log.actorUsername?.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{log.actorUsername}</p>
                <p className="text-sm text-muted-foreground">
                  {log.actorRole}
                </p>
                {log.description && (
                  <p className="text-xs italic text-muted-foreground mt-1">
                    {log.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-md text-white ${
                    log.actorAction.includes("CREATE")
                      ? "bg-green-500"
                      : log.actorAction.includes("UPDATE")
                      ? "bg-blue-500"
                      : log.actorAction.includes("DELETE")
                      ? "bg-red-500"
                      : log.actorAction.includes("VIEW")
                      ? "bg-yellow-500"
                      : log.actorAction.includes("LOGIN")
                      ? "bg-purple-500"
                      : "bg-gray-400"
                  }`}
                >
                  {log.actorAction}
                </span>

                <span className="text-muted-foreground text-xs">
                  {new Date(log.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Tidak ada aktivitas terbaru.</p>
      )}
    </section>
  );
}
