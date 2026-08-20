import axiosInstance from "./axiosInstance";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
  targetRole?: string;
  location?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateSettingsPayload {
  emailCvAnalysis?: boolean;
  emailWeeklyReport?: boolean;
  emailMarketing?: boolean;
  browserNotifications?: boolean;
  name?: string;
  phoneNumber?: string;
}

export const userService = {
  getProfile: async () => {
    const response = await axiosInstance.get("/api/user/profile");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const response = await axiosInstance.put("/api/user/profile", payload);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axiosInstance.post("/api/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await axiosInstance.post("/api/user/change-password", payload);
    return response.data;
  },

  getSubscription: async () => {
    const response = await axiosInstance.get("/api/user/subscription");
    return response.data;
  },

  getSettings: async () => {
    const response = await axiosInstance.get("/api/user/settings");
    return response.data;
  },

  updateSettings: async (payload: UpdateSettingsPayload) => {
    const response = await axiosInstance.put("/api/user/settings", payload);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await axiosInstance.delete("/api/user/account");
    return response.data;
  },
};

export default userService;
