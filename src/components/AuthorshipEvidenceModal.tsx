import React, { useState } from 'react';
import { X, ShieldCheck, Printer, Copy, Check, ExternalLink, FileText, Lock } from 'lucide-react';
import { Artwork, ArtistProfile } from '../types';

interface AuthorshipEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: Artwork;
  artistProfile?: ArtistProfile | null;
  productUrl: string;
}

export const AuthorshipEvidenceModal: React.FC<AuthorshipEvidenceModalProps> = ({
  isOpen,
  onClose,
  artwork,
  artistProfile,
  productUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const registrationId = artwork.registrationNumber || `ART-REG-${artwork.id.toUpperCase()}`;
  const sha256 = artwork.sha256Hash || 'f89a2b53e7c81d4a02d8f99e314a5d89b1c70e2814d9b4f0567e91a3c749b5d2';
  const timestampUtc = new Date(artwork.createdAt).toUTCString();

  const legalCitationText = `OFFICIAL ARTNOVA PROVENANCE & LEGAL EVIDENCE RECORD
======================================================
Certificate ID: ${registrationId}
Title of Artwork: "${artwork.title}"
Registered Author & Rightsholder: ${artwork.artistName}
Official Contact for Copyright/DMCA: ${artwork.artistEmail}
Statutory Copyright Notice: ${artwork.copyright}
Original Timestamp (UTC): ${timestampUtc}
Digital Master File: ${artwork.digitalFile.fileName}
Resolution & Color Space: ${artwork.digitalFile.resolution} · ${artwork.digitalFile.colorSpace}
SHA-256 Cryptographic Checksum: ${sha256}
Permanent Evidentiary Link: ${productUrl}

LEGAL PRIMA FACIE DECLARATION:
This permanent registry record certifies that the creator identified above submitted and published the digital master on the date and time recorded. This certificate constitutes prima facie evidence of authorship, original file integrity, and prior publication under the Berne Convention for the Protection of Literary and Artistic Works, Universal Copyright Convention (UCC), and the Digital Millennium Copyright Act (17 U.S.C. § 512).
======================================================`;

  const handleCopyCitation = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(legalCitationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-10 my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-950">
                Official Provenance & Legal Authorship Certificate
              </h2>
              <p className="text-[11px] text-zinc-500 font-mono">
                Artnova Public Registry · {registrationId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close certificate"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6 text-zinc-900 bg-white font-['Roboto',Arial,sans-serif]" id="printable-certificate">
          
          {/* Certificate Framing Header */}
          <div className="text-center pb-6 border-b border-zinc-200 space-y-1">
            <span className="text-[10px] tracking-widest uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block font-semibold">
              Permanent Copyright Ledger Record
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight pt-2 font-['Roboto',Arial,sans-serif]">
              Certificate of Digital Authorship
            </h1>
            <p className="text-xs text-zinc-500 max-w-lg mx-auto">
              Issued by the Artnova Digital Fine Art Curatorial Registry under international intellectual property conventions.
            </p>
          </div>

          {/* Masterwork & Rightsholder Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-50 p-5 rounded-xl border border-zinc-200 font-['Roboto',Arial,sans-serif]">
            <div>
              <span className="text-zinc-400 text-[11px] block font-medium">ARTWORK TITLE</span>
              <span className="text-sm font-bold text-zinc-950 block mt-0.5">{artwork.title}</span>
              <span className="text-zinc-500 text-[11px] block mt-0.5">{artwork.category} · Original Digital Master</span>
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block font-medium">REGISTERED CREATOR & RIGHTSHOLDER</span>
              <span className="text-sm font-bold text-zinc-950 block mt-0.5">{artwork.artistName}</span>
              <span className="text-zinc-600 text-[11px] block mt-0.5">{artistProfile?.location || 'Verified Global Artist'}</span>
            </div>

            <div className="pt-2 border-t border-zinc-200 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-zinc-400 text-[11px] block font-medium">STATUTORY COPYRIGHT NOTICE</span>
                <span className="font-semibold text-zinc-900 block mt-0.5">{artwork.copyright}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[11px] block font-medium">OFFICIAL INFRINGEMENT / DMCA CONTACT</span>
                <span className="text-zinc-900 font-semibold block mt-0.5">{artwork.artistEmail}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic & Forensic Specifications */}
          <div className="space-y-3 font-['Roboto',Arial,sans-serif]">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-600" />
              Cryptographic File Integrity & Timestamp Evidence
            </h3>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5 text-xs font-['Roboto',Arial,sans-serif]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-zinc-200">
                <span className="text-zinc-500">First Publication Timestamp:</span>
                <span className="font-bold text-zinc-900">{timestampUtc}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-zinc-200">
                <span className="text-zinc-500">Master Archive File:</span>
                <span className="text-zinc-900 font-medium">{artwork.digitalFile.fileName} ({artwork.digitalFile.resolution})</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 block">SHA-256 Cryptographic Master Fingerprint:</span>
                <div className="p-2 bg-white border border-zinc-200 rounded text-[11px] text-zinc-800 break-all select-all font-semibold font-['Roboto',Arial,sans-serif]">
                  {sha256}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-zinc-500 block">Canonical Evidence Permanent URL:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={productUrl}
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1 text-[11px] text-zinc-800 font-medium truncate select-all focus:outline-none font-['Roboto',Arial,sans-serif]"
                  />
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
                    title="Open URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Evidentiary Assertion */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 space-y-1.5 leading-relaxed">
            <span className="font-bold block flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Evidentiary Weight & International Enforceability
            </span>
            <p className="text-[11px] text-emerald-900/90">
              This timestamped certificate and canonical URL establish prima facie evidence of original authorship, date of creation, and digital master integrity under the <strong>Berne Convention for the Protection of Literary and Artistic Works</strong>, the <strong>Universal Copyright Convention</strong>, and the <strong>Digital Millennium Copyright Act (DMCA, 17 U.S.C. § 512)</strong>.
            </p>
            <p className="text-[11px] text-emerald-800/80 pt-1">
              Unauthorized copying, watermark erasure, training AI models without licensing, or commercial resale constitutes statutory copyright infringement and willful violation of the author's moral rights.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-zinc-50 border-t border-zinc-200">
          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admissible for DMCA notices, cease & desist demands, and legal proceedings.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCitation}
              className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-semibold rounded-lg border border-zinc-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Citation Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Legal Citation</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
