import { useState, ChangeEvent, FormEvent } from 'react';
import { RegisterCredentials, RegisterFormErrors } from '../types/auth';
import authService from '../services/authService';

interface UseRegisterFormProps {
  onSuccess?: () => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps = {}) {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateField = (name: keyof RegisterCredentials, value: any): string | undefined => {
    if (name === 'name') {
      if (!value.trim()) return 'Please enter your full name';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
    }
    if (name === 'email') {
      if (!value.trim()) return 'Please enter your email address';
      if (!isValidEmail(value)) return 'Please enter a valid email address';
    }
    if (name === 'password') {
      if (!value) return 'Please enter a password';
      if (value.length < 8) return 'Password must be at least 8 characters';
    }
    if (name === 'confirmPassword') {
      if (!value) return 'Please confirm your password';
      if (value !== credentials.password) return 'Passwords do not match';
    }
    if (name === 'agreeTerms') {
      if (!value) return 'You must agree to the Terms & Conditions';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    const nameErr = validateField('name', credentials.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateField('email', credentials.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validateField('password', credentials.password);
    if (passErr) newErrors.password = passErr;

    const confirmErr = validateField('confirmPassword', credentials.confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    const termsErr = validateField('agreeTerms', credentials.agreeTerms);
    if (termsErr) newErrors.agreeTerms = termsErr;

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

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        general: undefined,
      }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const errorMsg = validateField(name as keyof RegisterCredentials, fieldValue);

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
      await authService.register(credentials);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please try again.',
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
        general: `Sign up with ${provider} failed.`,
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

export default useRegisterForm;
