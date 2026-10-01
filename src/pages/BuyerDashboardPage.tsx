import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArtworkCard } from '../components/ArtworkCard';
import {
  Package,
  Heart,
  Clock,
  User,
  Download,
  ShieldCheck,
} from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const {
    currentUser,
    orders,
    artworks,
    wishlist,
    downloadDigitalAsset,
    updateUserProfile,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'purchases' | 'wishlist' | 'orders' | 'profile'>('purchases');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [name, setName] = useState(currentUser?.name || 'Aria Sterling');
  const [email, setEmail] = useState(currentUser?.email || 'buyer@collector.org');

  const userOrders = currentUser
    ? orders.filter((o) => o.buyerId === currentUser.id || o.buyerEmail === currentUser.email)
    : orders;

  const allPurchasedItems = userOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order.id,
      orderDate: order.createdAt,
      downloadStatus: order.downloadStatus,
    }))
  );

  const savedArtworks = artworks.filter((art) => wishlist.includes(art.id));

  const handleDownload = async (orderId: string, artworkId: string) => {
    setDownloadingId(`${orderId}_${artworkId}`);
    await downloadDigitalAsset(orderId, artworkId);
    setDownloadingId(null);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center text-zinc-900 text-lg font-bold shadow-xs">
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser?.name[0] || 'C'
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Collector Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-0.5">
              {currentUser?.name || 'Collector Account'}
            </h1>
            <p className="text-xs text-zinc-500">{currentUser?.email || 'buyer@collector.org'}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'purchases'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            My Purchases ({allPurchasedItems.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Wishlist ({savedArtworks.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Order History ({userOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile Settings
          </button>
        </div>
      </div>

      {/* TAB 1: My Purchases with Digital Downloads */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Certified Digital Acquisitions</h2>
              <p className="text-xs text-zinc-500">
                Download your uncompressed TIFF, RAW files, and cryptographic authenticity certificates.
              </p>
            </div>
          </div>

          {allPurchasedItems.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 space-y-3">
              <Package className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-950">No purchases found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Once you acquire digital artworks, your permanent archival download links will appear here.
              </p>
              <button
                onClick={() => navigate('explore')}
                className="mt-2 px-4 py-2 bg-zinc-950 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allPurchasedItems.map((item, idx) => {
                const isDownloading = downloadingId === `${item.orderId}_${item.artworkId}`;

                return (
                  <div
                    key={`${item.orderId}_${item.artworkId}_${idx}`}
                    className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-300 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                        <img
                          src={item.previewImage}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
                          Certified Acquisition
                        </span>
                        <h3 className="text-base font-semibold text-zinc-950 truncate mt-0.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-500">by {item.artistName}</p>
                        <p className="text-[11px] text-zinc-400 font-mono mt-1">
                          Acquired on {new Date(item.orderDate).toLocaleDateString()} · ${item.price} USD
                        </p>
                      </div>
                    </div>

                    {/* Master Specs */}
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Digital Master:</span>
                        <span className="text-zinc-950 font-mono font-medium">{item.digitalFile.fileName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Resolution:</span>
                        <span className="text-zinc-950 font-medium">{item.digitalFile.resolution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Color Profile:</span>
                        <span className="text-zinc-950 font-medium">{item.digitalFile.colorSpace}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-zinc-100">
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Signed License
                      </span>

                      <button
                        onClick={() => handleDownload(item.orderId, item.artworkId)}
                        disabled={isDownloading}
                        className="py-2 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {isDownloading ? 'Verifying & Generating...' : 'Download Master File'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Saved Artworks</h2>
            <p className="text-xs text-zinc-500">Curated digital artworks saved to your private wishlist.</p>
          </div>

          {savedArtworks.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 space-y-3">
              <Heart className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-950">Your wishlist is empty</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Click the heart icon on any artwork to save it here for future consideration.
              </p>
              <button
                onClick={() => navigate('explore')}
                className="mt-2 px-4 py-2 bg-zinc-950 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Explore Artworks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Order History & Invoices</h2>
            <p className="text-xs text-zinc-500">Complete transaction records and acquisition receipts.</p>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-8">
              <p className="text-sm text-zinc-500">No historical orders recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                    <tr>
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Artworks</th>
                      <th className="p-4 font-semibold">Payment Status</th>
                      <th className="p-4 font-semibold">Total Amount</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {userOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-4 font-mono font-medium text-zinc-950">{order.id}</td>
                        <td className="p-4 text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            {order.items.map((i) => (
                              <div key={i.artworkId} className="font-medium text-zinc-950 truncate max-w-xs">
                                {i.title} <span className="text-zinc-500 font-normal">by {i.artistName}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-zinc-950">
                          ${order.totalAmount} USD
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDownload(order.id, order.items[0]?.artworkId)}
                            className="text-xs text-sky-600 hover:underline font-semibold"
                          >
                            Download Master
                          </button>
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

      {/* TAB 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Profile Settings</h2>
            <p className="text-xs text-zinc-500">Manage your collector identity and communications.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
