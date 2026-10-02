import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../services/seedData';
import { X, UploadCloud, FileCheck, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

interface ArtworkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtworkUploadModal: React.FC<ArtworkUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentArtistProfile, addArtwork } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('A single Girl in a rainy day');
  const [category, setCategory] = useState(CATEGORIES[1] || 'Creative Artwork');
  const [price, setPrice] = useState('80');
  const [uploadDate, setUploadDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [tagsInput, setTagsInput] = useState('Creative Artwork, Digital Art, Rainy Day');
  const [copyright, setCopyright] = useState(
    currentArtistProfile ? `©2026 ${currentArtistProfile.artistName} | All Rights Reserved.` : '©2026. All Rights Reserved.'
  );

  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [fileName, setFileName] = useState('Master_Artwork_Export.zip');
  const [fileResolution, setFileResolution] = useState('4k');
  const [fileFormat, setFileFormat] = useState('JPG');
  const [fileSizeMB, setFileSizeMB] = useState(45);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  if (!currentArtistProfile || currentArtistProfile.status !== 'approved') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white border border-amber-200 rounded-2xl p-6 text-zinc-900 z-10 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-amber-600 mb-3">
            <AlertCircle className="w-6 h-6" />
            <h3 className="text-base font-semibold">Artist Approval Required</h3>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed mb-4">
            Your artist account status is currently <strong>{currentArtistProfile?.status || 'Pending'}</strong>.
            You will be able to upload original digital master files once an Artnova curator approves your portfolio.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold"
          >
            Understood
          </button>
        </div>
      </div>
    );
  }

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setError('Preview image exceeds 25MB limit.');
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
      setError(null);
    }
  };

  const handleSimulatedArchiveUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSizeMB(Math.round(file.size / (1024 * 1024)) || 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numPrice = parseFloat(price);
    if (!title.trim()) {
      setError('Please provide a title for the artwork.');
      return;
    }
    if (isNaN(numPrice) || numPrice < 1) {
      setError('Please provide a valid price of at least $1.');
      return;
    }

    const finalPreview =
      previewImageUrl ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

    setSubmitting(true);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = addArtwork({
      title: title.trim(),
      description: description.trim() || 'Original digital artwork certified by Artnova.',
      previewImage: finalPreview,
      price: numPrice,
      currency: 'USD',
      category,
      tags: parsedTags.length > 0 ? parsedTags : [category, 'Digital Art'],
      copyright: copyright.trim(),
      status: 'published',
      uploadDate: uploadDate ? new Date(uploadDate).toISOString() : new Date().toISOString(),
      createdAt: uploadDate ? new Date(uploadDate).toISOString() : new Date().toISOString(),
      artistId: currentArtistProfile.id,
      artistName: currentArtistProfile.artistName,
      artistEmail: currentArtistProfile.email,
      digitalFile: {
        fileName: fileName || `${title.replace(/\s+/g, '_')}_Master.zip`,
        fileSizeBytes: fileSizeMB * 1024 * 1024,
        fileFormat,
        resolution: fileResolution,
        colorSpace: 'Display P3 / Adobe RGB',
        dpi: 300,
        downloadToken: `token_${Date.now()}`,
      },
    });

    setSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Upload failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-zinc-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close upload modal"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Approved Artist Portal
          </span>
          <h2 className="text-xl font-bold text-zinc-950 mt-1">Upload Original Digital Artwork</h2>
          <p className="text-xs text-zinc-500">
            Publish your high-resolution artwork to the Artnova marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Artwork Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rainy Day Reverie"
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Creative Artwork"
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Collector Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-zinc-400 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-900 font-mono tabular-nums focus:outline-none focus:border-zinc-900"
                />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Displayed as {price}$ on product page. You receive 90% net royalties.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                  Published Date *
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Editable</span>
              </label>
              <input
                type="date"
                required
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Displayed as Published on: {new Date(uploadDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Format *
              </label>
              <input
                type="text"
                required
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                placeholder="e.g. JPG, PNG, TIFF"
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                Shown in Details (e.g. JPG)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Resolution *
              </label>
              <input
                type="text"
                required
                value={fileResolution}
                onChange={(e) => setFileResolution(e.target.value)}
                placeholder="e.g. 4k, 8k"
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                Shown in Details (e.g. 4k)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A single Girl in a rainy day"
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1">
              Copyright Notice *
            </label>
            <input
              type="text"
              required
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="©2026 Ema Watson | All Rights Reserved."
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Display Preview Image (JPG / PNG / WEBP)
              </label>
              <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl p-4 text-center cursor-pointer transition-colors relative bg-zinc-50">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleSimulatedImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {previewImageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewImageUrl}
                      alt="Preview"
                      className="max-h-28 mx-auto rounded object-cover shadow-sm"
                    />
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Preview Loaded
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-7 h-7 mx-auto text-zinc-400" />
                    <p className="text-xs text-zinc-700 font-medium">Click to select image file</p>
                    <p className="text-[10px] text-zinc-400">Max size 25MB · sRGB or Display P3</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Master Download File (ZIP / TIFF / RAW)
              </label>
              <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl p-4 text-center cursor-pointer transition-colors relative bg-zinc-50">
                <input
                  type="file"
                  accept=".zip,.rar,.tar,.tiff,.tif,.psd"
                  onChange={handleSimulatedArchiveUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="space-y-1">
                  <FileCheck className="w-7 h-7 mx-auto text-sky-600" />
                  <p className="text-xs text-zinc-900 font-medium truncate px-2">{fileName}</p>
                  <p className="text-[10px] text-zinc-400">
                    {fileSizeMB} MB Archive · Secured for verified buyers only
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Keywords & Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Creative Artwork, Rainy Day, Digital Painting"
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400"
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Publishing...' : 'Publish to Marketplace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
