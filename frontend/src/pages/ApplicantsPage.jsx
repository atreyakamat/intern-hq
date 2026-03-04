import React from 'react';
import { Link } from 'react-router-dom';

const ApplicantsPage = () => {
  return (
    <div className="dark bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-border-dark px-6 py-3 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 text-primary">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">filter_tilt_shift</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">InternSieve</h2>
              </Link>
              <nav className="hidden lg:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/applicants" className="text-primary dark:text-white text-sm font-medium border-b-2 border-primary py-4 -mb-4">Applicants</Link>
                <Link to="/roles" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Jobs</Link>
                <Link to="/analytics" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">Analytics</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-1.5 focus-within:ring-2 ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                <input className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 text-slate-900 dark:text-white placeholder:text-slate-500" placeholder="Quick search..." />
                <span className="text-[10px] font-bold text-slate-400 border border-slate-300 dark:border-slate-700 rounded px-1.5">⌘K</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-border-dark hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-xl">notifications</span>
                </button>
                <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-border-dark hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-xl">settings</span>
                </button>
              </div>
              <div className="size-9 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden cursor-pointer">
                <img className="w-full h-full object-cover" alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYQdR0XAfswyLhzi1FJQq7zkcKtVn0nDeliZvK0XxYZCWrqH7J4j6tEDvneERcZmR_-xN2PYvBsKMLclHdO_Qy1b_6vCQ3r35CeCso_b3cNJoYqfO0QAZJISUcGPtkA7Yc8WnHXhfEY6ujVYErGwiKmTs-uixJfL7ChAKoxGB8801BNnJjXEYbn6KMr-F2iTjK-YKbaDbQYwGKoOvByH8roKw3aBSkIO2OncSqZGPWR01eDOyUzqE8lPCfE_VSD2-FupSNDJvu1vfp" />
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col px-6 lg:px-24 py-8 max-w-[1600px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <span>Jobs</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span>Engineering</span>
                </div>
                <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">Software Engineer Intern</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Active Recruitment • 124 Total Applicants • Summer 2024
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-surface-dark text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg border border-slate-200 dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export CSV
                </button>
                <Link to="/upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-lg">add</span>
                  Add Applicant
                </Link>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl mb-6 items-center">
              <div className="flex-1 w-full">
                <label className="relative flex items-center w-full">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400">search</span>
                  <input className="w-full pl-10 pr-4 py-2 outline-none bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-500 transition-all" placeholder="Search by name, email, or skills..." />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  Score: 80+
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-sm">code</span>
                  Skills: React, Python
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-sm">work_history</span>
                  Experience: 1yr+
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-border-dark mx-1 hidden lg:block"></div>
                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-primary transition-colors text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Main Table Container */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-border-dark">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Applicant Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Score</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fit Rating</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">AR</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Rivera</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Stanford University • CS</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-border-dark overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-green-500">88</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">#1</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                          Excellent
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="text-xs font-medium uppercase tracking-wide">Pending</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">visibility</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">mail</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">JC</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Jordan Chen</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">MIT • Software Eng</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-border-dark overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '82%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-primary">82</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">#2</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                          Good
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-green-500 dark:text-green-400">
                          <span className="size-1.5 rounded-full bg-green-500"></span>
                          <span className="text-xs font-medium uppercase tracking-wide">Accepted</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">visibility</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">mail</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">TS</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Taylor Smith</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">UC Berkeley • EECS</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-border-dark overflow-hidden">
                            <div className="h-full bg-primary/60 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-slate-400">75</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">#3</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                          Good
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                          <span className="size-1.5 rounded-full bg-amber-500"></span>
                          <span className="text-xs font-medium uppercase tracking-wide">Pending</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">visibility</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">mail</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">ML</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Morgan Lee</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Georgia Tech • Math/CS</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-border-dark overflow-hidden">
                            <div className="h-full bg-slate-400 rounded-full" style={{ width: '64%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-slate-400">64</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">#4</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                          Fair
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 line-through">
                          <span className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                          <span className="text-xs font-medium uppercase tracking-wide">Rejected</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">visibility</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">mail</span></button>
                          <button className="cursor-pointer text-slate-400 hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-background-dark/50 border-t border-slate-200 dark:border-border-dark flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing <span className="font-bold text-slate-900 dark:text-white">1-4</span> of <span className="font-bold text-slate-900 dark:text-white">124</span> applicants
                </p>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark transition-colors disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="cursor-pointer size-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
                  <button className="cursor-pointer size-8 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-border-dark">2</button>
                  <button className="cursor-pointer size-8 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-border-dark">3</button>
                  <button className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-border-dark text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Average AI Score</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">74.2</span>
                  <span className="text-xs font-medium text-green-500 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                    4.1%
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">person_check</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fast-Track Eligible</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">18</span>
                  <span className="text-xs font-medium text-slate-400">applicants</span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Average Review Time</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">2.4d</span>
                  <span className="text-xs font-medium text-red-500 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                    12%
                  </span>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto px-6 py-8 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark/30">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="size-6 bg-slate-300 dark:bg-border-dark rounded flex items-center justify-center text-[10px] font-bold">IS</div>
                <p className="text-xs text-slate-500 dark:text-slate-500">© 2026 InternSieve AI. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-6">
                <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
                <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Terms of Service</a>
                <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Support Center</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
