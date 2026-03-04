import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidateProfilePage = () => {
  const [activeTab, setActiveTab] = useState('evaluation');

  const tabs = [
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
  ];

  const scores = [
    { label: 'Skill Match', value: 94, detail: 'React, TypeScript, GraphQL, Tailwind' },
    { label: 'Experience Relevancy', value: 88, detail: '2 Internships at High-Growth Startups' },
    { label: 'Education Depth', value: 82, detail: 'CS Major at UC Berkeley, 3.8 GPA' },
    { label: 'Project Quality', value: 96, detail: 'Significant open source contributions' },
  ];

  const strengths = [
    'Advanced proficiency in TypeScript and Component-Driven Design.',
    'Strong problem-solving foundation from competitive programming.',
    'Clear evidence of ownership in previous internship projects.',
  ];

  const areasOfFocus = [
    'Limited experience with backend infrastructure and SQL databases.',
    'Transitioning from startup environment to large-scale enterprise systems.',
  ];

  const interviewQuestions = [
    '"Walk us through your PR on Framer Motion. What was the most challenging technical trade-off you had to make?"',
    '"How do you approach state management in complex, data-heavy dashboard applications?"',
  ];

  return (
    <div className="dark bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">

          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 py-3 lg:px-10 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-4 text-primary">
                <div className="size-6">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor" />
                  </svg>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">InternSieve</h2>
              </Link>
              <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 flex items-center justify-center pl-3 bg-slate-50 dark:bg-slate-900">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input className="outline-none flex w-full min-w-0 flex-1 border-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-0 px-3 text-sm font-normal" placeholder="Search applicants..." />
                </div>
              </label>
            </div>

            <div className="flex flex-1 justify-end gap-6 items-center">
              <nav className="hidden lg:flex items-center gap-6">
                <Link to="/overview" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/applicants" className="text-primary text-sm font-semibold border-b-2 border-primary py-4">Applicants</Link>
                <Link to="/roles" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Jobs</Link>
                <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#">Analytics</a>
              </nav>
              <div className="flex gap-2">
                <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
              <div className="bg-slate-200 dark:bg-slate-800 aspect-square bg-cover rounded-full size-8 cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYqy6-GcIb4CHBPQktkhKd6wd_cMRGdcIMJ5teFpl2ldIUbOIM4-yXYhj7hUWAgSGFpJw3y1PK2vrdOAIP3w8T24P30PbE-Of-u2SEZ1JAt1rB8ptIXvDPynq3HCLOmET7WMEs4d2okzuDSLFUdSGv9AfrD1O7y3iJrvD5wdD0cGn7woLDPzX0_apUgREepdrUmaZn6eMB3cu3PKwZePV1aE4QCssKrU2SUlm5Q9iaL3Cmrvr7EN0uuZcPWxUe6JassJbXf8UGA8dg')" }}></div>
            </div>
          </header>

          <main className="flex-1 px-4 lg:px-40 py-8 space-y-8">

            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-sm">
              <Link to="/applicants" className="text-slate-500 dark:text-slate-400 hover:text-primary">Applicants</Link>
              <span className="text-slate-400">/</span>
              <a className="text-slate-500 dark:text-slate-400 hover:text-primary" href="#">Frontend Engineering</a>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 dark:text-white font-medium">Alex Rivera</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm">
              <div className="flex gap-6 items-center">
                <div className="bg-slate-200 dark:bg-slate-800 aspect-square bg-cover rounded-xl size-24 border-2 border-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAj9ltOiOOsi0NQYJGd75P1-UoKrDUNZQsvIVVyATCuLIMCaO1lJjizITlFMJa5gCGTwCcngF4hMmzS8uwPU6ZEh69qEyAmivX9Ipuv7PoekYa0weqi6S-G5NSm2wmCBwEC7wcEvf4iLPa3TW8JNXpI8nbriEom23f1CD0cHZf3JkLUzJSAFchbR6jiUtWvq-fdyFbo1KcJ_Lz264_Vqwk9D1rN3gpnuzuG7AwWAT04bBHLW7kd3EMLgO_1sx36QWqZ71nGo2l6B6t')" }}></div>
                <div className="flex flex-col">
                  <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Alex Rivera</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-base mt-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span> San Francisco, CA • Software Engineering Intern
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <a className="text-primary hover:underline text-sm font-medium flex items-center gap-1.5" href="#">
                      <span className="material-symbols-outlined text-base">link</span> alexrivera.dev
                    </a>
                    <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm font-medium flex items-center gap-1.5" href="#">
                      <span className="material-symbols-outlined text-base">code</span> /arivera
                    </a>
                    <a className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm font-medium flex items-center gap-1.5" href="#">
                      <span className="material-symbols-outlined text-base">person</span> /in/alexrivera
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <button className="cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm">
                  <span className="material-symbols-outlined text-lg">description</span> Download Resume
                </button>
                <button className="cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-sm">
                  <span className="material-symbols-outlined text-lg">calendar_today</span> Schedule Interview
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800">
              <nav className="flex gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 border-b-2 font-medium text-sm tracking-wide transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Grid */}
            {activeTab === 'evaluation' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Score Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-slate-900 dark:text-white text-xl font-bold">Score Breakdown</h3>
                      <div className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
                        TOP 5% APPLICANT
                      </div>
                    </div>
                    <div className="space-y-8">
                      {scores.map((score) => (
                        <div key={score.label} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{score.label}</span>
                            <span className="text-sm font-bold text-primary">{score.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${score.value}%` }}></div>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold">{score.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-10 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/60">
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed italic">
                        "Scores are calculated relative to our Engineering bar and the 1,240 applicants for this role."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: AI Evaluation */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 relative overflow-hidden">
                    {/* Subtle AI Background Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
                          <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div>
                          <h3 className="text-slate-900 dark:text-white text-xl font-bold">AI Evaluation</h3>
                          <p className="text-slate-500 text-sm">Powered by InternSieve AI Model v4.2</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fit Rating:</span>
                        <span className="text-lg font-black text-emerald-500">EXCEPTIONAL</span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* AI Summary */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Generated Summary</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium italic">
                          "Alex stands out as a high-signal candidate with a rare combination of strong academic fundamentals and practical product engineering experience. Their work at Stripe as an intern suggests they are comfortable in high-performing environments. Particularly impressive is their contribution to the Framer Motion library, demonstrating deep expertise in modern React primitives."
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">check_circle</span> Key Strengths
                          </h4>
                          <ul className="space-y-3">
                            {strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                <div className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Areas of Focus */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">warning</span> Areas of Focus
                          </h4>
                          <ul className="space-y-3">
                            {areasOfFocus.map((a, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                <div className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommended Interview Questions */}
                      <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Suggested Interview Questions</h4>
                        <div className="space-y-3">
                          {interviewQuestions.map((q, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="text-primary font-bold shrink-0">0{i + 1}.</div>
                              <p className="text-sm text-slate-800 dark:text-slate-200">{q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-6">
                <h3 className="text-slate-900 dark:text-white text-xl font-bold">Work Experience</h3>
                <div className="space-y-6">
                  {[
                    { company: 'Stripe', role: 'Frontend Engineering Intern', period: 'Jun 2024 – Aug 2024', desc: 'Built internal tooling with React and TypeScript. Improved dashboard load times by 35% through code-splitting and lazy loading.' },
                    { company: 'Vercel', role: 'Software Engineering Intern', period: 'Jan 2024 – May 2024', desc: 'Contributed to the Next.js core team. Implemented improved hydration diagnostics in the dev overlay.' },
                  ].map((exp, i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-lg">work</span>
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold">{exp.company}</p>
                        <p className="text-slate-500 text-sm">{exp.role} · {exp.period}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-6">
                <h3 className="text-slate-900 dark:text-white text-xl font-bold">Education</h3>
                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-lg">school</span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold">University of California, Berkeley</p>
                    <p className="text-slate-500 text-sm">B.S. Computer Science · 2022 – 2026</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">GPA: 3.8 / 4.0 · Dean's List · Relevant coursework: Data Structures, Distributed Systems, Human-Computer Interaction.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-6">
                <h3 className="text-slate-900 dark:text-white text-xl font-bold">Projects</h3>
                <div className="space-y-6">
                  {[
                    { name: 'Framer Motion Contributor', stars: '24k', desc: 'Open-source contribution implementing the improved layout animation algorithm. Merged PR with 340+ stars.' },
                    { name: 'DevPulse Dashboard', stars: '1.2k', desc: 'Full-stack analytics dashboard for developer productivity metrics. Built with Next.js, Prisma, and Recharts.' },
                  ].map((proj, i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-lg">code</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-slate-900 dark:text-white font-bold">{proj.name}</p>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><span className="material-symbols-outlined text-xs">star</span>{proj.stars}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{proj.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 px-10 py-6 mt-12 bg-white dark:bg-background-dark">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
              <p>© 2026 InternSieve Analytics. All applicant data is encrypted and secure.</p>
              <div className="flex gap-6">
                <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                <a className="hover:text-primary transition-colors" href="#">Documentation</a>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
