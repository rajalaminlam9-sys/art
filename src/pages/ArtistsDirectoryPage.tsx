import React from 'react';
import { useApp } from '../context/AppContext';
import { ArtistCard } from '../components/ArtistCard';

export const ArtistsDirectoryPage: React.FC = () => {
  const { artists } = useApp();

  const approvedArtists = artists.filter((a) => a.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Creator Collective
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 mt-1">Curated Artists</h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
          Meet the verified digital creators presenting archival masters and limited original series on Artnova.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {approvedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

    </div>
  );
};
