import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginCredentials, LoginFormErrors } from '../types/auth';
import authService from '../services/authService';

interface UseLoginFormProps {
  onSuccess?: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps = {}) {
  const [searchParams] = useSearchParams();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setErrors((prev) => ({
        ...prev,
        general: decodeURIComponent(errorParam),
      }));
    }
  }, [searchParams]);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateField = (name: keyof LoginCredentials, value: any): string | undefined => {
    if (name === 'email') {
      if (!value.trim()) return 'Please enter your email address';
      if (!isValidEmail(value)) return 'Please enter a valid email address';
    }
    if (name === 'password') {
      if (!value) return 'Please enter your password';
      if (value.length < 6) return 'Password must be at least 6 characters';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    const emailErr = validateField('email', credentials.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validateField('password', credentials.password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setCredentials((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        general: undefined,
      }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name as keyof LoginCredentials, value);

    if (errorMsg) {
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await authService.login(credentials);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrors({
        general: err.message || 'Login failed. Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setErrors({});
    try {
      await authService.loginWithProvider(provider);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrors({
        general: `Sign in with ${provider} failed.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSocialLogin,
    setErrors,
  };
}

export default useLoginForm;
