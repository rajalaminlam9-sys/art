import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Compass,
  Home,
  Users,
  Info,
  Search,
  ShoppingBag,
  User,
  ShieldCheck,
  Palette,
  LogOut,
  Package,
} from 'lucide-react';
import { CATEGORIES } from '../services/seedData';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenCart,
}) => {
  const {
    currentView,
    navigate,
    currentUser,
    cart,
    logout,
    searchQuery,
    setSearchQuery,
  } = useApp();

  if (!isOpen) return null;

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu Panel */}
      <div className="relative w-4/5 max-w-xs sm:max-w-sm bg-white border-r border-zinc-200 h-full flex flex-col z-10 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-zinc-950">Artnova</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input in mobile drawer */}
        <div className="p-4 border-b border-zinc-100">
          <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleItemClick(() => navigate('explore'));
                }
              }}
              className="bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <button
            onClick={() => handleItemClick(() => navigate('home'))}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              currentView === 'home'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => handleItemClick(() => navigate('explore'))}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              currentView === 'explore'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore Artworks
          </button>

          <button
            onClick={() => handleItemClick(() => navigate('artists'))}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              currentView === 'artists'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Artists
          </button>

          {/* Categories Sub-Accordion */}
          <div className="pt-2">
            <p className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Curated Categories
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              {CATEGORIES.slice(1).map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    handleItemClick(() => navigate('explore', { category: cat }))
                  }
                  className="px-2.5 py-1.5 text-xs text-zinc-600 hover:text-zinc-950 text-left truncate rounded hover:bg-zinc-100"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100">
            <button
              onClick={() => handleItemClick(() => navigate('about'))}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                currentView === 'about'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              <Info className="w-4 h-4" />
              About Artnova
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                Cart
              </span>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-zinc-950 text-white font-semibold rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Authenticated Dashboard Links */}
          {currentUser && (
            <div className="pt-3 border-t border-zinc-100 space-y-1">
              <p className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Account & Portals
              </p>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleItemClick(() => navigate('admin-dashboard'))}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-emerald-700 hover:bg-zinc-50 rounded-lg text-left font-medium"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}

              {currentUser.role === 'artist' && (
                <button
                  onClick={() => handleItemClick(() => navigate('artist-dashboard'))}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sky-700 hover:bg-zinc-50 rounded-lg text-left font-medium"
                >
                  <Palette className="w-4 h-4" />
                  Artist Dashboard
                </button>
              )}

              <button
                onClick={() => handleItemClick(() => navigate('buyer-dashboard'))}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg text-left"
              >
                <Package className="w-4 h-4 text-zinc-500" />
                My Purchases
              </button>
            </div>
          )}
        </div>

        {/* Footer in Drawer: User Status / Login / Logout */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-700">
                      {currentUser.name[0]}
                    </div>
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-zinc-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-zinc-500 capitalize">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="p-1.5 text-zinc-500 hover:text-rose-600 rounded-lg"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
