import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="dark bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">filter_alt</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">InternSieve</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Features</a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Pricing</a>
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Login</Link>
              <Link to="/login" className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-primary/20">
                  Get Started
              </Link>
            </nav>
            <button className="md:hidden text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <main className="flex-1">
          <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(43,75,238,0.1)_0%,transparent_100%)]"></div>
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                  New: AI v2.0 Released
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                AI-Powered Internship <br className="hidden md:block" /> Candidate Evaluation
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Analyze, rank, and respond to internship applicants in minutes. 
                  Stop manually reading PDFs and start hiring the best talent.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
                    Get Started Free
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <button className="w-full sm:w-auto bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  View Demo
                </button>
              </div>

              <div className="mt-20 relative max-w-5xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-indigo-500/50 rounded-2xl blur opacity-25"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-video group">
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-4xl fill-1">play_arrow</span>
                    </div>
                  </div>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGgiYerqqHkrqqYO0vPBPyAykQBYCy8C9OLjevrBTxZasgdN27JZUzha-qUqKGDuQpkQ_jxDpee9oWejeEH9FGxG6kT9pJ2oN40yM1Nnr2z6JnlU6tbKB-WZz5qPkFfxWMZGDXKTt27wjD--bpS7JfzAfjf49gAVVS5avfVxuG9ZShsKXgXhO6D_ZQGypX-b7_SkXupLdei_Yonso1FYuw9tYtgPLGZF7y5qCfI9tGjBh8jl4wil_efQlhDsR7YY0N0svDY8_C2tPn')" }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                  Streamline Your Hiring Workflow
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                  Powerful tools designed for modern HR teams to find the best talent faster through deep data analysis.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">document_scanner</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Resume Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Deep-learning models extract key skills and experience from every PDF automatically, regardless of formatting.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">leaderboard</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Candidate Ranking</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our proprietary algorithm scores candidates based on your specific role requirements and cultural fit indicators.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">send_and_archive</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Automated HR Responses</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Send personalized updates and rejection letters to every applicant with one click, maintaining a positive brand image.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-primary rounded-3xl p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 leading-tight">
                  Ready to find your next star intern?
                </h2>
                <p className="text-primary-foreground/80 text-white/80 text-lg md:text-xl max-w-2xl mb-10 relative z-10">
                  Join forward-thinking HR teams at Tesla, Stripe, and Vercel who are using InternSieve to filter thousands of candidates in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full justify-center">
                  <Link to="/login" className="bg-white text-primary hover:bg-slate-50 font-bold py-4 px-10 rounded-xl transition-all shadow-xl">
                    Start Free Trial
                  </Link>
                  <button className="bg-primary/20 border border-white/20 text-white hover:bg-primary/30 font-bold py-4 px-10 rounded-xl transition-all backdrop-blur-sm">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">filter_alt</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">InternSieve</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-center md:text-left">
                Empowering HR teams with the world's most advanced AI-driven recruitment intelligence.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex flex-col gap-4">
                <span className="text-slate-900 dark:text-white font-bold text-sm">Product</span>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors" href="#">Features</a>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors" href="#">Pricing</a>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors" href="#">API</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-slate-900 dark:text-white font-bold text-sm">Company</span>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors" href="#">About Us</a>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors" href="#">Contact</a>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors" href="#">Careers</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-slate-900 dark:text-white font-bold text-sm">Social</span>
                <div className="flex gap-4">
                  <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined">public</span>
                  </a>
                  <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined">code</span>
                  </a>
                  <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined">alternate_email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
            <p>© 2024 InternSieve Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
