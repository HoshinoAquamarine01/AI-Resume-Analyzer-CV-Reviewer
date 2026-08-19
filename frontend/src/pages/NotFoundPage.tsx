import React from "react";
import {Link} from 'react-router-dom'
import { FileQuestion, LayoutDashboard, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4">
      <div className="text-center mb-10">
        <div className="w-14 h-14 mb-6 flex items-center justify-center mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner backdrop-blur-sm">
          <FileQuestion size={24}/>
        </div>
        <span className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 block">404</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white mb-2">Page Not Found</h1>
          <p className="text-slate-400">We couldn't find the page you're looking for.</p>
        </div>
      </div>
      <div className="space-y-4 w-full max-w-xs">
      <Link to="/dashboard" className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-slate-400 hover:text-white hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
        <LayoutDashboard size={18}/>
        <span className="text-white">Back to Dashboard</span>
      </Link>
      <Link to="/" className="flex items-center justify-center gap-2 px-4 py-3 text-slate-300 bg-slate-800/60 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50">
        <Home size={18}/> 
        <span className="text-white">Back to Home</span>
      </Link>
      </div>
    </main>
  )
};

export default NotFoundPage;
