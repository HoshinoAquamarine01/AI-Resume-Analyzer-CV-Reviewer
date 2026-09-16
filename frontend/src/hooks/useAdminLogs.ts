import { useState, useEffect, useCallback } from "react";
import adminService from "../services/adminService";
import { AdminLog } from "../types/admin.types";

const MOCK_LOGS: AdminLog[] = [
  {
    _id: "log_1",
    adminId: { _id: "admin_1", name: "System Admin", email: "admin@ai-resume.com" },
    action: "USER_ACTIVATED",
    targetUserId: "usr_102",
    details: '{"targetEmail": "anguyen@gmail.com"}',
    createdAt: "2026-08-23T12:30:00Z",
  },
  {
    _id: "log_2",
    adminId: { _id: "admin_1", name: "System Admin", email: "admin@ai-resume.com" },
    action: "ROLE_UPDATED",
    targetUserId: "usr_104",
    details: '{"newRole": "moderator"}',
    createdAt: "2026-08-23T11:15:00Z",
  },
  {
    _id: "log_3",
    adminId: { _id: "admin_1", name: "System Admin", email: "admin@ai-resume.com" },
    action: "SETTING_UPDATED",
    details: '{"setting": "maxFreeResumes", "value": 5}',
    createdAt: "2026-08-22T16:45:00Z",
  },
  {
    _id: "log_4",
    adminId: { _id: "admin_1", name: "System Admin", email: "admin@ai-resume.com" },
    action: "BROADCAST_SENT",
    details: '{"title": "System Maintenance Notice"}',
    createdAt: "2026-08-21T09:00:00Z",
  },
];

export function useAdminLogs(logType: string = "logs") {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<string>(logType);
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getLogs(typeFilter);
      if (res?.data && Array.isArray(res.data)) {
        setLogs(res.data);
        setIsUsingMock(false);
      } else {
        throw new Error("Invalid log format");
      }
    } catch (err) {
      console.warn("Backend logs unavailable, showing mock audit logs:", err);
      setLogs(MOCK_LOGS);
      setIsUsingMock(true);
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
    typeFilter,
    isUsingMock,
    setTypeFilter,
    refetch: fetchLogs,
  };
}

export default useAdminLogs;
