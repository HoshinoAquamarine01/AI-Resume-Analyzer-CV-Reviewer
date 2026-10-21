import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileSearch, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090d16]/95 border-b border-slate-800/80 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shadow-md group-hover:border-emerald-500/50 transition-all">
              <FileSearch className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                CV<span className="text-emerald-400">Pulse</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest -mt-1 uppercase">
                ATS Resume Intelligence
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => handleScrollTo(e, "features")}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScrollTo(e, "how-it-works")}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#preview"
              onClick={(e) => handleScrollTo(e, "preview")}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Live Preview
            </a>
            <Link
              to="/about"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-600/30 transition-all duration-200 flex items-center gap-2 active:scale-95"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-4">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              onClick={(e) => handleScrollTo(e, "features")}
              className="text-base font-medium text-slate-300 hover:text-white py-1 cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScrollTo(e, "how-it-works")}
              className="text-base font-medium text-slate-300 hover:text-white py-1 cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#preview"
              onClick={(e) => handleScrollTo(e, "preview")}
              className="text-base font-medium text-slate-300 hover:text-white py-1 cursor-pointer"
            >
              Live Preview
            </a>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-300 hover:text-white py-1"
            >
              Pricing
            </Link>
          </nav>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-slate-300 hover:text-white py-2 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-center shadow-lg flex items-center justify-center gap-2"
            >
              Analyze My Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
