import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  AlertTriangle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Calendar,
  X,
} from 'lucide-react';
import { CarouselTabs } from '../components/CarouselTabs';
import { Artwork } from '../types';
import { CATEGORIES } from '../services/seedData';

interface ArtistDashboardPageProps {
  onOpenUploadModal: () => void;
}

export const ArtistDashboardPage: React.FC<ArtistDashboardPageProps> = ({
  onOpenUploadModal,
}) => {
  const {
    currentUser,
    currentArtistProfile,
    artworks,
    orders,
    deleteArtwork,
    updateArtwork,
    toggleArtworkStatus,
    updateArtistProfile,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'artworks' | 'orders' | 'profile'>('overview');

  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editUploadDate, setEditUploadDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editFormat, setEditFormat] = useState('JPG');
  const [editResolution, setEditResolution] = useState('4k');
  const [editDescription, setEditDescription] = useState('');

  const [artistName, setArtistName] = useState(currentArtistProfile?.artistName || '');
  const [bio, setBio] = useState(currentArtistProfile?.bio || '');
  const [email, setEmail] = useState(currentArtistProfile?.email || '');
  const [location, setLocation] = useState(currentArtistProfile?.location || '');
  const [website, setWebsite] = useState(currentArtistProfile?.website || '');
  const [socialTwitter, setSocialTwitter] = useState(currentArtistProfile?.socialTwitter || '');
  const [socialInstagram, setSocialInstagram] = useState(currentArtistProfile?.socialInstagram || '');

  if (!currentUser || currentUser.role !== 'artist') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-white text-zinc-900">
        <h2 className="text-xl font-bold text-zinc-950">Artist Portal Access Restricted</h2>
        <p className="text-xs text-zinc-500">
          You must be logged into an Artist account to access this studio dashboard.
        </p>
        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const artistId = currentArtistProfile?.id;
  const myArtworks = artworks.filter(
    (art) => art.artistId === artistId || art.artistEmail === currentUser.email
  );

  const publishedCount = myArtworks.filter((a) => a.status === 'published').length;
  const draftCount = myArtworks.filter((a) => a.status === 'draft').length;

  const artistOrders = orders.filter((order) =>
    order.items.some(
      (item) => item.artistId === artistId || item.artistEmail === currentUser.email
    )
  );

  const status = currentArtistProfile?.status || currentUser.status || 'pending';
  const isApproved = status === 'approved';

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArtistProfile) return;
    updateArtistProfile(currentArtistProfile.id, {
      artistName,
      bio,
      email,
      location,
      website,
      socialTwitter,
      socialInstagram,
    });
  };

  const handleStartEdit = (art: Artwork) => {
    setEditingArtwork(art);
    setEditTitle(art.title);
    setEditPrice(String(art.price));
    setEditCategory(art.category);
    setEditDescription(art.description || '');
    setEditFormat(art.digitalFile?.fileFormat ? art.digitalFile.fileFormat.split(' ')[0] : 'JPG');
    setEditResolution(art.digitalFile?.resolution ? art.digitalFile.resolution.split(' ')[0] : '4k');
    const dateStr = art.uploadDate || art.createdAt;
    setEditUploadDate(dateStr ? new Date(dateStr).toISOString().split('T')[0] : '');
  };

  const handleSaveArtworkEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork) return;
    const numPrice = parseFloat(editPrice) || editingArtwork.price;
    const finalDate = editUploadDate ? new Date(editUploadDate).toISOString() : editingArtwork.createdAt;
    updateArtwork(editingArtwork.id, {
      title: editTitle.trim() || editingArtwork.title,
      price: numPrice,
      category: editCategory || editingArtwork.category,
      description: editDescription.trim() || editingArtwork.description,
      createdAt: finalDate,
      uploadDate: finalDate,
      digitalFile: {
        ...editingArtwork.digitalFile,
        fileFormat: editFormat || editingArtwork.digitalFile.fileFormat,
        resolution: editResolution || editingArtwork.digitalFile.resolution,
      },
    });
    setEditingArtwork(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* 1. STATUS BANNER (Requirement 5) */}
      {!isApproved && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            status === 'pending'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : status === 'rejected'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-zinc-100 border-zinc-300 text-zinc-800'
          }`}
        >
          <div className="flex items-start gap-3">
            {status === 'pending' ? (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : status === 'rejected' ? (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Account Status: {status === 'pending' ? 'Pending Approval' : status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed text-zinc-700">
                {status === 'pending'
                  ? 'Your artist account is currently under review. You will be able to upload artworks after admin approval.'
                  : status === 'rejected'
                  ? `Your artist application was declined: ${currentArtistProfile?.rejectionReason || 'Curation standards review incomplete.'}`
                  : 'Your account has been temporarily suspended by administration.'}
              </p>
            </div>
          </div>

          <div className="text-xs text-zinc-500 font-mono">
            {status === 'pending' && 'Under Curatorial Review'}
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Artist Studio Portal
            </span>
            {isApproved && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Approved Artist
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
            {currentArtistProfile?.artistName || currentUser.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your digital artwork portfolio, collector orders, and royalty earnings.
          </p>
        </div>

        {/* Upload Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUploadModal}
            disabled={!isApproved}
            className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isApproved
                ? 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
            }`}
            title={!isApproved ? 'Admin approval required before uploading artworks' : 'Upload artwork'}
          >
            <Plus className="w-4 h-4" />
            Upload Artwork
          </button>
        </div>
      </div>

      {/* Tab Navigation (Carousel on Mobile with Touch & Tap Controls) */}
      <CarouselTabs
        tabs={[
          { id: 'overview', label: 'Studio Overview' },
          { id: 'artworks', label: 'Artwork Management', badge: myArtworks.length },
          { id: 'orders', label: 'Sales & Orders', badge: artistOrders.length },
          { id: 'profile', label: 'Artist Profile' },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* TAB 1: STUDIO OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Total Artworks</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums block mt-1">
                {myArtworks.length}
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">In your catalog</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Published</span>
              <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums block mt-1">
                {publishedCount}
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">Active in marketplace</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Drafts</span>
              <span className="text-2xl font-bold text-zinc-500 font-mono tabular-nums block mt-1">
                {draftCount}
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">Unpublished pieces</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Total Collector Sales</span>
              <span className="text-2xl font-bold text-sky-600 font-mono tabular-nums block mt-1">
                {currentArtistProfile?.totalSales || 0}
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">Master downloads</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-xs text-zinc-500 block">Total Net Royalties</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums block mt-1">
                ${currentArtistProfile?.totalEarnings || 0}
              </span>
              <span className="text-[10px] text-emerald-600 mt-1 block font-medium">90% net earnings</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-950">Your Artworks</h3>
              <button
                onClick={() => setActiveTab('artworks')}
                className="text-xs text-zinc-600 hover:text-zinc-950 font-medium"
              >
                Manage All
              </button>
            </div>

            {myArtworks.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                <p className="text-xs text-zinc-500">
                  {isApproved
                    ? 'You have not uploaded any artworks yet. Click "Upload Artwork" to publish your first piece.'
                    : 'Artworks cannot be uploaded until your artist application is approved.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myArtworks.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs"
                  >
                    <div className="aspect-[16/9] w-full bg-zinc-100 overflow-hidden">
                      <img
                        src={art.previewImage}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-500">{art.category}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {art.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-950 truncate">{art.title}</h4>
                      <p className="text-xs text-zinc-600 font-mono mt-1">${art.price} USD</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ARTWORK MANAGEMENT */}
      {activeTab === 'artworks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Artwork Catalog</h2>
              <p className="text-xs text-zinc-500">Publish, unpublish, edit, or delete your pieces.</p>
            </div>

            {isApproved && (
              <button
                onClick={onOpenUploadModal}
                className="py-2 px-3 bg-zinc-950 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Upload New
              </button>
            )}
          </div>

          {myArtworks.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-xl p-8">
              <p className="text-sm text-zinc-500">No artworks uploaded.</p>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                    <tr>
                      <th className="p-4 font-semibold">Artwork</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Sales</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {myArtworks.map((art) => (
                      <tr key={art.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                              <img
                                src={art.previewImage}
                                alt={art.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-zinc-950 truncate max-w-xs">{art.title}</div>
                              <div className="text-[11px] text-zinc-400 font-mono">
                                {new Date(art.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-600">{art.category}</td>
                        <td className="p-4 font-mono font-semibold text-zinc-950">${art.price}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              art.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            {art.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-mono tabular-nums text-zinc-600">
                          {art.salesCount} sold
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {art.status === 'published' ? (
                              <button
                                onClick={() => toggleArtworkStatus(art.id, 'draft')}
                                className="p-1.5 text-zinc-500 hover:text-amber-600 transition-colors rounded hover:bg-zinc-100"
                                title="Unpublish / Set to Draft"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleArtworkStatus(art.id, 'published')}
                                className="p-1.5 text-zinc-500 hover:text-emerald-600 transition-colors rounded hover:bg-zinc-100"
                                title="Publish Artwork"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleStartEdit(art)}
                              className="p-1.5 text-zinc-500 hover:text-zinc-950 transition-colors rounded hover:bg-zinc-100"
                              title="Edit Artwork Details & Upload Date"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => deleteArtwork(art.id)}
                              className="p-1.5 text-zinc-500 hover:text-rose-600 transition-colors rounded hover:bg-zinc-100"
                              title="Delete Artwork"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECENT ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Collector Orders</h2>
            <p className="text-xs text-zinc-500">Transactions generated for your digital artworks.</p>
          </div>

          {artistOrders.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-xl p-8">
              <p className="text-sm text-zinc-500">No orders recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                    <tr>
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Buyer</th>
                      <th className="p-4 font-semibold">Artwork</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Net Payout (90%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {artistOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-4 font-mono font-medium text-zinc-950">{order.id}</td>
                        <td className="p-4 text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium text-zinc-950">{order.buyerName}</td>
                        <td className="p-4 text-zinc-600">
                          {order.items.map((i) => i.title).join(', ')}
                        </td>
                        <td className="p-4 font-mono font-semibold text-zinc-950">
                          ${order.totalAmount}
                        </td>
                        <td className="p-4 font-mono font-semibold text-emerald-600">
                          ${Math.round(order.totalAmount * 0.9)} USD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ARTIST PROFILE MANAGEMENT */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Manage Artist Profile</h2>
            <p className="text-xs text-zinc-500">
              Customize your public profile, bio, and collector contact details.
            </p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Artist Name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Location / Studio
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Artist Statement & Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Website Portfolio URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Twitter / X Handle
                </label>
                <input
                  type="text"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  placeholder="@handle"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
              >
                Save Artist Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Artwork Modal Dialog */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setEditingArtwork(null)}
          />
          <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 text-zinc-900 z-10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-950">Edit Artwork Details</h3>
              </div>
              <button
                onClick={() => setEditingArtwork(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtworkEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Artwork Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 font-mono tabular-nums focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-2 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  >
                    {CATEGORIES.slice(1).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Format *</label>
                  <input
                    type="text"
                    required
                    value={editFormat}
                    onChange={(e) => setEditFormat(e.target.value)}
                    placeholder="e.g. JPG, PNG"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Resolution *</label>
                  <input
                    type="text"
                    required
                    value={editResolution}
                    onChange={(e) => setEditResolution(e.target.value)}
                    placeholder="e.g. 4k, 8k"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g. A single Girl in a rainy day"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Published Date *
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">Editable</span>
                </label>
                <input
                  type="date"
                  required
                  value={editUploadDate}
                  onChange={(e) => setEditUploadDate(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Modify the &quot;Published on: [Date]&quot; displayed on the single product page.
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="px-3.5 py-1.5 text-xs text-zinc-600 hover:text-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
