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
  Copy,
  Check,
  ExternalLink,
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
  const { login, loginWithGoogle, register, loginWithDemo, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isUnauthorizedDomain = Boolean(
    errorMessage &&
      (errorMessage.includes('unauthorized-domain') ||
        errorMessage.includes('auth/unauthorized-domain'))
  );

  const handleCopyHostname = () => {
    if (navigator.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'artist'>('buyer');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Google sign-in could not be completed.');
    }
  };

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
        className="fixed inset-0 bg-black/50 transition-opacity"
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

        {/* Continue with Google (Firebase Google Auth) */}
        {mode !== 'forgot' && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-800 shadow-2xs transition-colors hover:border-zinc-400 active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-2.5 text-[11px] text-zinc-400 font-medium uppercase absolute">
                or with email
              </span>
            </div>
          </div>
        )}

        {/* Error Notification / Unauthorized Domain Helper */}
        {errorMessage && (
          isUnauthorizedDomain ? (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2.5 text-zinc-900 shadow-2xs">
              <div className="flex items-start gap-2 text-amber-900 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>ডোমেইন অনুমোদন প্রয়োজন (Authorized Domain Required)</span>
              </div>
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                নিরাপত্তার স্বার্থে Firebase শুধুমাত্র অনুমোদিত ডোমেইন থেকেই Google Sign-In গ্রহণ করে। নিচের ডোমেইনটি কপি করে আপনার Firebase Console-এ যুক্ত করুন:
              </p>
              
              <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-amber-200/80 text-xs font-mono text-zinc-800">
                <span className="truncate select-all font-semibold text-[11px]">{currentHostname}</span>
                <button
                  type="button"
                  onClick={handleCopyHostname}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Domain
                    </>
                  )}
                </button>
              </div>

              <div className="pt-0.5 flex items-center justify-between text-[11px]">
                <a
                  href="https://console.firebase.google.com/project/artnova-bd1b7/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-950 font-semibold underline inline-flex items-center gap-1"
                >
                  Firebase Authorized Domains সেটিংস খুলুন <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )
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
