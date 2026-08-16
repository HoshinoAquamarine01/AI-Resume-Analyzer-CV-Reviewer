import React from "react";

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 rounded-2xl border border-indigo-500/20 max-w-md text-center">
        <h1 className="font-heading font-extrabold text-3xl mb-2 gradient-text">
          ResumeIQ-AI Frontend
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Vite + React TSX environment is set up and ready for development.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          🚀 Ready to build!
        </div>
      </div>
    </div>
  );
}

export default App;
