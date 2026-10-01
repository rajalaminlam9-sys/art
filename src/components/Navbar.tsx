import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Palette,
  ShieldCheck,
  Heart,
  Package,
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAuthModal: () => void;
  onOpenCartDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenAuthModal,
  onOpenCartDrawer,
}) => {
  const {
    currentView,
    navigate,
    currentUser,
    logout,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const handleNavClick = (view: any, params?: any) => {
    navigate(view, params);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Mobile Hamburger + Brand Wordmark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 transition-colors rounded-lg hover:bg-zinc-100 focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className="text-left group flex items-center gap-2 focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 group-hover:text-zinc-700 transition-colors">
              Artnova
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors hover:text-zinc-950 whitespace-nowrap ${
              currentView === 'home' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('explore')}
            className={`transition-colors hover:text-zinc-950 whitespace-nowrap ${
              currentView === 'explore' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => handleNavClick('artists')}
            className={`transition-colors hover:text-zinc-950 whitespace-nowrap ${
              currentView === 'artists' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => handleNavClick('explore', { category: 'All' })}
            className="transition-colors hover:text-zinc-950 whitespace-nowrap"
          >
            Categories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors hover:text-zinc-950 whitespace-nowrap ${
              currentView === 'about' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Search, Cart, Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Search Trigger / Input */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 w-44 sm:w-60 shadow-sm">
                <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search artworks, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate('explore');
                      setShowSearchInput(false);
                    }
                  }}
                  autoFocus
                  className="bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none w-full"
                />
                <button
                  onClick={() => setShowSearchInput(false)}
                  className="text-zinc-400 hover:text-zinc-700 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearchInput(true);
                  if (currentView !== 'explore') navigate('explore');
                }}
                aria-label="Search digital artworks"
                className="p-2 text-zinc-600 hover:text-zinc-950 transition-colors rounded-lg hover:bg-zinc-100"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              if (currentUser) {
                navigate('buyer-dashboard');
              } else {
                onOpenAuthModal();
              }
            }}
            aria-label="Saved Artworks"
            className="relative p-2 text-zinc-600 hover:text-zinc-950 transition-colors rounded-lg hover:bg-zinc-100 hidden sm:flex items-center"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Cart Bag */}
          <button
            onClick={onOpenCartDrawer}
            aria-label="Shopping Cart"
            className="relative p-2 text-zinc-600 hover:text-zinc-950 transition-colors rounded-lg hover:bg-zinc-100 flex items-center"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-zinc-900 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors text-xs"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-zinc-600">
                      {currentUser.name[0]}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[110px] truncate font-medium">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50 text-xs"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-100">
                    <p className="font-semibold text-zinc-900 truncate">{currentUser.name}</p>
                    <p className="text-zinc-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <span className="capitalize text-zinc-700 font-medium">{currentUser.role}</span>
                      {currentUser.status && (
                        <>
                          <span>·</span>
                          <span
                            className={
                              currentUser.status === 'approved'
                                ? 'text-emerald-600 font-medium'
                                : currentUser.status === 'pending'
                                ? 'text-amber-600 font-medium'
                                : 'text-rose-600 font-medium'
                            }
                          >
                            {currentUser.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="w-full px-3 py-2 text-left text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Admin Dashboard
                      </button>
                    )}

                    {currentUser.role === 'artist' && (
                      <button
                        onClick={() => handleNavClick('artist-dashboard')}
                        className="w-full px-3 py-2 text-left text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <Palette className="w-4 h-4 text-sky-600" />
                        Artist Studio
                      </button>
                    )}

                    <button
                      onClick={() => handleNavClick('buyer-dashboard')}
                      className="w-full px-3 py-2 text-left text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-zinc-500" />
                      My Purchases & Vault
                    </button>
                  </div>

                  <div className="border-t border-zinc-100 pt-1">
                    <button
                      onClick={logout}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:text-rose-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
