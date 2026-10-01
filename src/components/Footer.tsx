import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="w-full border-t border-zinc-200 bg-[#fafafa] text-zinc-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-950">Artnova</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-sm">
              Artnova is the curated international marketplace for original digital artworks. We empower independent digital artists and provide collectors with authenticated, archival-grade digital files.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Verified Digital Provenance
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                Worldwide Curation
              </span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('explore')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Explore Artworks
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('artists')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Artists Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('explore', { category: 'Architecture' })}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Architecture & Spaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('explore', { category: 'Abstract' })}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Abstract & Prisms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('explore', { category: 'Minimalism' })}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Minimalism & Modernist
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  About Artnova
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Curation Standards
                </button>
              </li>
              <li>
                <span className="text-zinc-400 cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-zinc-400 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-400 cursor-not-allowed">Copyright & Licensing</span>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Support & Social</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <a
                  href="mailto:curation@artnova.gallery"
                  className="hover:text-zinc-950 transition-colors flex items-center gap-1"
                >
                  curation@artnova.gallery
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <span className="text-zinc-500">Twitter / X: @artnova_gallery</span>
              </li>
              <li>
                <span className="text-zinc-500">Instagram: @artnova.art</span>
              </li>
              <li>
                <span className="text-zinc-500">Discord: Artnova Collective</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with copyright */}
        <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Artnova. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Archival TIFF & RAW Digital Files</span>
            <span>·</span>
            <span>Direct 90% Artist Royalty Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
