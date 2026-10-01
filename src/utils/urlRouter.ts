import { Artwork, ArtistProfile } from '../types';
import { NavigationTarget } from '../context/AppContext';

export interface ParsedRoute {
  view: NavigationTarget;
  artworkId: string | null;
  artistId: string | null;
  category: string;
}

/**
 * Parses current browser location (pathname, search query params, and hash)
 * into a typed route state for Artnova.
 */
export function parseCurrentLocation(
  artworks: Artwork[] = [],
  _artists: ArtistProfile[] = []
): ParsedRoute {
  if (typeof window === 'undefined') {
    return { view: 'home', artworkId: null, artistId: null, category: 'All' };
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, '');

  // 1. Check Pathname: /artwork/:id
  const artworkPathMatch = pathname.match(/^\/artwork\/([^/]+)/i);
  if (artworkPathMatch) {
    const rawId = decodeURIComponent(artworkPathMatch[1]);
    const matchedArtwork = artworks.find(
      (a) =>
        a.id.toLowerCase() === rawId.toLowerCase() ||
        a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId.toLowerCase()
    );
    return {
      view: 'artwork',
      artworkId: matchedArtwork ? matchedArtwork.id : rawId,
      artistId: null,
      category: 'All',
    };
  }

  // 2. Check Query Param: ?artwork=:id or ?id=:id or ?product=:id
  const queryArtworkId =
    searchParams.get('artwork') ||
    searchParams.get('id') ||
    searchParams.get('product');
  if (queryArtworkId) {
    const rawId = decodeURIComponent(queryArtworkId);
    const matchedArtwork = artworks.find(
      (a) =>
        a.id.toLowerCase() === rawId.toLowerCase() ||
        a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId.toLowerCase()
    );
    return {
      view: 'artwork',
      artworkId: matchedArtwork ? matchedArtwork.id : rawId,
      artistId: null,
      category: 'All',
    };
  }

  // 3. Check Hash: #/artwork/:id or #artwork/:id
  const hashArtworkMatch = hash.match(/^artwork\/([^/]+)/i);
  if (hashArtworkMatch) {
    const rawId = decodeURIComponent(hashArtworkMatch[1]);
    const matchedArtwork = artworks.find(
      (a) =>
        a.id.toLowerCase() === rawId.toLowerCase() ||
        a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId.toLowerCase()
    );
    return {
      view: 'artwork',
      artworkId: matchedArtwork ? matchedArtwork.id : rawId,
      artistId: null,
      category: 'All',
    };
  }

  // 4. Check Pathname: /artist/:id
  const artistPathMatch = pathname.match(/^\/artist(?:-profile)?\/([^/]+)/i);
  if (artistPathMatch) {
    return {
      view: 'artist-profile',
      artworkId: null,
      artistId: decodeURIComponent(artistPathMatch[1]),
      category: 'All',
    };
  }
  const queryArtistId = searchParams.get('artist');
  if (queryArtistId) {
    return {
      view: 'artist-profile',
      artworkId: null,
      artistId: decodeURIComponent(queryArtistId),
      category: 'All',
    };
  }

  // 5. Standard Named Views
  const categoryParam = searchParams.get('category') || 'All';

  if (pathname === '/explore' || hash === 'explore' || searchParams.get('view') === 'explore') {
    return { view: 'explore', artworkId: null, artistId: null, category: categoryParam };
  }
  if (pathname === '/artists' || hash === 'artists' || searchParams.get('view') === 'artists') {
    return { view: 'artists', artworkId: null, artistId: null, category: 'All' };
  }
  if (pathname === '/cart' || hash === 'cart' || searchParams.get('view') === 'cart') {
    return { view: 'cart', artworkId: null, artistId: null, category: 'All' };
  }
  if (pathname === '/checkout' || hash === 'checkout' || searchParams.get('view') === 'checkout') {
    return { view: 'checkout', artworkId: null, artistId: null, category: 'All' };
  }
  if (pathname === '/buyer-dashboard' || hash === 'buyer-dashboard' || searchParams.get('view') === 'buyer-dashboard') {
    return { view: 'buyer-dashboard', artworkId: null, artistId: null, category: 'All' };
  }
  if (pathname === '/artist-dashboard' || hash === 'artist-dashboard' || searchParams.get('view') === 'artist-dashboard') {
    return { view: 'artist-dashboard', artworkId: null, artistId: null, category: 'All' };
  }
  if (pathname === '/admin-dashboard' || hash === 'admin-dashboard' || searchParams.get('view') === 'admin-dashboard') {
    return { view: 'admin-dashboard', artworkId: null, artistId: null, category: 'All' };
  }
  if (pathname === '/about' || hash === 'about' || searchParams.get('view') === 'about') {
    return { view: 'about', artworkId: null, artistId: null, category: 'All' };
  }

  return { view: 'home', artworkId: null, artistId: null, category: categoryParam };
}

/**
 * Builds the URL string for any target view and parameters.
 */
export function buildUrlForView(
  view: NavigationTarget,
  params?: { artworkId?: string; artistId?: string; category?: string }
): string {
  if (view === 'artwork' && params?.artworkId) {
    return `/artwork/${params.artworkId}`;
  }
  if (view === 'artist-profile' && params?.artistId) {
    return `/artist/${params.artistId}`;
  }
  if (view === 'explore') {
    if (params?.category && params.category !== 'All') {
      return `/explore?category=${encodeURIComponent(params.category)}`;
    }
    return '/explore';
  }
  if (view === 'home') {
    return '/';
  }
  return `/${view}`;
}
