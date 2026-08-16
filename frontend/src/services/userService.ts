import axiosInstance from "./axiosInstance";

export const userService = {
  getProfile: async () => {
    const response = await axiosInstance.get('/api/user/profile')
    return response.data
  },
  updateProfile: async (payload: any) => {
    const response = await axiosInstance.put('/api/user/profile', payload)
    return response.data
  },
  changePassword: async (payload: any) => {
    const response = await axiosInstance.post('/api/user/change-password', payload);
    return response.data;
  },
  manageUser: async (payload: any) => {
    const response = await axiosInstance.put('/api/user/manage-user', payload)
    return response.data
  },


}
export default userService
