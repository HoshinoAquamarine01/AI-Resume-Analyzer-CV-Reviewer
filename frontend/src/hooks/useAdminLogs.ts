import { useState, useEffect, useCallback } from "react";
import adminService from "../services/adminService";
import { AdminLog } from "../types/admin.types";

export function useAdminLogs(logType: string = "logs") {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<string>(logType);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getLogs(typeFilter);
      setLogs(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      console.error("[useAdminLogs]", err);
      setError(err?.message || "Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    typeFilter,
    setTypeFilter,
    refetch: fetchLogs,
  };
}

export default useAdminLogs;
