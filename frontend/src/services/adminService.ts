import axiosInstance from './axiosInstance';
export interface ManageUsersPayLoad {
    action: 'block' | 'unblock' | 'changeRole' | 'delete',
    userId: string
    role?: string
}
export const adminService = {
    getDashboard: async () => {
        const response = await axiosInstance.get('/api/admin/dashboard')
        return response.data
    },
    manageUser: async (payload: ManageUsersPayLoad) => {
        const response = await axiosInstance.post('/api/admin/users/manage', payload);
        return response.data;
    },
    getLogs: async (type: string) => {
        const response = await axiosInstance.get('/api/admin/logs', {
            params: { type },
        });
        return response.data;
    }

}
export default adminService
