import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginHeader from '../components/auth/LoginHeader';
import RegisterForm from '../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginHeader
        title="Create Your Account"
        subtitle="Start optimizing your resume for ATS with AI in seconds"
      />
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
