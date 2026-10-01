import React from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { ArtistCard } from '../components/ArtistCard';
import {
  ArrowRight,
  ShieldCheck,
  DownloadCloud,
  Percent,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onOpenAuth: () => void;
  onQuickViewArtwork: (artwork: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAuth,
  onQuickViewArtwork,
}) => {
  const { artworks, artists, navigate } = useApp();

  const publishedArtworks = artworks.filter((a) => a.status === 'published');
  const featuredArtworks = publishedArtworks.slice(0, 6);
  const approvedArtists = artists.filter((a) => a.status === 'approved').slice(0, 4);

  return (
    <div className="w-full flex flex-col space-y-24 sm:space-y-32 pb-24 bg-white text-zinc-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Curated International Digital Art Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
                Discover Art Beyond Imagination.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed">
                Explore, collect, and support independent digital artists from around the world. Every piece is certified with archival-grade master files and verified provenance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => navigate('explore')}
                  className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  Explore Artworks
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 hover:text-zinc-950 font-medium text-xs sm:text-sm rounded-xl border border-zinc-200 transition-all duration-200"
                >
                  Become an Artist
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-zinc-200 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-950 font-mono tabular-nums">
                    90%
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">Artist Royalty</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-950 font-mono tabular-nums">
                    8K / 300 DPI
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">Archival Masters</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-950 font-mono tabular-nums">
                    100%
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">Curated Artists</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Spotlight Canvas */}
            <div className="lg:col-span-6 relative overflow-hidden rounded-2xl">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xl bg-white group p-3">
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-zinc-100">
                  <img
                    src={publishedArtworks[0]?.previewImage}
                    alt={publishedArtworks[0]?.title || 'Hero Artwork'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* White Gallery Information Footer */}
                <div className="pt-4 px-2 pb-1 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                      Spotlight Acquisition
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-950 mt-0.5">
                      {publishedArtworks[0]?.title}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      by {publishedArtworks[0]?.artistName} · {publishedArtworks[0]?.copyright}
                    </p>
                  </div>

                  <a
                    href={`/artwork/${publishedArtworks[0]?.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('artwork', { artworkId: publishedArtworks[0]?.id });
                    }}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs shrink-0 whitespace-nowrap inline-block text-center"
                  >
                    View Piece
                  </a>
                </div>
              </div>

              {/* Ambient backdrop subtle tint */}
              <div
                className="absolute -top-12 -right-12 w-64 h-64 bg-zinc-100 rounded-full blur-3xl -z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 2. FEATURED ARTWORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
              Featured Digital Artworks
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('explore')}
              className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-semibold transition-colors"
            >
              Browse All ({publishedArtworks.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onQuickView={onQuickViewArtwork}
            />
          ))}
        </div>

      </section>

      {/* 3. MEET THE ARTISTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Talent Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
              Meet the Artists
            </h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-lg">
              Independent visionaries pushing the boundaries of architectural light, chromatic prisms, and contemporary digital painting.
            </p>
          </div>

          <button
            onClick={() => navigate('artists')}
            className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-semibold transition-colors whitespace-nowrap"
          >
            View All Artists
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* 4. PLATFORM INTEGRITY & VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#f8f9fa] border border-zinc-200 rounded-2xl p-8 sm:p-12">
          
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              The Artnova Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
              Engineered for Serious Creators & Collectors.
            </h3>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
              We eliminated the low-quality spam and volatile gimmicks of ordinary marketplaces. Artnova connects collectors directly with peer-reviewed digital masters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-950">Curated Artist Verification</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Artists must submit portfolio verification to be approved by Artnova curators before publishing any artwork to the marketplace.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-sky-600 shadow-xs">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-950">Archival Master Files</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Purchasers receive verified download rights to 16-bit uncompressed TIFF and RAW digital masters suitable for museum exhibition and archival printing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-amber-600 shadow-xs">
                <Percent className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-950">Fair 90% Artist Royalties</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Unlike corporate stock photo platforms taking 50%–70%, Artnova returns 90% of every sale directly to the artist.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
