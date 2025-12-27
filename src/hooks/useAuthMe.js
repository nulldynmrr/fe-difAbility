import { useEffect, useState, useCallback } from "react";
import request from "@/utils/request";
import { toast } from "sonner";

export function useAuthMe() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get("/auth/me");
      setUser(res.data ?? null);
    } catch (error) {
      setUser(null);
      toast.error("Gagal mengambil data profil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const res = await request.get("/auth/me");
        if (isMounted) {
          setUser(res.data ?? null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, refetch: fetchUser };
}
