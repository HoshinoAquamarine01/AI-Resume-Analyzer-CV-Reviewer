import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginHeader
        title="Welcome Back"
        subtitle="Sign in to access your AI-powered resume analysis and CV optimization platform"
      />
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
