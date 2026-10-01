import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Award, Scale, ArrowRight, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 bg-white text-zinc-900">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
          The Artnova Curation Standard
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight">
          Pioneering the Digital Art Frontier
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Artnova is built on a simple philosophy: digital art is fine art. We provide serious artists with an elevated commercial sanctuary, and collectors with museum-grade archival files.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-950">Curated Artist Verification</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Anyone can create, but only vetted artists publish on Artnova. Every applicant is reviewed by our curatorial committee for originality, technical mastery, and artistic vision.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-sky-600 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-950">Archival Master Delivery</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Every digital acquisition includes original 16-bit uncompressed TIFF and RAW archives generated directly by the artist, pre-calibrated for gallery printing at 300 DPI.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-amber-600 shadow-2xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-950">Direct 90% Artist Royalties</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            We reject the exploitative 50–70% rake of legacy stock libraries. 90% of every transaction flows directly into the artist's studio.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-purple-600 shadow-2xs">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-950">Transparent Copyright & Provenance</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Each purchase generates a cryptographically signed collector certificate establishing legitimate digital ownership and display rights while fiercely defending the creator's moral rights.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 sm:p-10 text-center space-y-5">
        <h2 className="text-2xl font-bold text-zinc-950">Join the Artnova Ecosystem</h2>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Whether you are an established digital sculptor, an emerging algorithmic creator, or a discerning collector building an archival collection.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('explore')}
            className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            Explore Masterworks
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('artists')}
            className="px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-lg border border-zinc-300 transition-colors shadow-2xs"
          >
            Meet the Artists
          </button>
        </div>
      </div>

    </div>
  );
};
