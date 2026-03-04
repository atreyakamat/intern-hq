import React from 'react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
  return (
    <div className="dark bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <Link to="/" className="bg-primary rounded-lg p-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>filter_alt</span>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">InternSieve</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">AI Talent Suite</p>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            <Link to="/overview" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary group">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span className="text-sm font-semibold">Dashboard</span>
            </Link>
            <Link to="/roles" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <span className="material-symbols-outlined">work</span>
              <span className="text-sm font-medium">Roles</span>
            </Link>
            <Link to="/applicants" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <span className="material-symbols-outlined">groups</span>
              <span className="text-sm font-medium">Applicants</span>
            </Link>
            <Link to="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <span className="material-symbols-outlined">bar_chart</span>
              <span className="text-sm font-medium">Analytics</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </a>
            <div className="mt-4 flex items-center gap-3 px-3 py-2">
              <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1ofTRAeNVav-w3EcSpicuiA68t6fPZRNoLgmE1QdZmepu57idLJXGPpBOzuKGkuRPoWk66NDwB5-J9327__ElKJ59mjI-y0RN2vQoW2Z7N8WnRVr8_337wZa_AlK-YyBVSI2OR5g8hE5pegNZeBBSV4Iujchkr2ToOBs6bEurHZshJhCtHRp86Usetw-oT9I1o8K16qz0cPHDsmAbqwHiHhBfEeQ5kP06TEAP2wP_aQOIhtpMPQVvY4W_0mfls5JstVgNUw0IJdgj" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold dark:text-white">Alex Rivera</span>
                <span className="text-[10px] text-slate-500">Talent Acquisition</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard Overview</h2>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20 cursor-pointer">
                <span className="material-symbols-outlined text-sm">add</span>
                Create New Role
              </button>
            </div>
          </header>
          
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Roles</span>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>work</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold dark:text-white">12</h3>
                  <span className="text-emerald-500 text-xs font-bold flex items-center">
                    <span className="material-symbols-outlined text-xs">trending_up</span> 2%
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Applicants</span>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>groups</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold dark:text-white">1,284</h3>
                  <span className="text-emerald-500 text-xs font-bold flex items-center">
                    <span className="material-symbols-outlined text-xs">trending_up</span> 15%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Top Candidate Score</span>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>star</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold dark:text-white">98<span className="text-lg text-slate-500">/100</span></h3>
                  <span className="text-emerald-500 text-xs font-bold flex items-center">
                    <span className="material-symbols-outlined text-xs">trending_up</span> 5%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Emails Sent</span>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>mail</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold dark:text-white">452</h3>
                  <span className="text-emerald-500 text-xs font-bold flex items-center">
                    <span className="material-symbols-outlined text-xs">trending_up</span> 8%
                  </span>
                </div>
              </div>
            </div>

            {/* Active Roles Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Roles</h3>
                <a className="text-primary text-sm font-semibold hover:underline" href="#">View all roles</a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Role Card 1 */}
                <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:border-primary/50 transition-all cursor-pointer">
                  <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary/30" style={{ fontSize: '48px' }}>code</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold dark:text-white">Software Engineering Intern</h4>
                        <p className="text-slate-500 text-sm mt-1">Product &amp; Engineering</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Active</span>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Applicants</span>
                        <span className="text-sm font-bold dark:text-white">452 Total</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">New today</span>
                        <span className="text-sm font-bold text-primary">+12</span>
                      </div>
                    </div>
                    <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300">
                      View Applicants
                    </button>
                  </div>
                </div>

                {/* Role Card 2 */}
                <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:border-primary/50 transition-all cursor-pointer">
                  <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-indigo-500/30" style={{ fontSize: '48px' }}>brush</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold dark:text-white">Product Design Intern</h4>
                        <p className="text-slate-500 text-sm mt-1">Design Team</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Active</span>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Applicants</span>
                        <span className="text-sm font-bold dark:text-white">128 Total</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">New today</span>
                        <span className="text-sm font-bold text-primary">+4</span>
                      </div>
                    </div>
                    <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300">
                      View Applicants
                    </button>
                  </div>
                </div>

                {/* Role Card 3 */}
                <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:border-primary/50 transition-all cursor-pointer">
                  <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-orange-500/30" style={{ fontSize: '48px' }}>campaign</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold dark:text-white">Marketing Operations</h4>
                        <p className="text-slate-500 text-sm mt-1">Growth &amp; Marketing</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Active</span>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Applicants</span>
                        <span className="text-sm font-bold dark:text-white">85 Total</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">New today</span>
                        <span className="text-sm font-bold text-primary">+2</span>
                      </div>
                    </div>
                    <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300">
                      View Applicants
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity/Evaluation Feed */}
            <section className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold dark:text-white">AI Evaluation Activity</h3>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Real-time Feed</span>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>bolt</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm dark:text-slate-100 font-medium">AI evaluated <span className="font-bold">Jordan Smith</span> for <span className="text-primary">Software Intern</span> role.</p>
                    <p className="text-xs text-slate-500 mt-0.5">2 minutes ago</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-500">94/100</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '20px' }}>send</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm dark:text-slate-100 font-medium">Automatic interview invitation sent to <span className="font-bold">Sarah Chen</span>.</p>
                    <p className="text-xs text-slate-500 mt-0.5">15 minutes ago</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Email</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>bolt</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm dark:text-slate-100 font-medium">AI evaluated <span className="font-bold">Marcus Johnson</span> for <span className="text-primary">Product Design</span> role.</p>
                    <p className="text-xs text-slate-500 mt-0.5">1 hour ago</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-400">72/100</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardOverview;
