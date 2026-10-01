import React from 'react';
import { X } from 'lucide-react';
import { Artwork } from '../types';

interface ImageLightboxModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  artwork,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Lightbox Content */}
      <div className="relative max-w-6xl w-full h-[90vh] flex flex-col justify-between z-10 bg-white rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Top bar controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white text-zinc-900">
          <div className="truncate mr-4">
            <h3 className="text-sm font-semibold text-zinc-950 truncate">{artwork.title}</h3>
            <p className="text-xs text-zinc-500">
              by {artwork.artistName} · {artwork.digitalFile.resolution} · {artwork.copyright}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close high-resolution viewer"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Artwork Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 bg-[#f8f9fa] overflow-hidden">
          <img
            src={artwork.previewImage}
            alt={artwork.title}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Bottom Metadata bar */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-white text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-zinc-900 font-medium">{artwork.category}</span>
            <span>·</span>
            <span>{artwork.digitalFile.colorSpace}</span>
            <span>·</span>
            <span>{artwork.digitalFile.dpi} DPI Archival</span>
          </div>
          <div className="text-zinc-400">
            {artwork.copyright}
          </div>
        </div>

      </div>
    </div>
  );
};
