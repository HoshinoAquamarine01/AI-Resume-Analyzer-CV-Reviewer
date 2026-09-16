import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  title = 'Welcome Back',
  subtitle = 'Enter your credentials to access your AI Resume Analyzer account',
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-8">
   
      <Link
        to="/"
        className="group flex items-center justify-center gap-2 mb-1 p-2 rounded-2xl transition-transform hover:scale-105"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
          CV AI Studio
        </span>
      </Link>

     
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        {title}
      </h1>

  
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default LoginHeader;
