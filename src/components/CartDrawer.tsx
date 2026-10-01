import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { cart, removeFromCart, cartTotal, navigate } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Right side) */}
      <div className="relative w-full max-w-md bg-white border-l border-zinc-200 h-full flex flex-col z-10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-950">Your Cart</h2>
            <span className="text-xs text-zinc-500 font-mono tabular-nums">
              ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list or Empty State */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                <Sparkles className="w-8 h-8 stroke-1 text-zinc-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium text-zinc-950">Your cart is empty.</h3>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Discover beautiful digital artwork from independent artists around the world.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('explore');
                }}
                className="mt-2 px-5 py-2.5 bg-zinc-950 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                Explore Artworks
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[11px] text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Original archival digital files with verified single-license ownership.</span>
              </div>

              {cart.map((item) => (
                <div
                  key={item.artwork.id}
                  className="flex gap-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200 group hover:border-zinc-300 transition-colors"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-zinc-200 shrink-0">
                    <img
                      src={item.artwork.previewImage}
                      alt={item.artwork.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-950 truncate">
                        {item.artwork.title}
                      </h4>
                      <p className="text-xs text-zinc-500 truncate">
                        by {item.artwork.artistName}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {item.artwork.digitalFile.fileFormat.split(' ')[0]} · {item.artwork.digitalFile.resolution}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/80">
                      <span className="text-xs font-semibold text-zinc-950 font-mono tabular-nums">
                        ${item.artwork.price} USD
                      </span>
                      <button
                        onClick={() => removeFromCart(item.artwork.id)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-zinc-950 font-medium">${cartTotal} USD</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Direct Artist Royalties</span>
                <span className="font-mono tabular-nums text-emerald-600 font-medium">90%</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Instant Digital Delivery</span>
                <span className="text-zinc-700 font-medium">Free</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-semibold text-zinc-950">
                <span>Total</span>
                <span className="font-mono tabular-nums">${cartTotal} USD</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
