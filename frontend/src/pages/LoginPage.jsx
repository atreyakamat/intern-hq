import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@internsieve.com');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="dark bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display selection:bg-primary selection:text-white">
      {/* Top Navigation */}
      <header className="flex items-center justify-between w-full px-6 py-4 md:px-12 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-primary p-1.5 rounded-lg">
            <svg className="size-5 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">InternSieve</h2>
        </Link>
        <div className="flex items-center gap-4">
          <a className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors" href="#">Support</a>
          <button className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-all">Sign Up</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="w-full max-w-[420px] space-y-8 z-10">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400">Log in to your HR dashboard to manage applicants</p>
          </div>

          {/* Login Card */}
          <div className="glass-effect dark:bg-slate-900/40 p-8 rounded-xl shadow-2xl space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email address</label>
                <input 
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" 
                  id="email" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                  <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot password?</a>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none pr-10" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="text-xs text-center text-slate-500 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                Demo Credentials: <b>admin@internsieve.com</b> / <b>admin123</b>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer">
                  Sign in
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background-light dark:bg-background-dark/40 px-2 text-slate-500 dark:text-slate-400">Or continue with</span>
                  </div>
                </div>

                <button type="button" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center gap-3 cursor-pointer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Google
                </button>
              </div>
            </form>
          </div>

          {/* Footer Links */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account? <a className="text-primary font-semibold hover:underline" href="#">Get started</a>
          </p>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <span>© 2026 InternSieve AI. All rights reserved.</span>
          <a className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors" href="#">Terms of Service</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            <span>System Status: Optimal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
