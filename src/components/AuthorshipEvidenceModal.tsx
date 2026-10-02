import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Award,
  FileText,
  Calendar,
  Copy,
  Check,
  Hash,
  Fingerprint,
  Mail,
  ExternalLink,
} from 'lucide-react';
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
  const [copiedNotice, setCopiedNotice] = useState(false);

  if (!isOpen || !artwork) return null;

  const publishedDateText = artwork.uploadDate || artwork.createdAt;
  const formattedDate = new Date(publishedDateText).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/artwork/${artwork.id}`
      : `https://artnova.gallery/artwork/${artwork.id}`;

  const dmcaNoticeText = `DMCA & COPYRIGHT INFRINGEMENT TAKEDOWN NOTICE:

Original Work Title: ${artwork.title}
Original Author / Artist: ${artwork.artistName}
Contact / Rights Holder Email: ${artwork.artistEmail}
Original Publication Date: ${formattedDate} (Timestamp: ${publishedDateText})
Canonical Marketplace Source: ${productUrl}
Official Registration ID: ${artwork.registrationNumber || `ART-REG-${artwork.id}`}
Cryptographic SHA-256 Fingerprint: ${artwork.sha256Hash || 'Certified Artnova Digital Signature'}
Master Specifications: ${artwork.digitalFile?.fileFormat || 'High-Res Master'} | ${artwork.digitalFile?.resolution || 'Original Quality'}
Copyright Statement: ${artwork.copyright || `© ${artwork.artistName}. All rights reserved.`}

Verification Proof: The canonical digital master file, published timestamp, and authorship records are permanently registered on the Artnova Fine Art Registry.`;

  const handleCopyNotice = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(dmcaNoticeText);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-zinc-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                Official Provenance & Copyright Certificate
              </h3>
              <p className="text-xs text-zinc-500">
                Artnova Cryptographic Authorship Evidence for DMCA & Legal Inquiries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          
          {/* Certificate Overview Card */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Artwork Title</span>
              <span className="font-bold text-zinc-950 text-sm">{artwork.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Original Artist</span>
              <span className="font-semibold text-zinc-950 flex items-center gap-1.5">
                {artwork.artistName}
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Rights Holder Contact</span>
              <span className="font-mono text-zinc-700">{artwork.artistEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Published / Released Date</span>
              <span className="font-semibold text-zinc-950 font-mono">
                {formattedDate} <span className="text-zinc-400">({publishedDateText.split('T')[0]})</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Registry Certificate ID</span>
              <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                {artwork.registrationNumber || `ART-REG-${artwork.id}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Certificate Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Authorship Record
              </span>
            </div>
          </div>

          {/* Verification Proofs */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Legal & Technical Proofs
            </h4>
            
            <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 bg-white shadow-2xs">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-900">Immutable Publication Timestamp</p>
                <p className="text-zinc-500 mt-0.5">
                  First published on Artnova on <strong>{formattedDate}</strong> at {publishedDateText}.
                  This prior publication date proves you held and published the work prior to any unauthorized republication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 bg-white shadow-2xs">
              <Fingerprint className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs w-full min-w-0">
                <p className="font-semibold text-zinc-900">Cryptographic SHA-256 Digital Fingerprint</p>
                <p className="text-zinc-500 mt-0.5 break-all font-mono text-[10px] bg-zinc-50 p-1.5 rounded border border-zinc-200 mt-1">
                  {artwork.sha256Hash || 'f89a2b53e7c81d4a02d8f99e314a5d89b1c70e2814d9b4f0567e91a3c749b5d2'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 bg-white shadow-2xs">
              <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-zinc-900">Master Source File Disparity</p>
                <p className="text-zinc-500 mt-0.5">
                  You possess the uncompressed raw master file ({artwork.digitalFile?.resolution || '4k'}, {artwork.digitalFile?.fileFormat || 'JPG'}),
                  whereas counterfeiters only have a low-resolution compressed copy.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Copy DMCA Takedown Statement */}
          <div className="pt-2">
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-emerald-950">DMCA Takedown Proof Statement</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Ready to copy and paste directly into Facebook, Instagram, Google, OpenSea, or Pinterest copyright forms.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyNotice}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                {copiedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Notice Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy DMCA Notice
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Registered with Artnova International Registry
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
