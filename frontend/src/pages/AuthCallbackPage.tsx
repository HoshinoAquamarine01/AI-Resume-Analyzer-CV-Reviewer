import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error(decodeURIComponent(error));
        navigate('/login', { replace: true });
        return;
      }

      if (!token) {
        toast.error('Authentication token not received.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        localStorage.setItem('token', token);

        // Fetch current user details to cache in local storage
        try {
          const profileRes = await userService.getProfile();
          const userData = profileRes?.data || profileRes;
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch {
          // If fetching profile fails, still proceed to dashboard with token
        }

        toast.success('Signed in with Google successfully!');
        navigate('/dashboard', { replace: true });
      } catch (err: any) {
        console.error('Failed to complete Google login:', err);
        toast.error('Failed to finalize login session.');
        navigate('/login', { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl relative">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Authenticating with Google...</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        Please wait a moment while we verify your Google credentials and prepare your workspace.
      </p>
    </div>
  );
};

export default AuthCallbackPage;
