import React from 'react';
import { Link } from 'react-router-dom';

export interface RememberMeProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  forgotPasswordHref?: string;
  disabled?: boolean;
}

export const RememberMe: React.FC<RememberMeProps> = ({
  checked,
  onChange,
  forgotPasswordHref = '/forgot-password',
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between text-xs sm:text-sm py-1">
      <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-slate-100 transition-colors">
        <input
          type="checkbox"
          name="rememberMe"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950 focus:ring-2 cursor-pointer transition"
        />
        <span>Remember me</span>
      </label>

      <Link
        to={forgotPasswordHref}
        className="font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded px-1"
      >
        Forgot password?
      </Link>
    </div>
  );
};

export default RememberMe;
