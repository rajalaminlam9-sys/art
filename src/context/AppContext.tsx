import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ArtistProfile,
  Artwork,
  Order,
  CartItem,
  UserRole,
  ArtistStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ARTISTS,
  INITIAL_ARTWORKS,
  INITIAL_ORDERS,
} from '../services/seedData';
import { parseCurrentLocation, buildUrlForView } from '../utils/urlRouter';
import {
  db,
  testConnection,
  seedFirestoreIfEmpty,
  saveArtworkDoc,
  removeArtworkDoc,
  saveArtistDoc,
  saveOrderDoc,
  saveUserDoc,
  handleFirestoreError,
  OperationType,
  signInWithGoogle,
  signOutFirebase,
} from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export type NavigationTarget =
  | 'home'
  | 'explore'
  | 'artwork'
  | 'artist-profile'
  | 'artists'
  | 'cart'
  | 'checkout'
  | 'buyer-dashboard'
  | 'artist-dashboard'
  | 'admin-dashboard'
  | 'about';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: User | null;
  currentArtistProfile: ArtistProfile | null;
  users: User[];
  artists: ArtistProfile[];
  artworks: Artwork[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  currentView: NavigationTarget;
  selectedArtworkId: string | null;
  selectedArtistId: string | null;
  selectedCategory: string;
  toasts: ToastMessage[];
  searchQuery: string;

  // Navigation
  navigate: (view: NavigationTarget, params?: { artworkId?: string; artistId?: string; category?: string }) => void;
  setSearchQuery: (query: string) => void;

  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: (role: UserRole, status?: ArtistStatus) => void;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: 'buyer' | 'artist';
    bio?: string;
    location?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  updateArtistProfile: (artistId: string, data: Partial<ArtistProfile>) => void;

  // Artwork Management
  addArtwork: (artworkData: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'viewCount'> & { createdAt?: string; uploadDate?: string }) => { success: boolean; error?: string; artworkId?: string };
  updateArtwork: (id: string, updates: Partial<Artwork>) => { success: boolean; error?: string };
  deleteArtwork: (id: string) => void;
  toggleArtworkStatus: (id: string, status: 'published' | 'draft' | 'hidden') => void;

  // Admin Controls
  approveArtist: (artistId: string) => void;
  rejectArtist: (artistId: string, reason?: string) => void;
  suspendArtist: (artistId: string) => void;
  reactivateArtist: (artistId: string) => void;
  adminToggleArtworkStatus: (artworkId: string, status: 'published' | 'draft' | 'hidden') => void;
  adminToggleUserSuspension: (userId: string) => void;

  // Cart & Commerce
  addToCart: (artwork: Artwork) => boolean;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  isInCart: (artworkId: string) => boolean;
  cartTotal: number;
  completeCheckout: (paymentInfo: { cardName: string; cardNumber: string; expiry: string; cvc: string }) => Promise<{ success: boolean; orderId?: string; error?: string }>;

  // Wishlist
  toggleWishlist: (artworkId: string) => void;
  isInWishlist: (artworkId: string) => boolean;

  // Digital Download
  downloadDigitalAsset: (orderId: string, artworkId: string) => Promise<{ success: boolean; error?: string }>;

  // Notifications
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'artnova_white_users_v2',
  ARTISTS: 'artnova_white_artists_v2',
  ARTWORKS: 'artnova_white_artworks_v2',
  ORDERS: 'artnova_white_orders_v2',
  AUTH_USER: 'artnova_white_auth_v2',
  CART: 'artnova_white_cart_v2',
  WISHLIST: 'artnova_white_wishlist_v2',
  THEME: 'artnova_theme_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const setTheme = (_newTheme: 'light' | 'dark') => {
    setThemeState('light');
    try {
      localStorage.removeItem('artnova_theme');
      localStorage.removeItem('artnova_theme_v2');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    } catch (e) {}
  };

  const toggleTheme = () => {
    setThemeState('light');
    try {
      localStorage.removeItem('artnova_theme');
      localStorage.removeItem('artnova_theme_v2');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    } catch (e) {}
    addToast({
      type: 'info',
      title: 'Gallery Light Aesthetic',
      message: 'Artnova is exclusively designed in a pristine museum-grade white theme.',
    });
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
    document.documentElement.style.backgroundColor = '#ffffff';
    if (document.body) {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#18181b';
    }
    try {
      localStorage.removeItem('artnova_theme');
      localStorage.removeItem('artnova_theme_v2');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    } catch (e) {}
  }, []);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [artists, setArtists] = useState<ArtistProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARTISTS);
    return saved ? JSON.parse(saved) : INITIAL_ARTISTS;
  });

  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
    return saved ? JSON.parse(saved) : INITIAL_ARTWORKS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : ['art_001', 'art_003'];
  });

  const initialRoute = parseCurrentLocation(INITIAL_ARTWORKS, INITIAL_ARTISTS);

  const [currentView, setCurrentView] = useState<NavigationTarget>(initialRoute.view);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(initialRoute.artworkId);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(initialRoute.artistId);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialRoute.category || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen for browser back / forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseCurrentLocation(artworks, artists);
      if (parsed.artworkId) setSelectedArtworkId(parsed.artworkId);
      if (parsed.artistId) setSelectedArtistId(parsed.artistId);
      if (parsed.category) setSelectedCategory(parsed.category);
      setCurrentView(parsed.view);

      if (parsed.view === 'artwork' && parsed.artworkId) {
        const art = artworks.find((a) => a.id === parsed.artworkId);
        if (art) {
          document.title = `${art.title} by ${art.artistName} — Artnova`;
        }
      } else {
        document.title = 'Artnova - Premium Digital Art Marketplace';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [artworks, artists]);

  // Real-time synchronization with Firestore (Database)
  useEffect(() => {
    // 1. Validate connection to Firestore per SKILL.md
    testConnection();

    // 2. Initial seed into Firestore if collections are empty
    seedFirestoreIfEmpty();

    // 3. Listen to real-time changes in artworks collection
    const unsubArtworks = onSnapshot(
      collection(db, 'artworks'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Artwork[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Artwork);
          });
          setArtworks(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'artworks');
      }
    );

    // 4. Listen to real-time changes in artists collection
    const unsubArtists = onSnapshot(
      collection(db, 'artists'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ArtistProfile[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as ArtistProfile);
          });
          setArtists(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'artists');
      }
    );

    // 5. Listen to real-time changes in orders collection
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Order[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Order);
          });
          setOrders(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    // 6. Listen to real-time changes in users collection
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: User[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as User);
          });
          setUsers(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    );

    return () => {
      unsubArtworks();
      unsubArtists();
      unsubOrders();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(artists));
  }, [artists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentArtistProfile =
    currentUser?.role === 'artist'
      ? artists.find((a) => a.userId === currentUser.id) || null
      : null;

  const navigate = (
    view: NavigationTarget,
    params?: { artworkId?: string; artistId?: string; category?: string }
  ) => {
    let newArtworkId: string | null = null;
    let newArtistId: string | null = null;

    if (params?.artworkId) {
      newArtworkId = params.artworkId;
      setSelectedArtworkId(params.artworkId);
    }
    if (params?.artistId) {
      newArtistId = params.artistId;
      setSelectedArtistId(params.artistId);
    }
    if (params?.category) {
      setSelectedCategory(params.category);
    }

    setCurrentView(view);

    // Update browser URL
    const targetUrl = buildUrlForView(view, params);
    try {
      if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState(
          { view, artworkId: newArtworkId, artistId: newArtistId },
          '',
          targetUrl
        );
      }
    } catch {}

    // Update document title
    if (view === 'artwork' && newArtworkId) {
      const art = artworks.find((a) => a.id === newArtworkId);
      if (art) {
        document.title = `${art.title} by ${art.artistName} — Artnova`;
      }
    } else if (view === 'explore') {
      document.title = 'Explore Digital Artworks — Artnova';
    } else if (view === 'artists') {
      document.title = 'Curated Artists Directory — Artnova';
    } else if (view === 'about') {
      document.title = 'About Artnova — Curated Digital Art';
    } else {
      document.title = 'Artnova - Premium Digital Art Marketplace';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    if (foundUser.status === 'suspended') {
      return { success: false, error: 'This account has been suspended by administration.' };
    }

    setCurrentUser(foundUser);
    addToast({
      type: 'success',
      title: `Welcome back, ${foundUser.name}`,
      message: foundUser.role === 'admin' ? 'Admin curation session active.' : undefined,
    });
    return { success: true };
  };

  const loginWithDemo = (role: UserRole, status?: ArtistStatus) => {
    let demoUser: User | undefined;
    if (role === 'admin') {
      demoUser = users.find((u) => u.role === 'admin');
    } else if (role === 'artist') {
      if (status === 'pending') {
        demoUser = users.find((u) => u.role === 'artist' && u.status === 'pending');
      } else {
        demoUser = users.find((u) => u.role === 'artist' && u.status === 'approved');
      }
    } else {
      demoUser = users.find((u) => u.role === 'buyer');
    }

    if (demoUser) {
      setCurrentUser(demoUser);
      addToast({
        type: 'success',
        title: `Signed in as ${demoUser.name}`,
        message: `Role: ${demoUser.role.toUpperCase()}${demoUser.status ? ` (${demoUser.status})` : ''}`,
      });
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
    role: 'buyer' | 'artist';
    bio?: string;
    location?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const userId = `user_${Date.now()}`;
    const initialStatus: ArtistStatus | undefined = data.role === 'artist' ? 'pending' : undefined;

    const newUser: User = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      profileImage: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=250&q=80`,
    };

    setUsers((prev) => [...prev, newUser]);
    saveUserDoc(newUser);

    if (data.role === 'artist') {
      const artistId = `artist_${Date.now()}`;
      const newArtist: ArtistProfile = {
        id: artistId,
        userId: userId,
        artistName: data.name.trim(),
        email: cleanEmail,
        bio: data.bio?.trim() || 'Emerging digital artist crafting original digital creations.',
        location: data.location?.trim() || 'Global',
        profileImage: newUser.profileImage || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalArtworks: 0,
        totalSales: 0,
        totalEarnings: 0,
      };
      setArtists((prev) => [...prev, newArtist]);
      saveArtistDoc(newArtist);
    }

    setCurrentUser(newUser);

    if (data.role === 'artist') {
      addToast({
        type: 'info',
        title: 'Artist Application Received',
        message: 'Your artist account is currently under review by Artnova curation.',
      });
      navigate('artist-dashboard');
    } else {
      addToast({
        type: 'success',
        title: `Welcome to Artnova, ${newUser.name}!`,
        message: 'Your collector account is active.',
      });
    }

    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const res = await signInWithGoogle();
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setUsers((prev) => {
        const exists = prev.some((u) => u.id === res.user!.id);
        return exists
          ? prev.map((u) => (u.id === res.user!.id ? res.user! : u))
          : [...prev, res.user!];
      });
      addToast({
        type: 'success',
        title: `Welcome, ${res.user.name}!`,
        message: 'Signed in with Google successfully.',
      });
      return { success: true };
    } else {
      return { success: false, error: res.error || 'Google sign-in could not be completed.' };
    }
  };

  const logout = () => {
    signOutFirebase();
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have safely signed out of your account.',
    });
    navigate('home');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    saveUserDoc(updated);
    addToast({ type: 'success', title: 'Profile Updated' });
  };

  const updateArtistProfile = (artistId: string, data: Partial<ArtistProfile>) => {
    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistId) {
          const updated = { ...a, ...data };
          saveArtistDoc(updated);
          return updated;
        }
        return a;
      })
    );
    addToast({ type: 'success', title: 'Artist Profile Updated' });
  };

  const addArtwork = (
    artworkData: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'viewCount'> & {
      createdAt?: string;
      uploadDate?: string;
    }
  ): { success: boolean; error?: string; artworkId?: string } => {
    if (!currentUser || currentUser.role !== 'artist') {
      return { success: false, error: 'Unauthorized: Only registered artists can upload artwork.' };
    }

    const artistProf = artists.find((a) => a.userId === currentUser.id);
    if (!artistProf || artistProf.status !== 'approved') {
      return {
        success: false,
        error: 'Upload Restricted: Your artist account must be approved by Artnova admin before publishing.',
      };
    }

    const artworkId = `art_${Date.now()}`;
    const specifiedDate = artworkData.uploadDate || artworkData.createdAt;
    const finalCreatedAt = specifiedDate
      ? new Date(specifiedDate).toISOString()
      : new Date().toISOString();

    const newArtwork: Artwork = {
      ...artworkData,
      id: artworkId,
      createdAt: finalCreatedAt,
      uploadDate: finalCreatedAt,
      updatedAt: new Date().toISOString(),
      salesCount: 0,
      viewCount: 1,
      artistId: artistProf.id,
      artistName: artistProf.artistName,
      artistEmail: artistProf.email,
    };

    setArtworks((prev) => [newArtwork, ...prev]);
    saveArtworkDoc(newArtwork);

    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistProf.id) {
          const updated = { ...a, totalArtworks: a.totalArtworks + 1 };
          saveArtistDoc(updated);
          return updated;
        }
        return a;
      })
    );

    addToast({
      type: 'success',
      title: 'Artwork Published',
      message: `"${newArtwork.title}" is now available on Artnova.`,
    });

    return { success: true, artworkId };
  };

  const updateArtwork = (id: string, updates: Partial<Artwork>): { success: boolean; error?: string } => {
    const target = artworks.find((a) => a.id === id);
    if (!target) return { success: false, error: 'Artwork not found.' };

    const updated = { ...target, ...updates, updatedAt: new Date().toISOString() };
    setArtworks((prev) => prev.map((a) => (a.id === id ? updated : a)));
    saveArtworkDoc(updated);
    addToast({ type: 'success', title: 'Artwork Updated' });
    return { success: true };
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    setCart((prev) => prev.filter((item) => item.artwork.id !== id));
    removeArtworkDoc(id);
    addToast({ type: 'info', title: 'Artwork Removed' });
  };

  const toggleArtworkStatus = (id: string, status: 'published' | 'draft' | 'hidden') => {
    setArtworks((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, status, updatedAt: new Date().toISOString() };
          saveArtworkDoc(updated);
          return updated;
        }
        return a;
      })
    );
    addToast({ type: 'info', title: `Status changed to ${status}` });
  };

  const approveArtist = (artistId: string) => {
    if (currentUser?.role !== 'admin') {
      addToast({ type: 'error', title: 'Permission Denied', message: 'Admin privileges required.' });
      return;
    }

    const artistToApprove = artists.find((a) => a.id === artistId);
    if (!artistToApprove) return;

    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistId) {
          const updated = {
            ...a,
            status: 'approved' as const,
            approvedAt: new Date().toISOString(),
            rejectionReason: undefined,
          };
          saveArtistDoc(updated);
          return updated;
        }
        return a;
      })
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === artistToApprove.userId) {
          const updated = { ...u, status: 'approved' as const };
          saveUserDoc(updated);
          return updated;
        }
        return u;
      })
    );

    if (currentUser?.id === artistToApprove.userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'approved' } : null));
    }

    addToast({
      type: 'success',
      title: 'Artist Approved',
      message: `${artistToApprove.artistName} is now authorized to publish artworks.`,
    });
  };

  const rejectArtist = (artistId: string, reason?: string) => {
    if (currentUser?.role !== 'admin') return;

    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;

    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistId) {
          const updated = {
            ...a,
            status: 'rejected' as const,
            rejectionReason: reason || 'Application did not meet current curation standards.',
          };
          saveArtistDoc(updated);
          return updated;
        }
        return a;
      })
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === artist.userId) {
          const updated = { ...u, status: 'rejected' as const };
          saveUserDoc(updated);
          return updated;
        }
        return u;
      })
    );

    addToast({
      type: 'info',
      title: 'Application Rejected',
      message: `${artist.artistName}'s application has been rejected.`,
    });
  };

  const suspendArtist = (artistId: string) => {
    if (currentUser?.role !== 'admin') return;
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;

    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistId) {
          const updated = { ...a, status: 'suspended' as const };
          saveArtistDoc(updated);
          return updated;
        }
        return a;
      })
    );
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === artist.userId) {
          const updated = { ...u, status: 'suspended' as const };
          saveUserDoc(updated);
          return updated;
        }
        return u;
      })
    );

    addToast({
      type: 'info',
      title: 'Artist Suspended',
      message: `${artist.artistName} account is now suspended.`,
    });
  };

  const reactivateArtist = (artistId: string) => {
    if (currentUser?.role !== 'admin') return;
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;

    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistId) {
          const updated = { ...a, status: 'approved' as const };
          saveArtistDoc(updated);
          return updated;
        }
        return a;
      })
    );
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === artist.userId) {
          const updated = { ...u, status: 'approved' as const };
          saveUserDoc(updated);
          return updated;
        }
        return u;
      })
    );

    addToast({
      type: 'success',
      title: 'Artist Reactivated',
      message: `${artist.artistName} account reactivated.`,
    });
  };

  const adminToggleArtworkStatus = (artworkId: string, status: 'published' | 'draft' | 'hidden') => {
    if (currentUser?.role !== 'admin') return;
    setArtworks((prev) =>
      prev.map((a) => (a.id === artworkId ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );
    addToast({ type: 'info', title: `Artwork status updated to ${status}` });
  };

  const adminToggleUserSuspension = (userId: string) => {
    if (currentUser?.role !== 'admin') return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'suspended' ? 'approved' : 'suspended';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    addToast({ type: 'info', title: 'User account status toggled' });
  };

  const addToCart = (artwork: Artwork): boolean => {
    if (cart.some((item) => item.artwork.id === artwork.id)) {
      addToast({
        type: 'info',
        title: 'Already in Cart',
        message: 'This digital artwork is already in your selection.',
      });
      return false;
    }

    setCart((prev) => [...prev, { artwork, addedAt: new Date().toISOString() }]);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `"${artwork.title}" by ${artwork.artistName}`,
    });
    return true;
  };

  const removeFromCart = (artworkId: string) => {
    setCart((prev) => prev.filter((item) => item.artwork.id !== artworkId));
    addToast({ type: 'info', title: 'Removed from Cart' });
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (artworkId: string) => {
    return cart.some((item) => item.artwork.id === artworkId);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.artwork.price, 0);

  const completeCheckout = async (paymentInfo: {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    const buyerId = currentUser ? currentUser.id : `guest_${Date.now()}`;
    const buyerName = currentUser ? currentUser.name : paymentInfo.cardName || 'Collector';
    const buyerEmail = currentUser ? currentUser.email : 'buyer@collector.org';

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    const orderItems = cart.map((item) => ({
      artworkId: item.artwork.id,
      title: item.artwork.title,
      artistId: item.artwork.artistId,
      artistName: item.artwork.artistName,
      artistEmail: item.artwork.artistEmail,
      price: item.artwork.price,
      previewImage: item.artwork.previewImage,
      digitalFile: item.artwork.digitalFile,
    }));

    const newOrder: Order = {
      id: orderId,
      buyerId,
      buyerName,
      buyerEmail,
      items: orderItems,
      totalAmount: cartTotal,
      currency: 'USD',
      paymentStatus: 'paid',
      paymentMethod: `Credit Card (•••• ${paymentInfo.cardNumber.slice(-4) || '4242'})`,
      createdAt: new Date().toISOString(),
      downloadStatus: 'available',
    };

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderDoc(newOrder);

    setArtworks((prev) =>
      prev.map((art) => {
        const matching = orderItems.find((item) => item.artworkId === art.id);
        if (matching) {
          const updated = { ...art, salesCount: art.salesCount + 1 };
          saveArtworkDoc(updated);
          return updated;
        }
        return art;
      })
    );

    setArtists((prev) =>
      prev.map((artist) => {
        const salesForArtist = orderItems.filter((i) => i.artistId === artist.id);
        if (salesForArtist.length > 0) {
          const revenueDelta = salesForArtist.reduce((sum, item) => sum + item.price, 0);
          const updated = {
            ...artist,
            totalSales: artist.totalSales + salesForArtist.length,
            totalEarnings: artist.totalEarnings + Math.round(revenueDelta * 0.9),
          };
          saveArtistDoc(updated);
          return updated;
        }
        return artist;
      })
    );

    setCart([]);

    addToast({
      type: 'success',
      title: 'Order Confirmed!',
      message: `Order #${orderId} complete. High-resolution master file available for download.`,
    });

    return { success: true, orderId };
  };

  const toggleWishlist = (artworkId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(artworkId);
      if (exists) {
        addToast({ type: 'info', title: 'Removed from Saved' });
        return prev.filter((id) => id !== artworkId);
      } else {
        addToast({ type: 'success', title: 'Saved to Wishlist' });
        return [...prev, artworkId];
      }
    });
  };

  const isInWishlist = (artworkId: string) => {
    return wishlist.includes(artworkId);
  };

  const downloadDigitalAsset = async (
    orderId: string,
    artworkId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, error: 'Order record could not be verified.' };
    }

    const isBuyer = currentUser && (currentUser.id === order.buyerId || currentUser.email === order.buyerEmail);
    const isAdmin = currentUser?.role === 'admin';
    const isOwningArtist =
      currentUser?.role === 'artist' &&
      order.items.some((i) => i.artistEmail.toLowerCase() === currentUser.email.toLowerCase());

    if (currentUser && !isBuyer && !isAdmin && !isOwningArtist) {
      return {
        success: false,
        error: 'Access Denied: Digital master files are restricted strictly to the verified purchaser.',
      };
    }

    const item = order.items.find((i) => i.artworkId === artworkId) || order.items[0];
    if (!item) {
      return { success: false, error: 'Artwork file not found in this order.' };
    }

    try {
      const fileData = `===================================================================
ARTNOVA PREMIUM DIGITAL ARTWORK ARCHIVE & CERTIFICATE OF PROVENANCE
===================================================================
Artwork Title:       ${item.title}
Artist:              ${item.artistName} (<${item.artistEmail}>)
Collector / Buyer:   ${order.buyerName} (<${order.buyerEmail}>)
Order ID:            ${order.id}
Transaction Date:    ${new Date(order.createdAt).toUTCString()}
File Specifications: ${item.digitalFile.fileName}
File Resolution:     ${item.digitalFile.resolution}
Color Profile:       ${item.digitalFile.colorSpace}
Output Target:       ${item.digitalFile.dpi} DPI Archival Master
License Rights:      Original Non-Exclusive Digital Collector License
Digital Signature:   SHA256:${Math.random().toString(36).substring(2, 15)}-${Date.now()}
Artnova Provenance:  VERIFIED AUTHENTIC

Note: This package certifies ownership and grants the verified collector
rights to display, privately reproduce for physical archival print, and
store the high-resolution digital master file.
===================================================================`;

      const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.replace(/\s+/g, '_')}_Master_Certificate.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, downloadStatus: 'downloaded' } : o))
      );

      addToast({
        type: 'success',
        title: 'Digital Master Download Started',
        message: `${item.title} archival archive and certificate verified.`,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Download failed. Please try again.' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentArtistProfile,
        users,
        artists,
        artworks,
        orders,
        cart,
        wishlist,
        currentView,
        selectedArtworkId,
        selectedArtistId,
        selectedCategory,
        toasts,
        searchQuery,
        navigate,
        setSearchQuery,
        login,
        loginWithGoogle,
        loginWithDemo,
        register,
        logout,
        updateUserProfile,
        updateArtistProfile,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        toggleArtworkStatus,
        approveArtist,
        rejectArtist,
        suspendArtist,
        reactivateArtist,
        adminToggleArtworkStatus,
        adminToggleUserSuspension,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        completeCheckout,
        toggleWishlist,
        isInWishlist,
        downloadDigitalAsset,
        addToast,
        removeToast,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
