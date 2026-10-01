import React from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import {
  Globe,
  Mail,
  MapPin,
  CheckCircle2,
  Share2,
  ArrowLeft,
} from 'lucide-react';

export const ArtistProfilePage: React.FC = () => {
  const { artists, artworks, selectedArtistId, navigate, addToast } = useApp();

  const artist = artists.find((a) => a.id === selectedArtistId) || artists[0];

  if (!artist || artist.status !== 'approved') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-white text-zinc-900">
        <h2 className="text-xl font-bold text-zinc-950">Artist Profile Unavailable</h2>
        <p className="text-xs text-zinc-500 mt-2">
          This artist profile is either pending review or not active on the public marketplace.
        </p>
        <button
          onClick={() => navigate('artists')}
          className="mt-4 px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold"
        >
          View Artists Directory
        </button>
      </div>
    );
  }

  const artistArtworks = artworks.filter(
    (art) => art.artistId === artist.id && art.status === 'published'
  );

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'success',
        title: 'Artist Link Copied',
        message: `Profile link for ${artist.artistName} copied to clipboard.`,
      });
    }
  };

  return (
    <div className="w-full pb-20 space-y-8 bg-white text-zinc-900">
      
      {/* 1. Cover / Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-100 border-b border-zinc-200">
        {artist.coverImage ? (
          <img
            src={artist.coverImage}
            alt={`${artist.artistName} cover`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-black/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-6 left-0 right-0">
          <button
            onClick={() => navigate('artists')}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/90 hover:bg-white backdrop-blur-md text-zinc-800 text-xs font-semibold shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Artists Directory
          </button>
        </div>
      </div>

      {/* 2. Artist Profile Information Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start justify-between gap-6">
          
          {/* Avatar and bio */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-zinc-200 bg-zinc-100 shadow-md">
                <img
                  src={artist.profileImage}
                  alt={artist.artistName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-zinc-200 shadow-sm"
                title="Verified Artnova Artist"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                  {artist.artistName}
                </h1>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Verified Artist
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                {artist.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {artist.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  {artist.email}
                </span>
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sky-600 hover:underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {artist.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed pt-1">
                {artist.bio}
              </p>
            </div>
          </div>

          {/* Metrics & Share */}
          <div className="flex flex-col items-end justify-between self-stretch sm:self-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 w-full md:w-auto">
            <button
              onClick={handleShareProfile}
              className="py-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Artist
            </button>

            <div className="flex items-center gap-6 text-right">
              <div>
                <span className="text-xl font-bold text-zinc-950 font-mono tabular-nums">
                  {artistArtworks.length}
                </span>
                <span className="text-xs text-zinc-500 block">Artworks</span>
              </div>
              <div>
                <span className="text-xl font-bold text-zinc-950 font-mono tabular-nums">
                  {artist.totalSales}
                </span>
                <span className="text-xs text-zinc-500 block">Collector Sales</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Artist's Artwork Collection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h2 className="text-xl font-bold text-zinc-950">Artworks by {artist.artistName}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Available original digital editions and certified master archives.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono tabular-nums">
            {artistArtworks.length} {artistArtworks.length === 1 ? 'Piece' : 'Pieces'}
          </span>
        </div>

        {artistArtworks.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-xl p-8">
            <p className="text-sm text-zinc-500">This artist has not published any artworks yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {artistArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
