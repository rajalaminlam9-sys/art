import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
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

  const artwork = artworks.find((a) => a.id === selectedArtworkId) || artworks[0];

  if (!artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-950">Artwork Not Found</h2>
        <button
          onClick={() => navigate('explore')}
          className="mt-4 px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold shadow-xs"
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

  // Automatically inject Open Graph & Schema.org JSON-LD metadata for external crawlers/investigators
  useEffect(() => {
    if (!artwork) return;
    document.title = `${artwork.title} by ${artwork.artistName} — Artnova`;

    const updateMeta = (nameOrProp: string, content: string, isName = false) => {
      let tag = document.querySelector(isName ? `meta[name="${nameOrProp}"]` : `meta[property="${nameOrProp}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        if (isName) tag.setAttribute('name', nameOrProp);
        else tag.setAttribute('property', nameOrProp);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMeta('author', `${artwork.artistName} <${artwork.artistEmail}>`, true);
    updateMeta('creator', `${artwork.artistName} <${artwork.artistEmail}>`, true);
    updateMeta('owner', artwork.artistEmail, true);
    updateMeta('reply-to', artwork.artistEmail, true);
    updateMeta('copyright', `${artwork.copyright} | Rights Holder: ${artwork.artistEmail}`, true);

    updateMeta('og:title', `${artwork.title} by ${artwork.artistName}`);
    updateMeta('og:description', `${artwork.description} | Copyright: ${artwork.copyright} | Owner Email: ${artwork.artistEmail}`);
    updateMeta('og:image', artwork.previewImage);
    updateMeta('og:url', productUrl);
    updateMeta('og:type', 'article');
    updateMeta('og:email', artwork.artistEmail);
    updateMeta('article:published_time', artwork.uploadDate || artwork.createdAt);
    updateMeta('article:author', `${artwork.artistName} (${artwork.artistEmail})`);

    // Dublin Core Archival & Legal Registry Standards
    updateMeta('DC.creator', `${artwork.artistName} <${artwork.artistEmail}>`, true);
    updateMeta('DC.rights', `${artwork.copyright} (Rights Holder Contact: ${artwork.artistEmail})`, true);
    updateMeta('DC.date.created', artwork.uploadDate || artwork.createdAt, true);
    updateMeta('DC.identifier', artwork.registrationNumber || `ART-REG-${artwork.id}`, true);

    // Schema.org VisualArtwork structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'VisualArtwork',
      name: artwork.title,
      image: artwork.previewImage,
      description: artwork.description,
      datePublished: artwork.uploadDate || artwork.createdAt,
      creator: {
        '@type': 'Person',
        name: artwork.artistName,
        email: artwork.artistEmail,
      },
      author: {
        '@type': 'Person',
        name: artwork.artistName,
        email: artwork.artistEmail,
      },
      copyrightHolder: {
        '@type': 'Person',
        name: artwork.artistName,
        email: artwork.artistEmail,
      },
      copyrightNotice: `${artwork.copyright} | Rights Holder Email: ${artwork.artistEmail}`,
      artMedium: artwork.category,
      artform: 'Digital Art',
      identifier: artwork.registrationNumber || `ART-REG-${artwork.id}`,
      offers: {
        '@type': 'Offer',
        price: artwork.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: productUrl,
        seller: {
          '@type': 'Person',
          name: artwork.artistName,
          email: artwork.artistEmail,
        },
      },
    };

    let scriptTag = document.getElementById('artwork-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'artwork-jsonld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      // Clean up script on unmount
      const existing = document.getElementById('artwork-jsonld');
      if (existing) existing.remove();
    };
  }, [artwork, productUrl]);

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

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(artwork);
    }
    navigate('checkout');
  };

  // Format date exactly like the mockup: "10 Jan 2026"
  const formatPublishedDate = (dateStr?: string) => {
    if (!dateStr) return '10 Jan 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const publishedDateText = formatPublishedDate(artwork.uploadDate || artwork.createdAt);

  const cleanFormat = artwork.digitalFile?.fileFormat
    ? artwork.digitalFile.fileFormat.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '') || 'JPG'
    : 'JPG';

  const cleanResolution = artwork.digitalFile?.resolution
    ? artwork.digitalFile.resolution.split(' ')[0] || '4k'
    : '4k';

  const copyrightText =
    artwork.copyright ||
    `©${new Date().getFullYear()} ${artwork.artistName} | All Rights Reserved.`;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 w-full space-y-6 sm:space-y-8 bg-white text-zinc-900">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100">
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
          <span className="text-zinc-900 font-medium truncate max-w-[180px] sm:max-w-xs">{artwork.title}</span>
        </div>

        <button
          onClick={() => navigate('artist-profile', { artistId: artwork.artistId })}
          className="text-xs text-zinc-600 hover:text-zinc-950 font-medium flex items-center gap-1"
        >
          View Artist Gallery <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MAIN SINGLE PRODUCT CARD CONTAINER (Exact Mockup Design for Mobile & Refined Desktop) */}
      <div className="border border-zinc-300 rounded-3xl p-4 sm:p-7 bg-white shadow-xs">
        
        {/* TOP BAR: Artist Avatar + Full Name with Verified Badge (Left) & Published on Date (Right) */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Avatar & Verified Artist Full Name */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('artist-profile', { artistId: artwork.artistId })}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              {artistProfile?.profileImage ? (
                <img
                  src={artistProfile.profileImage}
                  alt={artwork.artistName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-zinc-700 text-lg">
                  {artwork.artistName[0]}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center min-w-0">
              {/* Full Artist Name + Blue Badge right beside it */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <button
                  type="button"
                  onClick={() => navigate('artist-profile', { artistId: artwork.artistId })}
                  className="text-base sm:text-lg font-bold text-zinc-950 hover:underline text-left whitespace-nowrap"
                >
                  {artwork.artistName}
                </button>
                {/* Blue Verified Checkmark Badge */}
                <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500 text-white shrink-0 inline-block" />
              </div>
              {/* Verified Artist label directly below name */}
              <p className="text-xs text-zinc-500 font-medium mt-0.5 leading-none">
                Verified Artist
              </p>
            </div>
          </div>

          {/* Right: Published on Date */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-medium shrink-0 pl-15 xs:pl-0">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>
              Published on: <strong className="font-semibold text-zinc-950">{publishedDateText}</strong>
            </span>
          </div>
        </div>

        {/* Divider line across below header */}
        <div className="border-b border-zinc-200 my-3.5 sm:my-4" />

        {/* RESPONSIVE LAYOUT: On Mobile stacks vertically; On Desktop elegant 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ARTWORK IMAGE SECTION (Full width on mobile, 7-col on desktop) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative group rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs">
              <img
                src={artwork.previewImage}
                alt={artwork.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[520px] object-cover mx-auto"
              />

              {/* Click to Zoom Overlay */}
              <button
                onClick={onOpenLightbox}
                aria-label="Inspect high resolution image"
                className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold cursor-zoom-in"
              >
                <span className="px-3.5 py-2 bg-white text-zinc-950 rounded-xl flex items-center gap-2 shadow-md">
                  <ZoomIn className="w-4 h-4 text-zinc-800" />
                  Inspect Full Canvas (Zoom)
                </span>
              </button>
            </div>

            {/* Quick action pill row under image (Wishlist, Share, Zoom) */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                onClick={() => toggleWishlist(artwork.id)}
                className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs transition-colors ${
                  inWishlist
                    ? 'border-rose-300 text-rose-600 bg-rose-50 font-semibold'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
                {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedShare ? 'Link Copied!' : 'Share Artwork'}
              </button>
            </div>
          </div>

          {/* DETAILS & ACTIONS SECTION (Full width on mobile, 5-col on desktop) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Artwork Title (Optional subtitle for desktop clarity) */}
            <div className="hidden lg:block pb-1">
              <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">{artwork.title}</h1>
            </div>

            {/* 1. DETAILS SECTION (Underline Header + Colon-aligned List) */}
            <div>
              <div className="inline-block border-b-2 border-zinc-300 pb-0.5 mb-2.5">
                <h3 className="text-sm font-bold text-zinc-900">Details</h3>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-800">
                <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[105px_1fr] gap-1 items-baseline">
                  <span className="font-bold text-zinc-950">Category</span>
                  <span className="text-zinc-800">: {artwork.category}</span>
                </div>
                <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[105px_1fr] gap-1 items-baseline">
                  <span className="font-bold text-zinc-950">Format</span>
                  <span className="text-zinc-800 uppercase">: {cleanFormat}</span>
                </div>
                <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[105px_1fr] gap-1 items-baseline">
                  <span className="font-bold text-zinc-950">Resolution</span>
                  <span className="text-zinc-800 font-mono">: {cleanResolution}</span>
                </div>
                <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[105px_1fr] gap-1 items-baseline">
                  <span className="font-bold text-zinc-950">Description</span>
                  <span className="leading-relaxed text-zinc-800">: {artwork.description}</span>
                </div>
              </div>
            </div>

            {/* 2. COPYRIGHT OWNER SECTION (Underline Header + Key-Values) */}
            <div className="pt-2">
              <div className="inline-block border-b-2 border-zinc-300 pb-0.5 mb-2.5">
                <h3 className="text-sm font-bold text-zinc-900">Copyright Owner</h3>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-800">
                <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[105px_1fr] gap-1 items-baseline">
                  <span className="font-bold text-zinc-950">Artist</span>
                  <span className="text-zinc-800">: {artwork.artistName}</span>
                </div>
                <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[105px_1fr] gap-1 items-baseline">
                  <span className="font-bold text-zinc-950">Contact</span>
                  <span className="text-zinc-800 font-mono">: {artwork.artistEmail}</span>
                </div>
                <p className="font-bold text-zinc-950 pt-1 text-xs">
                  {copyrightText}
                </p>
              </div>
            </div>

            {/* 3. PRICE & ACTION BUTTONS (Exact Match with Mockup: Price Box Left, Stacked Buttons Right) */}
            <div className="pt-4 border-t border-zinc-200">
              <div className="flex items-end gap-3.5 sm:gap-4">
                
                {/* Price Display Card */}
                <div className="space-y-1 shrink-0">
                  <span className="text-xs font-semibold text-zinc-500 block">Price</span>
                  <div className="border border-zinc-300 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-center min-w-[115px] sm:min-w-[130px] bg-white shadow-2xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight tabular-nums">
                      {artwork.price}$
                    </span>
                  </div>
                </div>

                {/* Stacked Action Buttons: Black Add to Cart + White Buy Now */}
                <div className="flex-1 flex flex-col gap-2">
                  <button
                    onClick={() => addToCart(artwork)}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        In Your Cart
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
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-950 font-bold text-xs sm:text-sm border border-zinc-300 transition-colors shadow-2xs text-center"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Provenance & Authorship Certificate Link */}
            <div className="pt-2 text-xs flex items-center justify-between text-zinc-500">
              <div className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant High-Res Master Download</span>
              </div>
              <button
                onClick={() => setEvidenceModalOpen(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
              >
                View Provenance Certificate
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Direct Product URL Box */}
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-700 font-medium">
          <Link2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Product Direct URL:</span>
          <span className="font-mono text-zinc-500 truncate max-w-xs">{productUrl}</span>
        </div>
        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-semibold shrink-0 transition-colors flex items-center justify-center gap-1.5 text-xs shadow-xs"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Copied URL
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy URL
            </>
          )}
        </button>
      </div>

      {/* Authorship Evidence Modal */}
      <AuthorshipEvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        artwork={artwork}
      />

      {/* More Works by this Artist */}
      {artistOtherWorks.length > 0 && (
        <section className="pt-8 border-t border-zinc-200 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950">
              More works by {artwork.artistName}
            </h3>
            <button
              onClick={() =>
                navigate('artist-profile', { artistId: artwork.artistId })
              }
              className="text-xs text-zinc-600 hover:text-zinc-950 font-semibold flex items-center gap-1"
            >
              View Artist Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistOtherWorks.map((otherArt) => (
              <ArtworkCard key={otherArt.id} artwork={otherArt} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
