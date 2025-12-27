"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";

export default function ChatOnboardingPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await request.get("/api/conversations");
      setConversations(res.data || []);
    };
    fetchConversations();
  }, []);

  return (
    <div className="h-screen bg-bg p-6">
      <div className="bg-primary-300 text-white rounded-xl p-6 mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Cari pekerjaan dengan mudah, tanpa halangan apa pun
          </h1>
          <p className="text-sm text-primary-50 mt-1">
            Meningkatkan kepercayaan kepada disabilitas
          </p>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border h-[calc(100%-160px)] flex overflow-hidden">
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 font-semibold">Daftar Pesan</div>

          {conversations.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              Belum ada percakapan
            </p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/chat/${c.id}`)}
                className="px-4 py-3 cursor-pointer hover:bg-primary-50 border-b"
              >
                <div className="font-medium">
                  {c.companyName || c.jobSeekerName}
                </div>
                <div className="text-sm text-text-secondary truncate">
                  {c.lastMessageContent}
                </div>
                {c.unreadCount > 0 && (
                  <span className="text-xs bg-primary-300 text-white px-2 rounded-full">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="w-2/3 flex items-center justify-center bg-muted">
          <p className="text-text-secondary text-center">
            Pilih percakapan untuk mulai chat
          </p>
        </div>
      </div>
    </div>
  );
}
