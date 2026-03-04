import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreateRolePage = () => {
  const [weights, setWeights] = useState({
    skillMatch: 40,
    experience: 25,
    projectDepth: 20,
    education: 15
  });

  const handleSliderChange = (name, value) => {
    setWeights(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyAIRecommendation = () => {
    setWeights({
      skillMatch: 30,
      experience: 20,
      projectDepth: 35,
      education: 15
    });
  };

  // Switch States
  const [publicPortal, setPublicPortal] = useState(true);
  const [universityNetwork, setUniversityNetwork] = useState(false);

  return (
    <div className="dark bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 py-3 lg:px-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 text-primary">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">filter_alt</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">InternSieve</h2>
              </Link>
              <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400 flex bg-slate-100 dark:bg-slate-900 items-center justify-center px-3">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input className="outline-none flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-0 h-full placeholder:text-slate-500 text-sm" placeholder="Search applicants..." />
                </div>
              </label>
            </div>
            
            <div className="flex flex-1 justify-end gap-6 items-center">
              <nav className="hidden lg:flex items-center gap-7">
                <Link to="/overview" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/roles" className="text-primary text-sm font-bold border-b-2 border-primary py-1">Roles</Link>
                <Link to="/applicants" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Applicants</Link>
                <Link to="/settings" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Settings</Link>
              </nav>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>
              <div className="flex items-center gap-4">
                <button className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-slate-200 dark:border-slate-800 cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpha4RWZ87SU2cajvLsd6ZVkl9AJo12CL6TtPyw53Y8g98_zO0s3a0RqB33X-knfq5BsYuJOg5i6SuBg_GYP2R8CeMkLfS-0uowXGTtJuqGEGC0EMiQPjxBx3gSbAQFVigg6M71z-_5dTqz4pq3xZdNnzkgsaEEC2Gcr6px6Z-QQHVNKEHhkG4fA-I56YFnQlqjhqxyj2N-k7B_QnDbAEeLTBLlHZgb_3Mf4maXH2FfCjHBDuM46X702-BzRIf2IBESTJpdBvQkjpr')" }}></div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center">
            <div className="layout-content-container flex flex-col max-w-[1024px] w-full px-6 py-8">
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 mb-6">
                <Link to="/roles" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">Roles</Link>
                <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                <span className="text-slate-900 dark:text-white text-sm font-semibold">New Internship Role</span>
              </div>

              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div className="space-y-2">
                  <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold tracking-tight">Create Internship Role</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Define the requirements and AI evaluation weights to automatically screen incoming talent.</p>
                </div>
                <div className="flex gap-3">
                  <button className="cursor-pointer px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">Save Draft</button>
                  <button className="cursor-pointer px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20 transition-all">Create Role</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Sections */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Section 1: Role Information */}
                  <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-primary">info</span>
                      <h2 className="text-slate-900 dark:text-white text-xl font-bold">Role Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Internship Title</label>
                        <input className="outline-none w-full rounded-lg bg-slate-50 dark:bg-slate-900 border-x border-y border-transparent focus:border-primary dark:border-slate-800 text-slate-900 dark:text-white focus:ring-primary p-3" placeholder="e.g. Senior Frontend Engineering Intern" type="text" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea className="outline-none w-full rounded-lg bg-slate-50 dark:bg-slate-900 border-x border-y border-transparent focus:border-primary dark:border-slate-800 text-slate-900 dark:text-white focus:ring-primary p-3" placeholder="Briefly describe the internship objectives and daily responsibilities..." rows="4"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                        <select className="outline-none w-full rounded-lg bg-slate-50 dark:bg-slate-900 border-x border-y border-transparent focus:border-primary dark:border-slate-800 text-slate-900 dark:text-white focus:ring-primary p-3">
                          <option>3 Months</option>
                          <option>6 Months</option>
                          <option>Summer (10-12 weeks)</option>
                          <option>Co-op (4 months+)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">location_on</span>
                          <input className="outline-none w-full pl-10 rounded-lg bg-slate-50 dark:bg-slate-900 border-x border-y border-transparent focus:border-primary dark:border-slate-800 text-slate-900 dark:text-white focus:ring-primary p-3" placeholder="Remote, New York, etc." type="text" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Skill Requirements */}
                  <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                      <h2 className="text-slate-900 dark:text-white text-xl font-bold">Skill Requirements</h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Required Skills (High Importance)</label>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">React <button className="cursor-pointer material-symbols-outlined text-xs">close</button></span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">TypeScript <button className="cursor-pointer material-symbols-outlined text-xs">close</button></span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">Tailwind CSS <button className="cursor-pointer material-symbols-outlined text-xs">close</button></span>
                          <button className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span> Add Skill
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Preferred Skills (Bonus)</label>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium">Next.js <button className="cursor-pointer material-symbols-outlined text-xs">close</button></span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium">Figma <button className="cursor-pointer material-symbols-outlined text-xs">close</button></span>
                          <button className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span> Add Skill
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 3: AI Evaluation Weights */}
                  <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold">Evaluation Weights</h2>
                      </div>
                      <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                        Total: {weights.skillMatch + weights.experience + weights.projectDepth + weights.education}%
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 italic">Adjust how the AI ranks applicants based on their profiles.</p>
                    
                    <div className="space-y-8">
                      {/* Slider 1 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Skill Match</label>
                          <span className="text-primary font-mono font-bold">{weights.skillMatch}%</span>
                        </div>
                        <input className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary slider-thumb" max="100" min="0" type="range" value={weights.skillMatch} onChange={(e) => handleSliderChange('skillMatch', parseInt(e.target.value))} />
                        <p className="text-[11px] text-slate-500">Alignment with required/preferred skills list.</p>
                      </div>

                      {/* Slider 2 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Experience</label>
                          <span className="text-primary font-mono font-bold">{weights.experience}%</span>
                        </div>
                        <input className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary slider-thumb" max="100" min="0" type="range" value={weights.experience} onChange={(e) => handleSliderChange('experience', parseInt(e.target.value))} />
                        <p className="text-[11px] text-slate-500">Prior internships or relevant part-time work.</p>
                      </div>

                      {/* Slider 3 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Project Depth</label>
                          <span className="text-primary font-mono font-bold">{weights.projectDepth}%</span>
                        </div>
                        <input className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary slider-thumb" max="100" min="0" type="range" value={weights.projectDepth} onChange={(e) => handleSliderChange('projectDepth', parseInt(e.target.value))} />
                        <p className="text-[11px] text-slate-500">Complexity of personal projects and GitHub contributions.</p>
                      </div>

                      {/* Slider 4 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Education</label>
                          <span className="text-primary font-mono font-bold">{weights.education}%</span>
                        </div>
                        <input className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary slider-thumb" max="100" min="0" type="range" value={weights.education} onChange={(e) => handleSliderChange('education', parseInt(e.target.value))} />
                        <p className="text-[11px] text-slate-500">Academic performance and degree relevance.</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Sidebar Preview/Actions */}
                <div className="space-y-6">
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined">auto_awesome</span> AI Tip
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      Based on similar "Frontend" roles, successful hires often have a high weight (35%+) on <span className="text-primary font-semibold">Project Depth</span>.
                    </p>
                    <button onClick={applyAIRecommendation} className="cursor-pointer w-full py-2 bg-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary/30 transition-all">
                      Apply Recommendation
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">Posting Visibility</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Public Portal</span>
                          <span className="text-xs text-slate-500">Visible to all applicants</span>
                        </div>
                        <div 
                          onClick={() => setPublicPortal(!publicPortal)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${publicPortal ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <span className={`${publicPortal ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">University Network</span>
                          <span className="text-xs text-slate-500">Share with partner schools</span>
                        </div>
                        <div 
                          onClick={() => setUniversityNetwork(!universityNetwork)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${universityNetwork ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <span className={`${universityNetwork ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Role Analytics Preview</h3>
                    <div className="h-32 w-full flex items-end justify-between gap-2 px-2">
                      <div className="w-full bg-primary/20 rounded-t-sm h-[40%]" title="Applicants"></div>
                      <div className="w-full bg-primary/40 rounded-t-sm h-[60%]" title="Views"></div>
                      <div className="w-full bg-primary rounded-t-sm h-[85%]" title="Qualified"></div>
                      <div className="w-full bg-primary/30 rounded-t-sm h-[25%]" title="Rejections"></div>
                      <div className="w-full bg-primary/60 rounded-t-sm h-[50%]" title="Interviews"></div>
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-bold uppercase">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-4 text-center">Predicted applicant volume based on criteria.</p>
                  </div>
                  
                </div>
              </div>
            </div>
          </main>

          <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-10 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-xs">
              <p>© 2026 InternSieve AI. All rights reserved.</p>
              <div className="flex gap-6">
                <a className="hover:text-primary transition-colors" href="#">Documentation</a>
                <a className="hover:text-primary transition-colors" href="#">API Reference</a>
                <a className="hover:text-primary transition-colors" href="#">Support</a>
              </div>
            </div>
          </footer>
          
        </div>
      </div>
    </div>
  );
};

export default CreateRolePage;
