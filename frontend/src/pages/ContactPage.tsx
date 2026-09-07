import React, { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

export interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    category: "general",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please write a message before submitting.");
      return;
    }

    setIsLoading(true);

    try {
     
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      toast.success("Thank you! Your message has been sent successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      category: "general",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
    
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
     
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Dedicated Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Hear from You</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have a question about our AI resume analysis, custom billing plans, or technical feedback? 
            Fill out the form below and our engineering team will get back to you within 2 hours.
          </p>
        </div>

    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                Contact Information
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reach out to us directly or drop your message using the form. Our support team is active round the clock.
              </p>

              <div className="space-y-5 pt-2">
               
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300">Direct Email</h4>
                    <p className="text-sm font-medium text-white">support@cvpulse.ai</p>
                    <span className="text-[11px] text-emerald-400 font-medium">Avg response time: &lt; 2 hrs</span>
                  </div>
                </div>

              
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300">Operating Hours</h4>
                    <p className="text-sm font-medium text-white">Mon – Fri: 8:00 AM – 8:00 PM EST</p>
                    <span className="text-[11px] text-slate-400">Weekend emergency ticketing active</span>
                  </div>
                </div>

                
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300">Headquarters</h4>
                    <p className="text-sm font-medium text-white">100 Innovation Way, Suite 400</p>
                    <span className="text-[11px] text-slate-400">San Francisco, CA 94105, USA</span>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Support Systems Active</p>
                  <p className="text-[11px] text-slate-400">Live agents online & ready to assist</p>
                </div>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-7">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                      Thank you for contacting us, <span className="text-emerald-400 font-semibold">{formData.name}</span>. 
                      Our team has received your ticket and will respond to <span className="text-white font-medium">{formData.email}</span> shortly.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all duration-200"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">Send Us a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Full Name <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                  
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Email Address <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="sarah@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Inquiry Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support / Bug Report</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Business Partnership</option>
                    </select>
                  </div>

                
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief title of your request..."
                      className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>

                
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Message <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your question or details of your request..."
                      className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-950/40"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

     
      <Footer />
    </div>
  );
};

export default ContactPage;
