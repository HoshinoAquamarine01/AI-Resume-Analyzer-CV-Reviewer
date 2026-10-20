import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import RememberMe from './RememberMe';
import SocialLogin from './SocialLogin';
import useLoginForm from '../../hooks/useLoginForm';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSocialLogin,
  } = useLoginForm({
    onSuccess: () => {
  
      navigate('/dashboard');
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" noValidate>
      
      {errors.general && (
        <Alert
          type="error"
          message={errors.general}
          onClose={() => {
          
          }}
        />
      )}

     
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="name@company.com"
        value={credentials.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        disabled={isLoading}
        leftIcon={<Mail className="w-4 h-4" />}
        autoComplete="email"
        required
      />

  
      <PasswordInput
        label="Password"
        name="password"
        placeholder="••••••••"
        value={credentials.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        disabled={isLoading}
        autoComplete="current-password"
        required
      />


      <RememberMe
        checked={credentials.rememberMe || false}
        onChange={handleChange}
        disabled={isLoading}
      />

     
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-2"
      >
        Sign In
      </Button>

  
      <SocialLogin
        onGoogleLogin={() => handleSocialLogin('google')}
        onGithubLogin={() => handleSocialLogin('github')}
        isLoading={isLoading}
      />

     
      <div className="text-center text-xs sm:text-sm text-slate-400 mt-4">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded px-1"
        >
          Sign up for free
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
