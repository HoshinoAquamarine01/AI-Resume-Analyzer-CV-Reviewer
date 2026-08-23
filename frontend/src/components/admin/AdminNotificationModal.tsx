import React, { useState } from "react";
import adminService from "../../services/adminService";
import { Megaphone, X, Send, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface AdminNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success">("info");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and notification content.");
      return;
    }

    setLoading(true);
    try {
      await adminService.sendNotification({
        action: "broadcast",
        title,
        message,
        type,
      });
      toast.success("Broadcast notification sent successfully to all users!");
      setTitle("");
      setMessage("");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-gray-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Broadcast System Announcement</h3>
            <p className="text-xs text-gray-400">Send an in-app push alert to all registered users</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Notification Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "info", label: "Info Alert", icon: Info, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
                { id: "warning", label: "System Maintenance", icon: AlertCircle, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
                { id: "success", label: "New Feature", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? t.color + " shadow-md"
                        : "border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Announcement Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New AI Model Update v2.5 released!"
              className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Announcement Details</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the system update, scheduled downtime, or promotion..."
              className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Broadcast Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNotificationModal;
