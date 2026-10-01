import React, { useState } from 'react';
import { Artwork } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
  onQuickView?: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onQuickView }) => {
  const { navigate, addToCart, isInCart, toggleWishlist, isInWishlist } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inCart = isInCart(artwork.id);
  const inWishlist = isInWishlist(artwork.id);

  const handleCardClick = () => {
    navigate('artwork', { artworkId: artwork.id });
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('artist-profile', { artistId: artwork.artistId });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(artwork);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(artwork.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Visual Slot / Artwork Preview */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-zinc-100 animate-pulse" />
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-zinc-50 text-zinc-400">
            <span className="text-xs uppercase tracking-wider">{artwork.category}</span>
            <span className="text-sm font-medium text-zinc-700 mt-1">{artwork.title}</span>
          </div>
        ) : (
          <img
            src={artwork.previewImage}
            alt={artwork.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Floating Actions: Wishlist Heart */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-zinc-700 hover:text-zinc-950 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Scrim Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
          <div className="w-full flex items-center justify-between gap-2">
            <a
              href={`/artwork/${artwork.id}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onQuickView) {
                  onQuickView(artwork);
                } else {
                  handleCardClick();
                }
              }}
              className="py-1.5 px-3 bg-white text-zinc-950 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              View Artwork
            </a>

            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className={`p-2 rounded-lg text-xs font-medium transition-colors shadow-md flex items-center justify-center ${
                inCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-zinc-900 hover:bg-zinc-100'
              }`}
              title={inCart ? 'In Cart' : 'Add to Cart'}
            >
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Artwork Metadata */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Zero-Pill Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
            <span>{artwork.category}</span>
            <span aria-hidden="true" className="text-zinc-300">·</span>
            <span>{artwork.digitalFile.resolution.split(' ')[0]}</span>
          </div>

          {/* Title with link */}
          <a
            href={`/artwork/${artwork.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleCardClick();
            }}
            className="block"
          >
            <h3 className="text-base font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
              {artwork.title}
            </h3>
          </a>

          {/* Artist link */}
          <button
            onClick={handleArtistClick}
            className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors mt-0.5 line-clamp-1 text-left"
          >
            {artwork.artistName}
          </button>
        </div>

        {/* Pricing Baseline with Tabular Numerals */}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Original Master</span>
          <span className="text-base font-semibold text-zinc-900 font-mono tabular-nums">
            ${artwork.price}
          </span>
        </div>
      </div>
    </div>
  );
};
