import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} InternSieve. AI-powered internship evaluation.</p>
        <p className="text-xs text-slate-400">Built with React + TailwindCSS + LangChain</p>
      </div>
    </footer>
  );
}
