import React, { useState, useEffect } from "react";
import { User, Mail, Briefcase, Phone, FileText, Camera, Save, MapPin } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { toast } from "react-hot-toast";
import userService from "../../services/userService";

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  targetRole: string;
  location: string;
  bio: string;
}

export const ProfileTab: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    email: "",
    phone: "",
    targetRole: "",
    location: "",
    bio: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  );
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const res = await userService.getProfile();
        const user = res.data || res;
        setFormData({
          fullName: user.name || user.fullName || "",
          email: user.email || "",
          phone: user.phoneNumber || user.phone || "",
          targetRole: user.targetRole || "",
          location: user.location || "",
          bio: user.bio || "",
        });
        if (user.avatarUrl || user.avatar) {
          setAvatarUrl(user.avatarUrl || user.avatar);
        }
      } catch (err: any) {
        console.warn("Backend profile fetch failed, using initial values:", err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setAvatarUrl(tempUrl);

    try {
      setIsAvatarUploading(true);
      const response = await userService.uploadAvatar(file);
      const updatedUser = response.data || response;
      if (updatedUser?.avatarUrl) {
        setAvatarUrl(updatedUser.avatarUrl);
      }
      toast.success("Avatar uploaded and saved successfully!");
    } catch (err: any) {
      console.warn("Avatar upload warning:", err.message);
      toast.success("Avatar preview updated!");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.updateProfile({
        name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        targetRole: formData.targetRole,
        location: formData.location,
        avatar: avatarUrl,
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      const serverMsg = err.response?.data?.message || err.message;
      toast.error(serverMsg || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Loading profile data from server...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
   
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-base font-semibold text-slate-100 mb-1">Profile Photo</h3>
        <p className="text-xs text-slate-400 mb-4">
          This avatar will be displayed on your personal dashboard and exported CV reports.
        </p>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/30 border border-slate-700 shadow-md"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200"
            >
              <Camera className="w-5 h-5 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isAvatarUploading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="avatar-upload">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                {isAvatarUploading ? "Uploading..." : "Upload New Photo"}
              </span>
            </label>
            <p className="text-[11px] text-slate-500">Supports JPG, PNG, or WEBP. Max 5MB.</p>
          </div>
        </div>
      </div>

     
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-100 mb-2">Personal Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
            placeholder="e.g. John Doe"
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            placeholder="email@example.com"
            disabled
            helperText="Account email cannot be changed"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="Target Job Title"
            name="targetRole"
            value={formData.targetRole}
            onChange={handleChange}
            leftIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
            placeholder="e.g. Senior Frontend Engineer"
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            placeholder="e.g. San Francisco, CA"
            containerClassName="md:col-span-2"
          />
        </div>


        <div className="flex flex-col gap-1.5 pt-2">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Professional Bio & Summary</span>
          </label>
          <textarea
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Brief summary of your professional background for AI optimization..."
            className="w-full text-sm text-slate-100 bg-slate-900/80 placeholder:text-slate-500 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-xl p-3 outline-none transition-all duration-200 resize-none"
          />
        </div>
      </div>

  
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileTab;
