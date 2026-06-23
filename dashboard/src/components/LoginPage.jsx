import { useState } from 'react';
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { AUTH_ENDPOINTS } from '../api/endpoints';
import spLogo from '../assets/safepulse-icon.png';
import heroImage from '../assets/hero.png';

const TOKEN_KEY = 'safepulse_access';
const REFRESH_KEY = 'safepulse_refresh';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Invalid username or password.');
        return;
      }

      if (data.tokens?.access) {
        localStorage.setItem(TOKEN_KEY, data.tokens.access);
      }
      if (data.tokens?.refresh) {
        localStorage.setItem(REFRESH_KEY, data.tokens.refresh);
      }

      onLoginSuccess?.(data.user, data.tokens);
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Branding panel */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-linear-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
            <img src={spLogo} alt="SafePulse" className="w-12 h-12 rounded-full" />
          </div>
          <h1 className="text-2xl font-semibold bg-linear-to-r from-white to-emerald-700 bg-clip-text text-transparent">
            SafePulse
          </h1>
        </div>

        <div className="relative z-10">
          <img src={heroImage} alt="" className="w-full max-w-md mx-auto mb-8 drop-shadow-2xl" />
          <h2 className="text-3xl font-bold text-white leading-tight">
            Keeping communities safe, together.
          </h2>
          <p className="text-emerald-200 mt-3 text-sm max-w-md">
            Monitor incidents, coordinate responses and act faster — all from one dashboard.
          </p>
        </div>

        <p className="text-emerald-300/70 text-xs relative z-10">
          &copy; {new Date().getFullYear()} SafePulse. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
            <div className="w-11 h-11 bg-linear-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center overflow-hidden">
              <img src={spLogo} alt="SafePulse" className="w-11 h-11 rounded-full" />
            </div>
            <span className="text-xl font-semibold text-emerald-900">SafePulse</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-300" />
                Remember me
              </label>
              <a href="#" className="text-emerald-700 font-medium hover:text-emerald-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-emerald-700 font-medium hover:text-emerald-800">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
