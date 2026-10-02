export type UserRole = 'buyer' | 'artist' | 'admin';

export type ArtistStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: ArtistStatus;
  profileImage?: string;
  createdAt: string;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  artistName: string;
  email: string;
  bio: string;
  location: string;
  website?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  profileImage: string;
  coverImage?: string;
  status: ArtistStatus;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  totalArtworks: number;
  totalSales: number;
  totalEarnings: number;
}

export interface DigitalFileSpecs {
  fileName: string;
  fileSizeBytes: number;
  fileFormat: string;
  resolution: string;
  colorSpace: string;
  dpi: number;
  downloadToken?: string;
}

export interface Artwork {
  id: string;
  artistId: string;
  artistName: string;
  artistEmail: string;
  title: string;
  description: string;
  previewImage: string;
  digitalFile: DigitalFileSpecs;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  copyright: string;
  sha256Hash?: string;
  registrationNumber?: string;
  createdAt: string;
  uploadDate?: string;
  updatedAt: string;
  status: 'published' | 'draft' | 'hidden';
  salesCount: number;
  viewCount: number;
  featured?: boolean;
}

export interface CartItem {
  artwork: Artwork;
  addedAt: string;
}

export interface OrderItem {
  artworkId: string;
  title: string;
  artistId: string;
  artistName: string;
  artistEmail: string;
  price: number;
  previewImage: string;
  digitalFile: DigitalFileSpecs;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
  downloadStatus: 'available' | 'downloaded';
}
