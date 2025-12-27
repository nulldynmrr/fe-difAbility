"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams, useRouter } from "next/navigation";
import request from "@/utils/request";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const { conversationId } = useParams();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const clientRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await request.get("/auth/me");
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Error fetching current user:", err);
        toast.error("Gagal memuat data user");
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const fetchConversation = async () => {
      try {
        const res = await request.get(`/chat/conversations/${conversationId}`);
        setConversation(res.data);
      } catch (err) {
        console.error("Error fetching conversation:", err);
        toast.error("Gagal memuat percakapan");
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await request.get(
          `/chat/conversations/${conversationId}/messages`
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast.error("Gagal memuat pesan");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_HOST}/ws`),
      onConnect: () => {
        console.log("WebSocket connected");
        setConnected(true);

        client.subscribe(`/topic/conversation/${conversationId}`, (msg) => {
          const newMsg = JSON.parse(msg.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
        toast.error("Koneksi chat terputus");
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        setConnected(false);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!connected || !clientRef.current) {
      toast.error("Koneksi chat belum siap");
      return;
    }

    try {
      clientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          conversationId: Number(conversationId),
          messageContent: newMessage,
        }),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Gagal mengirim pesan");
    }
  };

  // Hanya simpan id di state, tidak ditampilkan di UI
  const chatTargetName =
    currentUser?.role === "JOBSEEKER"
      ? conversation?.companyName || "HR"
      : conversation?.jobSeekerName || "Kandidat";

  const chatTargetId =
    currentUser?.role === "JOBSEEKER"
      ? conversation?.companyId
      : conversation?.jobSeekerId;

  const canSendMessage = Boolean(conversation) && connected;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat percakapan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen border">
      {conversation && (
        <div
          className="border-b py-4 px-62 cursor-pointer hover:bg-gray-50 transition-colors bg-bg flex items-center gap-4"
          onClick={() => router.push(`/profile/${chatTargetId}`)}
        >
          <ArrowLeft
            className="w-5 h-5 text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              router.back();
            }}
          />
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{chatTargetName}</p>
              <p className="text-sm text-gray-500">{conversation.jobTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-xs text-gray-500">
                {connected ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-12 px-62 bg-gray-50 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              Belum ada pesan.
              <br />
              Mulai percakapan sekarang!
            </p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = m.senderId === currentUser?.id;
            return (
              <div
                key={m.id || idx}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[50%] p-3 rounded-xl  ${
                    isMe
                      ? "bg-blue-500 text-secondary rounded-br-none"
                      : "bg-bg-card text-gray-800 rounded-bl-none border"
                  }`}
                >
                  <p className="break-words">{m.messageContent}</p>
                  {m.timestamp && (
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(m.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {canSendMessage ? (
        <div className="border-t flex gap-2 py-4 px-62 bg-secondary">
          <input
            className="bg-bg-card flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ketik pesan..."
            disabled={!connected}
          />
          <button
            onClick={sendMessage}
            disabled={!connected || !newMessage.trim()}
            className={`px-6 rounded-lg font-medium transition-colors ${
              !connected || !newMessage.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-secondary hover:bg-blue-600"
            }`}
          >
            Kirim
          </button>
        </div>
      ) : (
        <div className="border-t p-4 bg-gray-100 text-center text-gray-500">
          {!connected ? "Menghubungkan..." : "Memuat percakapan..."}
        </div>
      )}
    </div>
  );
}
