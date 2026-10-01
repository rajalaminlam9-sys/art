import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  ShoppingBag,
  Share2,
  ZoomIn,
  Calendar,
  Check,
  ShieldCheck,
  ArrowRight,
  Link2,
  Copy,
  Mail,
  Award,
  FileCheck,
  Lock,
} from 'lucide-react';
import { ArtworkCard } from '../components/ArtworkCard';
import { AuthorshipEvidenceModal } from '../components/AuthorshipEvidenceModal';

interface ArtworkDetailPageProps {
  onOpenLightbox: () => void;
  onOpenAuth: () => void;
}

export const ArtworkDetailPage: React.FC<ArtworkDetailPageProps> = ({
  onOpenLightbox,
  onOpenAuth: _onOpenAuth,
}) => {
  const {
    artworks,
    artists,
    selectedArtworkId,
    navigate,
    addToCart,
    isInCart,
    toggleWishlist,
    isInWishlist,
    addToast,
  } = useApp();

  const [copiedShare, setCopiedShare] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const artwork = artworks.find((a) => a.id === selectedArtworkId) || artworks[0];

  if (!artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-950">Artwork Not Found</h2>
        <button
          onClick={() => navigate('explore')}
          className="mt-4 px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const artistProfile = artists.find((a) => a.id === artwork.artistId);
  const inCart = isInCart(artwork.id);
  const inWishlist = isInWishlist(artwork.id);

  const artistOtherWorks = artworks
    .filter((a) => a.artistId === artwork.artistId && a.id !== artwork.id && a.status === 'published')
    .slice(0, 3);

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/artwork/${artwork.id}`
      : `https://artnova.gallery/artwork/${artwork.id}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productUrl);
      setCopiedShare(true);
      addToast({
        type: 'success',
        title: 'Product URL Copied',
        message: `${productUrl} copied to clipboard.`,
      });
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleCopyLegalCitation = () => {
    const citation = `OFFICIAL ARTNOVA EVIDENCE OF COPYRIGHT OWNERSHIP & PRIOR PUBLICATION
======================================================
Certificate / Registry ID: ${artwork.registrationNumber || `ART-REG-${artwork.id.toUpperCase()}`}
Title: "${artwork.title}"
Registered Creator & Author: ${artwork.artistName}
Verified Contact Email: ${artwork.artistEmail}
Statutory Copyright Notice: ${artwork.copyright}
Prior Publication Timestamp: ${new Date(artwork.createdAt).toUTCString()}
Digital Master SHA-256 Fingerprint: ${artwork.sha256Hash || 'f89a2b53e7c81d4a02d8f99e314a5d89b1c70e2814d9b4f0567e91a3c749b5d2'}
Canonical Evidence URL: ${productUrl}

LEGAL PRIMA FACIE DECLARATION:
This permanent digital record establishes prima facie evidence of copyright ownership and prior art under the Berne Convention for the Protection of Literary and Artistic Works and the Digital Millennium Copyright Act (17 U.S.C. § 512). Authorized for inclusion in formal DMCA takedown notices and infringement proceedings.
======================================================`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      addToast({
        type: 'success',
        title: 'Legal Citation Copied',
        message: 'Court-admissible copyright evidence copied for DMCA notice.',
      });
      setTimeout(() => setCopiedCitation(false), 2800);
    }
  };

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(artwork);
    }
    navigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* Top Breadcrumb & Quick Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('explore')}
            className="hover:text-zinc-950 transition-colors"
          >
            Explore
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('explore', { category: artwork.category })}
            className="hover:text-zinc-950 transition-colors"
          >
            {artwork.category}
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">{artwork.title}</span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-500">
          <Calendar className="w-3.5 h-3.5" />
          Uploaded {new Date(artwork.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* 1. TITLE & CATEGORY HEADER (Comes before Image) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="text-emerald-700 font-semibold">{artwork.category}</span>
          <span>·</span>
          <span>Original Digital Master</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 tracking-tight">
          {artwork.title}
        </h1>
      </div>

      {/* 2. ARTWORK IMAGE CANVAS (Then Image) */}
      <div className="space-y-4">
        <div className="relative group bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-zinc-100 flex items-center justify-center">
            <img
              src={artwork.previewImage}
              alt={artwork.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Click to inspect zoom overlay */}
            <button
              onClick={onOpenLightbox}
              aria-label="Inspect high resolution image"
              className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold cursor-zoom-in"
            >
              <span className="px-4 py-2 bg-white text-zinc-950 rounded-lg flex items-center gap-2 shadow-lg">
                <ZoomIn className="w-4 h-4 text-zinc-700" />
                Inspect Archival Canvas (Zoom)
              </span>
            </button>
          </div>
        </div>

        {/* Archival Specification Bar */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 block text-[11px]">Format</span>
            <span className="text-zinc-900 font-semibold truncate block">
              {artwork.digitalFile.fileFormat.split(' ')[0]}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Resolution</span>
            <span className="text-zinc-900 font-semibold font-mono tabular-nums block">
              {artwork.digitalFile.resolution.split(' ')[0]}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Color Space</span>
            <span className="text-zinc-900 font-semibold block">
              {artwork.digitalFile.colorSpace.split(' ')[0]}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Archival Standard</span>
            <span className="text-zinc-900 font-semibold block">
              {artwork.digitalFile.dpi} DPI Print Ready
            </span>
          </div>
        </div>
      </div>

      {/* 3. ARTIST INFO BOX & 4. ADD TO CART OPTIONS (Grid below Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* Left Column (Desktop 7 cols): 3. Artist Info Box, then Description & Tags */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 3. ARTIST INFO BOX (Legal Authorship & Provenance Information) */}
          <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Legal Authorship & Copyright Registry
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="View official legal evidence certificate for copyright enforcement"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Legal Evidence Record</span>
                </button>
                <button
                  onClick={() =>
                    navigate('artist-profile', { artistId: artwork.artistId })
                  }
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-base font-bold text-zinc-800 shrink-0 overflow-hidden shadow-xs">
                {artistProfile?.profileImage ? (
                  <img
                    src={artistProfile.profileImage}
                    alt={artwork.artistName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  artwork.artistName[0]
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight">
                    {artwork.artistName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Verified Creator & Sole Copyright Owner
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600 bg-zinc-200/80 px-2 py-0.5 rounded font-semibold">
                    {artwork.registrationNumber || `REG-${artwork.artistId.toUpperCase()}`}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {artistProfile?.bio || `Independent digital artist specializing in curated fine art masterworks on Artnova.`}
                </p>

                {/* Evidentiary Metadata Container (Contact Mail & Copyright) */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-700">
                  <span className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-2xs">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-500">Official Contact & Licensing:</span>
                    <a
                      href={`mailto:${artwork.artistEmail}?subject=Artnova%20Copyright%20Inquiry%20-%20${encodeURIComponent(artwork.title)}`}
                      className="text-zinc-950 font-semibold hover:text-emerald-700 underline underline-offset-2"
                    >
                      {artwork.artistEmail}
                    </a>
                  </span>

                  <span className="text-zinc-300" aria-hidden="true">·</span>

                  <span className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-zinc-500">Statutory Copyright:</span>
                    <strong className="text-zinc-950 font-bold">{artwork.copyright}</strong>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200 ml-1">
                      Berne & DMCA Enforced
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Evidentiary Legal Notice & Forensic Ledger Box */}
            <div className="p-4 bg-white border border-zinc-200 rounded-xl space-y-3 text-xs font-['Roboto',Arial,sans-serif]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-100 text-[11px] text-zinc-500 font-['Roboto',Arial,sans-serif]">
                <span className="flex items-center gap-1.5 font-['Roboto',Arial,sans-serif]">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Prior Publication Date: <strong className="text-zinc-900 font-semibold font-['Roboto',Arial,sans-serif]">{new Date(artwork.createdAt).toUTCString()}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-['Roboto',Arial,sans-serif]">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  SHA-256 Hash: <strong className="text-zinc-900 font-semibold truncate max-w-[170px] select-all font-['Roboto',Arial,sans-serif]">{artwork.sha256Hash || 'f89a2b53e7c81d4a02d8f99e314a5d89b1c70e2814d9b4f0567e91a3c749b5d2'}</strong>
                </span>
              </div>

              <div className="text-[11px] text-zinc-600 leading-relaxed font-['Roboto',Arial,sans-serif]">
                <strong className="text-zinc-900 font-semibold font-['Roboto',Arial,sans-serif]">Legal Evidence of Ownership Notice:</strong> This permanent artwork page (<span className="text-zinc-800 font-medium font-['Roboto',Arial,sans-serif]">{productUrl}</span>) serves as timestamped, admissible prima facie evidence under the <strong className="font-['Roboto',Arial,sans-serif]">Berne Convention for the Protection of Literary and Artistic Works</strong> and the <strong className="font-['Roboto',Arial,sans-serif]">Digital Millennium Copyright Act (DMCA, 17 U.S.C. § 512)</strong>. If this artwork is reproduced, republished, or scraped without license, the artist may cite this verified URL and SHA-256 fingerprint in formal DMCA takedown demands and statutory infringement litigation.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-['Roboto',Arial,sans-serif]">
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 underline underline-offset-2 font-['Roboto',Arial,sans-serif]"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  View Official Certificate of Authorship (PDF/Print)
                </button>

                <button
                  onClick={handleCopyLegalCitation}
                  className="font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1.5 hover:underline font-['Roboto',Arial,sans-serif]"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Citation Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Legal DMCA Citation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 pt-1">
              Purchasing grants verified digital collector display and non-exclusive reproduction rights. Commercial resale without artist permission is strictly prohibited.
            </p>
          </div>

          {/* Artwork Concept & Description */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Concept & Description
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {/* Artistic Tags */}
          {artwork.tags.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Artistic Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {artwork.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate('explore', { category: 'All' })}
                    className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs rounded-lg transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Desktop 5 cols): 4. Add to Cart Options (Then Add to Cart Option gulo) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-5 shadow-xs sticky top-24">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-500 block">Collector Acquisition Price</span>
                <div className="text-3xl font-bold text-zinc-950 font-mono tabular-nums">
                  ${artwork.price}{' '}
                  <span className="text-sm font-normal text-zinc-500">{artwork.currency}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-700 block font-semibold">
                  Direct Artist Royalty: 90%
                </span>
                <span className="text-[10px] text-zinc-500">Instant Download</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => addToCart(artwork)}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                  inCart
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-white'
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    Artwork in Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 transition-colors shadow-xs"
              >
                Buy Now with 1-Click
              </button>
            </div>

            {/* Secondary actions: Wishlist & Share */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 text-xs">
              <button
                onClick={() => toggleWishlist(artwork.id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-colors ${
                  inWishlist
                    ? 'border-rose-300 text-rose-600 bg-rose-50'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedShare ? 'Copied URL!' : 'Share Piece'}
              </button>
            </div>

            {/* Direct Product URL Box */}
            <div className="pt-3 border-t border-zinc-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                  Product Page URL
                </span>
                <span className="text-zinc-400 font-mono text-[10px]">Direct Link</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={productUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  aria-label="Direct Product URL"
                  className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 font-mono truncate w-full select-all focus:outline-none focus:border-zinc-400"
                />
                <button
                  onClick={handleShare}
                  title="Copy direct product URL"
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-2xs flex items-center gap-1"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* License & Provenance guarantee */}
            <div className="pt-3 border-t border-zinc-200 flex items-start gap-2.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Certified archival license included. Instant download link in My Purchases upon payment.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* More Works by this Artist */}
      {artistOtherWorks.length > 0 && (
        <section className="pt-12 border-t border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-950">More works by {artwork.artistName}</h3>
            <button
              onClick={() =>
                navigate('artist-profile', { artistId: artwork.artistId })
              }
              className="text-xs text-zinc-600 hover:text-zinc-950 font-semibold"
            >
              View Full Gallery
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistOtherWorks.map((otherArt) => (
              <ArtworkCard key={otherArt.id} artwork={otherArt} />
            ))}
          </div>
        </section>
      )}

      {/* Official Authorship & Legal Provenance Certificate Modal */}
      <AuthorshipEvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        artwork={artwork}
        artistProfile={artistProfile}
        productUrl={productUrl}
      />

    </div>
  );
};
