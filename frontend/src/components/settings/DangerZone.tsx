import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import userService from "../../services/userService";

export const DangerZone: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type 'DELETE' exactly to confirm.");
      return;
    }

    setIsDeleting(true);

    try {
      await userService.deleteAccount();
      toast.success("Account and all associated data deleted successfully.");
      setIsModalOpen(false);
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err: any) {
      console.error("Account deletion error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to delete account. Please try again.";
      toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm mt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-200">Danger Zone</h3>
            <p className="text-xs text-slate-400">Irreversible actions that permanently wipe your data from the database.</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-200">Delete Account & Permanent Data Purge</p>
            <p className="text-[11px] text-slate-400">
              All uploaded CV files, ATS score reports, cover letters, and interview sessions will be deleted from the database.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 rounded-xl transition-all duration-200 flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Permanent Account Deletion">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            This action <strong className="text-red-400">cannot be undone</strong>. To proceed with purging your account and files, type{" "}
            <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono">DELETE</strong> in the box below:
          </p>

          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full text-sm text-slate-100 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmText !== "DELETE"}
              className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md shadow-red-600/20"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DangerZone;
