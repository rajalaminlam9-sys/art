import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Clock,
  Eye,
  Trash2,
  Lock,
} from 'lucide-react';
import { ArtistProfile } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    users,
    artists,
    artworks,
    orders,
    approveArtist,
    rejectArtist,
    suspendArtist,
    reactivateArtist,
    adminToggleArtworkStatus,
    adminToggleUserSuspension,
    deleteArtwork,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'artists' | 'artworks' | 'users' | 'orders'>('overview');
  const [artistFilterStatus, setArtistFilterStatus] = useState<string>('all');
  const [rejectModalArtist, setRejectModalArtist] = useState<ArtistProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Portfolio does not meet current archival standards.');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-white text-zinc-900">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-950">Administrator Access Required</h2>
        <p className="text-xs text-zinc-500">
          This administrative control center is protected and restricted to verified platform curators.
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

  const totalUsers = users.length;
  const totalArtists = artists.length;
  const pendingApprovals = artists.filter((a) => a.status === 'pending').length;
  const approvedArtists = artists.filter((a) => a.status === 'approved').length;
  const totalBuyers = users.filter((u) => u.role === 'buyer').length;
  const totalArtworks = artworks.length;
  const publishedArtworks = artworks.filter((a) => a.status === 'published').length;
  const totalOrders = orders.length;
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const filteredArtists = artists.filter((artist) => {
    if (artistFilterStatus === 'all') return true;
    return artist.status === artistFilterStatus;
  });

  const handleConfirmReject = () => {
    if (rejectModalArtist) {
      rejectArtist(rejectModalArtist.id, rejectionReason);
      setRejectModalArtist(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Artnova Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">Admin Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Curation moderation, artist account vetting, marketplace compliance, and ledger oversight.
          </p>
        </div>

        {pendingApprovals > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <span>{pendingApprovals} Artist {pendingApprovals === 1 ? 'Application' : 'Applications'} Pending Review</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl overflow-x-auto w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-zinc-950 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Marketplace Overview
        </button>
        <button
          onClick={() => setActiveTab('artists')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'artists'
              ? 'bg-white text-zinc-950 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Artist Approvals & Management ({artists.length})
          {pendingApprovals > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'artworks'
              ? 'bg-white text-zinc-950 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Artwork Moderation ({artworks.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-white text-zinc-950 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-white text-zinc-950 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Transactions & Orders ({orders.length})
        </button>
      </div>

      {/* 1. OVERVIEW SECTION */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Total Registered Users</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums block mt-1">
                {totalUsers}
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                {totalBuyers} Buyers · {totalArtists} Artists
              </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Artist Curation</span>
              <span className="text-2xl font-bold text-sky-600 font-mono tabular-nums block mt-1">
                {approvedArtists}{' '}
                <span className="text-sm font-normal text-zinc-400">/ {totalArtists}</span>
              </span>
              <span className="text-[10px] text-amber-700 mt-1 block font-semibold">
                {pendingApprovals} Pending Review
              </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Artworks in Catalog</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums block mt-1">
                {totalArtworks}
              </span>
              <span className="text-[10px] text-emerald-700 mt-1 block font-medium">
                {publishedArtworks} Published Active
              </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Total Orders</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums block mt-1">
                {totalOrders}
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Acquisitions completed</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Gross Marketplace Volume</span>
              <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums block mt-1">
                ${totalSalesRevenue.toLocaleString()} USD
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Primary master sales</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs text-zinc-500 block">Platform Commission (10%)</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono tabular-nums block mt-1">
                ${Math.round(totalSalesRevenue * 0.1).toLocaleString()} USD
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Net marketplace revenue</span>
            </div>

          </div>

          {pendingApprovals > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-amber-900">
                    Pending Artist Applications ({pendingApprovals})
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setArtistFilterStatus('pending');
                    setActiveTab('artists');
                  }}
                  className="text-xs text-amber-900 hover:underline font-semibold"
                >
                  Review Applications
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artists
                  .filter((a) => a.status === 'pending')
                  .map((pendingArt) => (
                    <div
                      key={pendingArt.id}
                      className="bg-white border border-zinc-200 rounded-xl p-4 flex items-start justify-between gap-4 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                          <img
                            src={pendingArt.profileImage}
                            alt={pendingArt.artistName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-950">{pendingArt.artistName}</h4>
                          <p className="text-xs text-zinc-500">{pendingArt.email}</p>
                          <p className="text-[11px] text-zinc-600 mt-1 line-clamp-1">{pendingArt.bio}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => approveArtist(pendingArt.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectModalArtist(pendingArt)}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-rose-50 text-zinc-700 hover:text-rose-700 rounded-lg text-xs font-medium border border-zinc-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ARTIST MANAGEMENT SECTION */}
      {activeTab === 'artists' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Artist Applications & Directory</h2>
              <p className="text-xs text-zinc-500">
                Review portfolios, approve creators, or manage account suspensions.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-lg text-xs">
              {['all', 'pending', 'approved', 'rejected', 'suspended'].map((st) => (
                <button
                  key={st}
                  onClick={() => setArtistFilterStatus(st)}
                  className={`px-3 py-1 rounded capitalize transition-colors ${
                    artistFilterStatus === st
                      ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                  <tr>
                    <th className="p-4 font-semibold">Artist</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Artworks</th>
                    <th className="p-4 font-semibold">Collector Sales</th>
                    <th className="p-4 font-semibold text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredArtists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                            <img
                              src={artist.profileImage}
                              alt={artist.artistName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-950">{artist.artistName}</div>
                            <div className="text-[11px] text-zinc-400">{artist.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-600">{artist.location || 'Global'}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                            artist.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : artist.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {artist.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono tabular-nums text-zinc-950 font-medium">{artist.totalArtworks}</td>
                      <td className="p-4 font-mono tabular-nums text-zinc-950 font-medium">{artist.totalSales}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {artist.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveArtist(artist.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectModalArtist(artist)}
                                className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-rose-700 rounded text-xs font-medium border border-zinc-200"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {artist.status === 'approved' && (
                            <button
                              onClick={() => suspendArtist(artist.id)}
                              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-amber-700 rounded text-xs font-medium border border-zinc-200"
                            >
                              Suspend
                            </button>
                          )}

                          {(artist.status === 'suspended' || artist.status === 'rejected') && (
                            <button
                              onClick={() => reactivateArtist(artist.id)}
                              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-emerald-700 rounded text-xs font-semibold border border-zinc-200"
                            >
                              Reactivate
                            </button>
                          )}

                          <button
                            onClick={() =>
                              navigate('artist-profile', { artistId: artist.id })
                            }
                            className="p-1 text-zinc-400 hover:text-zinc-950"
                            title="View public profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ARTWORK MANAGEMENT SECTION */}
      {activeTab === 'artworks' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Artwork Catalog Moderation</h2>
            <p className="text-xs text-zinc-500">
              Review published pieces, enforce curation standards, or unpublish non-compliant files.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                  <tr>
                    <th className="p-4 font-semibold">Artwork</th>
                    <th className="p-4 font-semibold">Artist</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Resolution</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {artworks.map((art) => (
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
                          <div>
                            <div className="font-semibold text-zinc-950">{art.title}</div>
                            <div className="text-[11px] text-zinc-400">{art.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-700 font-medium">{art.artistName}</td>
                      <td className="p-4 font-mono font-semibold text-zinc-950">${art.price}</td>
                      <td className="p-4 font-mono text-zinc-500">{art.digitalFile.resolution.split(' ')[0]}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {art.status === 'published' ? (
                            <button
                              onClick={() => adminToggleArtworkStatus(art.id, 'hidden')}
                              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-xs font-medium border border-zinc-200"
                            >
                              Hide
                            </button>
                          ) : (
                            <button
                              onClick={() => adminToggleArtworkStatus(art.id, 'published')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-xs"
                            >
                              Publish
                            </button>
                          )}

                          <button
                            onClick={() => deleteArtwork(art.id)}
                            className="p-1 text-zinc-400 hover:text-rose-600"
                            title="Remove completely"
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
        </div>
      )}

      {/* 4. USER MANAGEMENT SECTION */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Registered Users</h2>
            <p className="text-xs text-zinc-500">All collector, artist, and administrative accounts.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                  <tr>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Registered</th>
                    <th className="p-4 font-semibold">Account Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-zinc-950">{u.name}</div>
                        <div className="text-[11px] text-zinc-400">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-medium text-zinc-800">{u.role}</span>
                      </td>
                      <td className="p-4 text-zinc-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            u.status === 'suspended'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => adminToggleUserSuspension(u.id)}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-xs font-medium border border-zinc-200"
                          >
                            {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. ORDER MANAGEMENT SECTION */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Marketplace Transactions</h2>
            <p className="text-xs text-zinc-500">Ledger of all digital collector sales and licenses.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Buyer</th>
                    <th className="p-4 font-semibold">Artwork & Artist</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Payment</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Download Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4 font-mono font-medium text-zinc-950">{ord.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-zinc-950">{ord.buyerName}</div>
                        <div className="text-[11px] text-zinc-400">{ord.buyerEmail}</div>
                      </td>
                      <td className="p-4">
                        {ord.items.map((i) => (
                          <div key={i.artworkId} className="truncate max-w-xs">
                            <span className="font-semibold text-zinc-950">{i.title}</span>
                            <span className="text-zinc-500"> ({i.artistName})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-mono font-semibold text-zinc-950">${ord.totalAmount}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ord.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-500">
                        {ord.downloadStatus.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal Dialog */}
      {rejectModalArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setRejectModalArtist(null)}
          />
          <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 text-zinc-900 z-10 space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-950">
              Decline Application: {rejectModalArtist.artistName}
            </h3>
            <p className="text-xs text-zinc-500">
              Provide feedback or curation reasoning for declining this artist application.
            </p>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg p-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalArtist(null)}
                className="px-4 py-2 text-xs text-zinc-600 hover:text-zinc-950"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
