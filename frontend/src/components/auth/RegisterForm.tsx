import React from 'react';
import { User as UserIcon, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import SocialLogin from './SocialLogin';
import useRegisterForm from '../../hooks/useRegisterForm';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSocialLogin,
  } = useRegisterForm({
    onSuccess: () => {
     
      navigate('/dashboard');
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full" noValidate>
   
      {errors.general && (
        <Alert
          type="error"
          message={errors.general}
          onClose={() => {}}
        />
      )}

     
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="Alex Johnson"
        value={credentials.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        disabled={isLoading}
        leftIcon={<UserIcon className="w-4 h-4" />}
        autoComplete="name"
        required
      />

    
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
        placeholder="At least 8 characters"
        value={credentials.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        disabled={isLoading}
        autoComplete="new-password"
        required
      />

   
      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Re-enter your password"
        value={credentials.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        disabled={isLoading}
        autoComplete="new-password"
        required
      />

   
      <div className="flex flex-col gap-1 py-0.5">
        <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-300 hover:text-slate-100 transition-colors">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={credentials.agreeTerms}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 mt-0.5 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950 focus:ring-2 cursor-pointer transition shrink-0"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-xs text-red-400 font-medium ml-6">• {errors.agreeTerms}</p>
        )}
      </div>


      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-1"
      >
        Create Account
      </Button>

    
      <SocialLogin
        onGoogleLogin={() => handleSocialLogin('google')}
        onGithubLogin={() => handleSocialLogin('github')}
        isLoading={isLoading}
      />

  
      <div className="text-center text-xs sm:text-sm text-slate-400 mt-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded px-1"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
