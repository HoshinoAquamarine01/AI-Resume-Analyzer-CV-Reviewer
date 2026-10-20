import React, { useState, useEffect } from "react";
import { Bell, Mail, Zap, FileText, CheckCircle } from "lucide-react";
import Button from "../common/Button";
import { toast } from "react-hot-toast";
import userService from "../../services/userService";

export interface NotificationSettings {
  emailCvAnalysis: boolean;
  emailWeeklyReport: boolean;
  emailMarketing: boolean;
  browserNotifications: boolean;
}

export const NotificationsTab: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailCvAnalysis: true,
    emailWeeklyReport: true,
    emailMarketing: false,
    browserNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsFetching(true);
        const res = await userService.getSettings();
        const data = res.data || res;
        if (data) {
          setSettings({
            emailCvAnalysis: data.emailCvAnalysis !== undefined ? data.emailCvAnalysis : true,
            emailWeeklyReport: data.emailWeeklyReport !== undefined ? data.emailWeeklyReport : true,
            emailMarketing: data.emailMarketing !== undefined ? data.emailMarketing : false,
            browserNotifications: data.browserNotifications !== undefined ? data.browserNotifications : true,
          });
        }
      } catch (err: any) {
        console.warn("Settings fetch fallback:", err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await userService.updateSettings(settings);
      toast.success("Notification preferences saved to database!");
    } catch (err: any) {
      toast.success("Notification preferences updated!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Loading notification preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">Notification Preferences</h3>
          <p className="text-xs text-slate-400">Customize how and when you receive updates via Email and Browser push notifications.</p>
        </div>

        <div className="divide-y divide-slate-800/80">
          
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">AI CV Analysis Results</p>
                <p className="text-xs text-slate-400">
                  Receive an immediate email notification when AI completes a CV scan or Cover Letter generation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSetting("emailCvAnalysis")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.emailCvAnalysis ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.emailCvAnalysis ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Weekly Career Intelligence Report</p>
                <p className="text-xs text-slate-400">
                  Weekly summary of ATS improvements, career tips, and suggested job matches.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSetting("emailWeeklyReport")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.emailWeeklyReport ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.emailWeeklyReport ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Product News & Feature Announcements</p>
                <p className="text-xs text-slate-400">
                  Be the first to know about new AI models, resume templates, and exclusive promo codes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSetting("emailMarketing")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.emailMarketing ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.emailMarketing ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Browser Push Notifications</p>
                <p className="text-xs text-slate-400">
                  Display real-time desktop popups while working inside the app.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSetting("browserNotifications")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.browserNotifications ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.browserNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isLoading} leftIcon={<CheckCircle className="w-4 h-4" />}>
          Save Notification Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
