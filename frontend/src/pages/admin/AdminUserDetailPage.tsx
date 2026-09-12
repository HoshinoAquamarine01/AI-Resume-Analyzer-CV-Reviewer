import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import {
  AdminUserItem,
  AdminSubscriptionItem,
  AdminResumeItem,
  AdminActivityItem,
  UserRole,
} from "../../types/admin.types";

import UserDetailHeader from "../../components/admin/user-detail/UserDetailHeader";
import UserProfileForm from "../../components/admin/user-detail/UserProfileForm";
import UserSubscriptionCard from "../../components/admin/user-detail/UserSubscriptionCard";
import UserResumesList from "../../components/admin/user-detail/UserResumesList";
import UserActivityTimeline from "../../components/admin/user-detail/UserActivityTimeline";

export const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [user, setUser] = useState<AdminUserItem | null>(null);
  const [subscription, setSubscription] = useState<AdminSubscriptionItem | null>(null);
  const [resumes, setResumes] = useState<AdminResumeItem[]>([]);
  const [totalResumes, setTotalResumes] = useState<number>(0);
  const [activities, setActivities] = useState<AdminActivityItem[]>([]);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole>("user");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "premium">("free");
  const [daysToAdd, setDaysToAdd] = useState<number>(30);

  const fetchUserDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await adminService.getUserDetail(id);
      const data = res.data || res;

      setUser(data.user || null);
      setSubscription(data.subscription || null);
      setResumes(data.resumes || []);
      setTotalResumes(data.totalResumes || 0);
      setActivities(data.activities || []);

      if (data.user) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setRole(data.user.role || "user");
        setIsActive(data.user.isActive ?? true);
      }

      if (data.subscription?.plan) {
        setSelectedPlan(data.subscription.plan);
      }
    } catch (err: any) {
      console.error("Failed to load user details:", err);
      toast.error(err?.response?.data?.message || "Failed to load user details from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const handleSaveUser = async () => {
    if (!id) return;
    try {
      setSaving(true);
      const payload = {
        name,
        email,
        role,
        isActive,
        plan: selectedPlan,
        daysToAdd,
      };

      const res = await adminService.updateUserDetail(id, payload);
      toast.success("User details and subscription plan updated successfully!");
      fetchUserDetail();
    } catch (err: any) {
      console.error("Failed to update user details:", err);
      toast.error(err?.response?.data?.message || "Failed to update user details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-blue-400">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="text-sm font-semibold text-gray-400">Loading user profile & subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      <UserDetailHeader
        user={user}
        saving={saving}
        onSave={handleSaveUser}
        onRefresh={fetchUserDetail}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <div className="lg:col-span-2 space-y-6">
          <UserProfileForm
            name={name}
            email={email}
            role={role}
            isActive={isActive}
            createdAt={user?.createdAt}
            onChangeName={setName}
            onChangeEmail={setEmail}
            onChangeRole={setRole}
            onToggleStatus={() => setIsActive(!isActive)}
          />

          <UserSubscriptionCard
            subscription={subscription}
            selectedPlan={selectedPlan}
            daysToAdd={daysToAdd}
            onPlanChange={setSelectedPlan}
            onDaysChange={setDaysToAdd}
          />

          <UserResumesList resumes={resumes} totalResumes={totalResumes} />
        </div>

        
        <div className="space-y-6">
          <UserActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
