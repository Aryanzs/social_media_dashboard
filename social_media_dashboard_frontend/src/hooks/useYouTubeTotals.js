// src/hooks/useYouTubeTotals.js
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

/**
 * useYouTubeTotals
 * ----------------
 * @param {boolean} connected   – true once YouTube OAuth is linked
 * @param {object}  options
 *   onExpired : () => void     – called when backend returns 401 (session expired)
 */
export default function useYouTubeTotals(
  connected,
  { onExpired } = {}
) {
  const [totals,  setTotals]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // we keep a ref so we can cancel axios on unmount
  const cancelSrcRef = useRef(null);

  /** --------------------------------------------
   * fetchTotals – pulls /api/youtube/analytics
   * ------------------------------------------- */
  const fetchTotals = useCallback(async () => {
    if (!connected) {
      // if user just disconnected, clear previous data
      setTotals(null);
      return;
    }

    // cancel any in-flight request
    cancelSrcRef.current?.cancel?.();

    const src = axios.CancelToken.source();
    cancelSrcRef.current = src;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("http://localhost:5000/api/youtube/analytics", {
        cancelToken: src.token,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTotals(data);
    } catch (err) {
      if (axios.isCancel(err)) return;           // component unmounted

      if (err.response?.status === 401) {
        // backend cleared tokens → session expired
        onExpired?.();
      }
      setError(
        err.response?.data?.msg || "Failed to fetch YouTube analytics."
      );
    } finally {
      setLoading(false);
    }
  }, [connected, onExpired]);

  /** fetch on mount & whenever "connected" flips */
  useEffect(() => {
    fetchTotals();
    return () => cancelSrcRef.current?.cancel?.(); // cleanup
  }, [fetchTotals]);

  return { totals, loading, error, refresh: fetchTotals };
}
