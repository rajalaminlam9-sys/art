import React from 'react';
import { X, ShieldCheck, CheckCircle2, Award, FileText, Calendar, ExternalLink } from 'lucide-react';
import { Artwork } from '../types';

interface AuthorshipEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: Artwork | null;
}

export const AuthorshipEvidenceModal: React.FC<AuthorshipEvidenceModalProps> = ({
  isOpen,
  onClose,
  artwork,
}) => {
  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-zinc-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Authorship & Provenance Evidence</h3>
              <p className="text-xs text-zinc-500">Verified cryptographic certificate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Artwork Title</span>
              <span className="font-semibold text-zinc-900">{artwork.title}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Artist Name</span>
              <span className="font-semibold text-zinc-900">{artwork.artistName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Certificate Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Verified Authentic
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Verification Proofs
            </h4>
            
            <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 bg-white">
              <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-900">Curator Peer Review</p>
                <p className="text-zinc-500 mt-0.5">Approved by the Artnova International Curation Board.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 bg-white">
              <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-900">Archival 8K Raw Master Files</p>
                <p className="text-zinc-500 mt-0.5">Includes raw uncompressed 300 DPI museum-grade TIFF.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 bg-white">
              <Calendar className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-900">Original Creation Date</p>
                <p className="text-zinc-500 mt-0.5">{artwork.createdAt || 'Certified 2026'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
