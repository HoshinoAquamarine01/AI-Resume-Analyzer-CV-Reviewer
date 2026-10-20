export type ActivityActionCategory = 
  | "all"
  | "auth"
  | "resume"
  | "coverletter"
  | "interview"
  | "user"
  | "payment";

export interface ActivityLogItem {
  _id: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface ActivityLogApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    activity: ActivityLogItem[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  
  activity?: ActivityLogItem[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export interface ActivityFilterState {
  category: ActivityActionCategory;
  search: string;
  page: number;
  limit: number;
}

export interface ActivityStats {
  totalCount: number;
  latestTime: string | null;
  primaryCategory: string;
  lastIp: string;
}
