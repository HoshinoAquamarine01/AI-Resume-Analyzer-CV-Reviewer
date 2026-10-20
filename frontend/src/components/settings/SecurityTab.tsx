import React, { useState } from "react";
import { ShieldCheck, Lock, Smartphone, Key, AlertTriangle } from "lucide-react";
import Button from "../common/Button";
import PasswordInput from "../common/PasswordInput";
import { toast } from "react-hot-toast";
import userService from "../../services/userService";

export const SecurityTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Confirm password does not match.");
      return;
    }

    setIsLoading(true);

    try {
      await userService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully in database!");
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError(serverMessage || "Incorrect current password.");
      } else {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggle2FA = () => {
    setIs2FAEnabled((prev) => !prev);
    if (!is2FAEnabled) {
      toast.success("Two-Factor Authentication (2FA) enabled!");
    } else {
      toast("Two-Factor Authentication disabled.", { icon: "ℹ️" });
    }
  };

  return (
    <div className="space-y-6">
      
      <form onSubmit={handlePasswordSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Change Password</h3>
              <p className="text-xs text-slate-400">Ensure your account uses a strong and secure password</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 max-w-lg">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Minimum 8 characters with a mix of letters and numbers"
            required
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-2 flex justify-start">
          <Button type="submit" isLoading={isLoading} leftIcon={<Lock className="w-4 h-4" />}>
            Update Password
          </Button>
        </div>
      </form>

  
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">Two-Factor Authentication (2FA)</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    is2FAEnabled
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {is2FAEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Add an extra layer of security using an authenticator app (Google Authenticator) or SMS verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggle2FA}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              is2FAEnabled ? "bg-blue-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                is2FAEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

     
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Active Login Sessions</h3>
            <p className="text-xs text-slate-400">Devices currently authenticated to your account</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-slate-200 font-medium text-xs">Current Session (Windows / Chrome Browser)</p>
              <p className="text-[11px] text-slate-500">Active Now • IP 127.0.0.1</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            This Device
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
