import React from 'react';
import { ArtistProfile } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

interface ArtistCardProps {
  artist: ArtistProfile;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { navigate } = useApp();

  const handleOpenProfile = () => {
    navigate('artist-profile', { artistId: artist.id });
  };

  return (
    <div
      onClick={handleOpenProfile}
      className="group relative flex flex-col justify-between p-5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div>
        {/* Header with Avatar & Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200 group-hover:border-zinc-400 transition-colors">
              <img
                src={artist.profileImage}
                alt={artist.artistName}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {artist.status === 'approved' && (
              <div
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                title="Verified Artnova Artist"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-white" />
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="text-xs font-mono tabular-nums text-zinc-500">
              {artist.totalArtworks} {artist.totalArtworks === 1 ? 'Artwork' : 'Artworks'}
            </span>
          </div>
        </div>

        {/* Artist Name & Location */}
        <div className="mb-2">
          <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {artist.artistName}
          </h3>
          {artist.location && (
            <p className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
              <MapPin className="w-3 h-3 text-zinc-400" />
              {artist.location}
            </p>
          )}
        </div>

        {/* Short Bio */}
        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-4">
          {artist.bio}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400">Curated Creator</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenProfile();
          }}
          className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-600 flex items-center gap-1 transition-colors"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
