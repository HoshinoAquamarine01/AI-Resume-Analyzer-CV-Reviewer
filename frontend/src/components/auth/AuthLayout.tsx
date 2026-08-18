import React from 'react';
import { Star, ShieldCheck, Zap, Award } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
 
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

    
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

  
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-950/70 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden min-h-[640px]">
       
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center w-full">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>

 
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-slate-950 p-10 flex-col justify-between border-l border-slate-800/60 overflow-hidden">
      
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

     
          <div className="relative z-10 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit">
              <Zap className="w-3.5 h-3.5" />
              <span>AI Engine v2.4 Active</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
              Optimize your CV for ATS in seconds
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Triple your interview callbacks with deep keyword optimization and AI-driven skill matching.
            </p>
          </div>

       
          <div className="relative z-10 grid grid-cols-2 gap-3 my-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-1">
                <Award className="w-4 h-4" />
                <span>ATS Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-white">99.4%</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Data Privacy</span>
              </div>
              <div className="text-2xl font-bold text-white">100%</div>
            </div>
          </div>

          
          <div className="relative z-10 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
              "AI Resume Analyzer spotted key gaps in my Senior Frontend CV. I landed 4 interview calls within just one week!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-blue-500/40"
              />
              <div>
                <div className="text-xs font-bold text-white">Alex Johnson</div>
                <div className="text-[11px] text-slate-400">Software Engineer @ Tech Corp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
