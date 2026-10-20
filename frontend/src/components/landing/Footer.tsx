import React from "react";
import { Link } from "react-router-dom";
import { FileSearch, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070a10] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md">
                <FileSearch className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-extrabold text-white flex items-center gap-1">
                CV<span className="text-emerald-400">Pulse</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              The next-generation Resume Analyzer & Career Copilot helping professionals beat ATS filters and land high-paying roles.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All Parser Systems Operational</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Resume Analyzer
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors">
                  ATS Match Checker
                </a>
              </li>
              <li>
                <Link to="/cover-letter" className="hover:text-white transition-colors">
                  Cover Letter Writer
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-white transition-colors">
                  Interview Predictor
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/faq" className="hover:text-emerald-400 transition-colors text-emerald-400/90 font-medium">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  ATS Keywords Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Resume Bullet Examples
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tech Career Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Free CV Templates
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CVPulse. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for job seekers worldwide.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
