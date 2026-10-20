
export type CareerLevel = "student" | "junior" | "mid" | "senior";

export interface UserProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phoneNumber?: string;
  avatarUrl?: string;
  subscriptionId?: string;
  resumeIds?: string[];
  linkedInUrl?: string;
  githubUrl?: string;
  careerLevel?: CareerLevel;
  preferredJobTitles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileDTO {
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  careerLevel?: CareerLevel;
  preferredJobTitles?: string[];
}

export interface UserActivityLog {
  id?: string;
  _id?: string;
  userId: string;
  action: string; 
  details?: Record<string, any> | string;
  ipAddress?: string;
  createdAt: string;
}

export interface UserSubscription {
  id?: string;
  _id?: string;
  userId: string;
  plan: "free" | "pro" | "enterprise";
  status: "pending" | "active" | "cancelled" | "expired";
  price: number;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  createdAt?: string;
}

export default UserProfile;
