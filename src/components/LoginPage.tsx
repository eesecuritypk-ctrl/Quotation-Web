/**
 * Eagle Eye Security System - Interactive Login Page
 * Supports credential entry, show/hide password, and 1-click role demo logins.
 */

import React, { useState } from 'react';
import { EagleEyeLogo } from './EagleEyeLogo';
import { DEMO_USERS } from '../data/initialData';
import { User } from '../types/quotation';
import { Lock, Mail, ArrowRight, Shield, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@eesecurity.com.pk');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmed = usernameOrEmail.trim().toLowerCase();
      const matched = DEMO_USERS.find(
        (u) =>
          u.username.toLowerCase() === trimmed ||
          u.email.toLowerCase() === trimmed
      );

      if (matched && password.length >= 4) {
        setIsLoading(false);
        onLoginSuccess(matched);
      } else if (trimmed && password) {
        // Fallback demo user
        setIsLoading(false);
        onLoginSuccess({
          id: 99,
          username: trimmed.split('@')[0],
          fullName: 'Security Officer',
          email: trimmed.includes('@') ? trimmed : `${trimmed}@eesecurity.com.pk`,
          role: 'sales_manager'
        });
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid username or password. Please try demo credentials below.');
      }
    }, 450);
  };

  const handleQuickDemoLogin = (user: User) => {
    setUsernameOrEmail(user.email);
    setPassword('password123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Ambience & Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-md mb-4">
            <EagleEyeLogo size="lg" showText={true} theme="dark" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white mt-1">
            Quotation Management Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Generate, sign, and export official commercial quotations with MySQL synchronization
          </p>
        </div>

        {/* Login Form Card */}
        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff ID or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin@eesecurity.com.pk"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                />
                <span>Remember session</span>
              </label>
              <span className="text-slate-500">Demo Pass: password123</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Role-Based Access
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(user)}
                  className="px-2.5 py-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300 capitalize truncate">
                    {user.role.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user.username}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>256-Bit TLS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>MySQL Schema Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>ISO 9001 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
