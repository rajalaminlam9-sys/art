import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { CATEGORIES } from '../services/seedData';
import { Search, X, Sparkles } from 'lucide-react';
import { Artwork } from '../types';

interface ExplorePageProps {
  onQuickViewArtwork?: (artwork: Artwork) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onQuickViewArtwork }) => {
  const { artworks, selectedCategory, searchQuery, setSearchQuery } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'All');

  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => art.status === 'published')
      .filter((art) => {
        if (activeCategory !== 'All' && art.category !== activeCategory) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = art.title.toLowerCase().includes(q);
          const matchesArtist = art.artistName.toLowerCase().includes(q);
          const matchesCategory = art.category.toLowerCase().includes(q);
          const matchesTags = art.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesArtist && !matchesCategory && !matchesTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [artworks, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Artnova Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 mt-1">Explore Artworks</h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
            Discover original digital creations across architecture, prisms, porcelain botanical sculpture, and surreal spaces.
          </p>
        </div>

        <div className="text-xs text-zinc-500 font-mono tabular-nums">
          Showing <span className="text-zinc-950 font-semibold">{filteredArtworks.length}</span> pieces
        </div>
      </div>

      {/* Control Bar: Search + Category Tabs */}
      <div className="space-y-4">
        
        {/* Search input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search box with clear button */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, artist, or tags..."
              className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

      </div>

      {/* Artworks Grid */}
      {filteredArtworks.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-xs">
            <Sparkles className="w-6 h-6 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-950">No Artworks Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              We couldn't find any artwork matching your active search and filter parameters.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onQuickView={onQuickViewArtwork}
            />
          ))}
        </div>
      )}

    </div>
  );
};
