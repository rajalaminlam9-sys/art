import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { ArtworkUploadModal } from './components/ArtworkUploadModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';
import { ArtistProfilePage } from './pages/ArtistProfilePage';
import { ArtistsDirectoryPage } from './pages/ArtistsDirectoryPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { ArtistDashboardPage } from './pages/ArtistDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';

import { Artwork } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, navigate, toasts, removeToast, artworks, selectedArtworkId } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  const activeArtwork = artworks.find((a) => a.id === selectedArtworkId) || artworks[0] || null;

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleQuickViewArtwork = (artwork: Artwork) => {
    navigate('artwork', { artworkId: artwork.id });
  };

  const handleOpenLightbox = () => {
    if (activeArtwork) {
      setLightboxArtwork(activeArtwork);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 relative selection:bg-zinc-200 selection:text-zinc-900">
      
      {/* Top Navbar */}
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenAuthModal={() => handleOpenAuth('login')}
        onOpenCartDrawer={() => setCartDrawerOpen(true)}
      />

      {/* Mobile Slide-Out Drawer (Left to Right) */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onCheckout={() => navigate('checkout')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Artwork Upload Modal (Only for approved artists) */}
      <ArtworkUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        artwork={lightboxArtwork}
        isOpen={!!lightboxArtwork}
        onClose={() => setLightboxArtwork(null)}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full bg-white">
        {currentView === 'home' && (
          <HomePage
            onOpenAuth={() => handleOpenAuth('register')}
            onQuickViewArtwork={handleQuickViewArtwork}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage onQuickViewArtwork={handleQuickViewArtwork} />
        )}

        {currentView === 'artwork' && (
          <ArtworkDetailPage
            onOpenLightbox={handleOpenLightbox}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentView === 'artist-profile' && <ArtistProfilePage />}

        {currentView === 'artists' && <ArtistsDirectoryPage />}

        {(currentView === 'cart' || currentView === 'checkout') && (
          <CartCheckoutPage />
        )}

        {currentView === 'buyer-dashboard' && <BuyerDashboardPage />}

        {currentView === 'artist-dashboard' && (
          <ArtistDashboardPage
            onOpenUploadModal={() => setUploadModalOpen(true)}
          />
        )}

        {currentView === 'admin-dashboard' && <AdminDashboardPage />}

        {currentView === 'about' && <AboutPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-white/95 border-emerald-300 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-white/95 border-rose-300 text-rose-800'
                : 'bg-white/95 border-sky-300 text-sky-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-zinc-950">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-800 p-0.5 -mt-1 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
