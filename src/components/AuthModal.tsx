import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Palette,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, loginWithDemo, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'artist'>('buyer');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Authentication failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      role,
      bio: role === 'artist' ? bio : undefined,
      location: role === 'artist' ? location : undefined,
    });
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your account email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'info',
        title: 'Password Reset Email Sent',
        message: `Instructions have been sent to ${email}.`,
      });
      setMode('login');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-zinc-900 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="text-xl font-bold tracking-tight text-zinc-950">Artnova</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-950">
            {mode === 'login'
              ? 'Sign in to Artnova'
              : mode === 'register'
              ? 'Create your account'
              : 'Reset your password'}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {mode === 'login'
              ? 'Access your digital art vault, orders, or studio.'
              : mode === 'register'
              ? 'Join as an art collector or apply to become a seller.'
              : 'Enter your registered email to receive a recovery link.'}
          </p>
        </div>

        {/* Quick Demo Accounts Switcher */}
        <div className="mb-6 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Demo Sign-In
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                loginWithDemo('admin');
                onClose();
              }}
              className="py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-emerald-700 font-medium rounded-lg text-left transition-colors truncate shadow-xs"
              title="Sign in as Administrator"
            >
              🛡️ Admin
            </button>
            <button
              onClick={() => {
                loginWithDemo('artist', 'approved');
                onClose();
              }}
              className="py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-sky-700 font-medium rounded-lg text-left transition-colors truncate shadow-xs"
              title="Sign in as Elena Rostova (Approved Artist)"
            >
              🎨 Approved Artist
            </button>
            <button
              onClick={() => {
                loginWithDemo('artist', 'pending');
                onClose();
              }}
              className="py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-amber-700 font-medium rounded-lg text-left transition-colors truncate shadow-xs"
              title="Sign in as Julian Reed (Pending Artist)"
            >
              ⏳ Pending Artist
            </button>
            <button
              onClick={() => {
                loginWithDemo('buyer');
                onClose();
              }}
              className="py-1.5 px-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium rounded-lg text-left transition-colors truncate shadow-xs"
              title="Sign in as Aria Sterling (Collector)"
            >
              💎 Collector / Buyer
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('forgot');
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-zinc-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('register');
                }}
                className="text-xs text-zinc-950 hover:underline font-semibold"
              >
                Register
              </button>
            </div>
          </form>
        )}

        {/* Mode: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Account Type Selector (Buyer vs Artist) */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                    role === 'buyer'
                      ? 'border-zinc-950 bg-zinc-100 text-zinc-950 font-semibold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <div>
                    <div className="font-semibold">Collector / Buyer</div>
                    <div className="text-[10px] text-zinc-500">Collect artworks</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                    role === 'artist'
                      ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Palette className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="font-semibold">Artist / Seller</div>
                    <div className="text-[10px] text-zinc-500">Sell digital art</div>
                  </div>
                </button>
              </div>

              {role === 'artist' && (
                <div className="mt-2 p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900 leading-relaxed">
                  <strong>Notice:</strong> Artist accounts initially register as <em>Pending Approval</em>. An admin must review your application before you can upload and publish artworks.
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Full Name / Artist Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            {role === 'artist' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Berlin, Germany"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Artist Statement / Bio
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your artistic medium and style..."
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 mt-3 disabled:opacity-50 shadow-sm"
            >
              {loading
                ? 'Creating account...'
                : role === 'artist'
                ? 'Submit Artist Application'
                : 'Create Collector Account'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-zinc-500">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('login');
                }}
                className="text-xs text-zinc-950 hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Mode: Forgot Password */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Sending link...' : 'Send Recovery Link'}
              <KeyRound className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('login');
                }}
                className="text-xs text-zinc-500 hover:text-zinc-950"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
