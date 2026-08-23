import { useState, useEffect, useCallback, useMemo } from "react";
import adminService from "../services/adminService";
import { AdminUserItem, UserRole } from "../types/admin.types";
import { toast } from "react-hot-toast";

const MOCK_USERS: AdminUserItem[] = [
  { _id: "usr_101", email: "admin@ai-resume.com", name: "System Admin", role: "admin", isActive: true, createdAt: "2026-01-15T08:00:00Z" },
  { _id: "usr_102", email: "anguyen@gmail.com", name: "Nguyen Van A", role: "user", isActive: true, createdAt: "2026-02-10T10:15:00Z" },
  { _id: "usr_103", email: "btran@tech.io", name: "Tran Thi B", role: "user", isActive: true, createdAt: "2026-03-01T14:20:00Z" },
  { _id: "usr_104", email: "cle@startup.vn", name: "Le Hoang C", role: "moderator", isActive: true, createdAt: "2026-03-12T09:45:00Z" },
  { _id: "usr_105", email: "dpham@dev.net", name: "Pham Minh D", role: "user", isActive: false, createdAt: "2026-04-05T11:30:00Z" },
  { _id: "usr_106", email: "ehoang@ai.org", name: "Hoang Van E", role: "user", isActive: true, createdAt: "2026-05-18T16:05:00Z" },
  { _id: "usr_107", email: "fvu@cyber.com", name: "Vu Quoc F", role: "user", isActive: true, createdAt: "2026-06-22T13:50:00Z" },
  { _id: "usr_108", email: "gdo@finance.io", name: "Do Thi G", role: "moderator", isActive: true, createdAt: "2026-07-10T17:10:00Z" },
];

export function useAdminUsers(initialPage = 1, limit = 10) {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);


  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.manageUsers({
        action: "list",
        page,
        limit,
      });

      if (res?.data && "users" in res.data) {
        setUsers(res.data.users || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
        setIsUsingMock(false);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend API unavailable, displaying mock users for demo:", err);
      setUsers(MOCK_USERS);
      setTotal(MOCK_USERS.length);
      setPages(1);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const toggleUserStatus = async (user: AdminUserItem) => {
    setActionLoading(true);
    const action = user.isActive ? "deactivate" : "activate";
    try {
      if (!isUsingMock) {
        await adminService.manageUsers({
          action,
          userId: user._id,
        });
      }
    
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
      );
      toast.success(`User ${user.name} has been ${action === "activate" ? "activated" : "deactivated"}.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
      setIsStatusModalOpen(false);
      setSelectedUser(null);
    }
  };

  const updateUserRole = async (user: AdminUserItem, newRole: UserRole) => {
    setActionLoading(true);
    try {
      if (!isUsingMock) {
        await adminService.manageUsers({
          action: "updateRole",
          userId: user._id,
          role: newRole,
        });
      }
      
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
      toast.success(`User ${user.name}'s role updated to ${newRole.toUpperCase()}.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user role");
    } finally {
      setActionLoading(false);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    }
  };

  return {
    users: filteredUsers,
    rawUsers: users,
    total,
    page,
    pages,
    loading,
    searchTerm,
    roleFilter,
    statusFilter,
    isUsingMock,
    selectedUser,
    isRoleModalOpen,
    isStatusModalOpen,
    actionLoading,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setPage,
    setSelectedUser,
    setIsRoleModalOpen,
    setIsStatusModalOpen,
    toggleUserStatus,
    updateUserRole,
    refetch: fetchUsers,
  };
}

export default useAdminUsers;
