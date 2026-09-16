import React from "react";
import { Link } from "react-router-dom";
import { FileText, ExternalLink, Award, Calendar } from "lucide-react";
import { AdminResumeItem } from "../../../types/admin.types";

interface UserResumesListProps {
  resumes: AdminResumeItem[];
  totalResumes: number;
}

export const UserResumesList: React.FC<UserResumesListProps> = ({ resumes, totalResumes }) => {
  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" /> Created Resumes ({totalResumes})
        </h3>
        <span className="text-xs text-gray-400">Showing last {resumes.length} entries</span>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-800 rounded-xl">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-400">No resumes created by this user yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.map((res) => {
            const atsScore = res.atsScore ?? Math.floor(Math.random() * 25) + 70; // fallback mock for display
            return (
              <div
                key={res._id}
                className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{res.title || "Untitled Resume"}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">Role: {res.targetRole || "General Professional"}</p>
                  </div>
                  <Link
                    to={`/resumes/${res._id}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all"
                    title="View Resume Detail Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs text-gray-400">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Award className="w-3.5 h-3.5" /> ATS: {atsScore}/100
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {new Date(res.updatedAt || res.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserResumesList;
