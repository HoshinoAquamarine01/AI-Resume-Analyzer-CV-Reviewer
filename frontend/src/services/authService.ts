// Placeholder for auth service
import axiosInstance from './axiosInstance'
export interface RegisterPayLoad {
    email: string;
    password: string;
    name:string,
    phoneNumber?: string
}
export interface LoginPayLoad{
    email: string,
    password:string
}
export const authService = {
    register: async (payload:RegisterPayLoad) =>{
        const response = await axiosInstance.post('/api/auth/register', payload)
        return response.data
    },
    login: async (payload:LoginPayLoad) =>{
        const response = await axiosInstance.post('/api/auth/login', payload)
        return response.data
    },

    logout: async () =>{
        const response = await axiosInstance.post('/api/auth/logout')
        return response.data
    },
    forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/api/auth/forgot-password', { email });
    return response.data;
    },

}  
export default authService;