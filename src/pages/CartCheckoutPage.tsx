import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';

export const CartCheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    completeCheckout,
    currentUser,
    navigate,
  } = useApp();

  const [cardName, setCardName] = useState(currentUser?.name || 'Aria Sterling');
  const [email, setEmail] = useState(currentUser?.email || 'buyer@collector.org');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('884');

  const [loading, setLoading] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (completedOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-white text-zinc-900">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Acquisition Successful
          </span>
          <h1 className="text-3xl font-bold text-zinc-950">Order Confirmed!</h1>
          <p className="text-xs text-zinc-500">
            Order Reference: <span className="font-mono text-zinc-950 font-semibold">{completedOrderId}</span>
          </p>
        </div>

        <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl text-left space-y-4">
          <div className="flex items-center gap-3 text-xs text-zinc-700 pb-3 border-b border-zinc-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your digital master license has been authenticated and linked to your collector account.
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            You can access your high-resolution master files and provenance certificates at any time inside <strong>My Purchases</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('buyer-dashboard')}
              className="flex-1 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Go to My Purchases & Downloads
            </button>
            <button
              onClick={() => navigate('explore')}
              className="py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-lg border border-zinc-300 transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-white text-zinc-900">
        <h2 className="text-xl font-bold text-zinc-950">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-500">
          Select digital masterworks from our curated artists to proceed with checkout.
        </p>
        <button
          onClick={() => navigate('explore')}
          className="mt-2 px-5 py-2.5 bg-zinc-950 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          Explore Artworks
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await completeCheckout({
        cardName,
        cardNumber,
        expiry,
        cvc,
      });

      setLoading(false);
      if (res.success && res.orderId) {
        setCompletedOrderId(res.orderId);
      } else {
        setErrorMessage(res.error || 'Payment failed.');
      }
    } catch {
      setLoading(false);
      setErrorMessage('Payment execution failed. Please retry.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 bg-white text-zinc-900">
      
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Secure Digital Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">Review & Complete Order</h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* LEFT COLUMN: Payment & Buyer Information Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePay} className="space-y-6">
            
            {/* Buyer Contact */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-950">Collector Contact Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Collector Name"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Email for Archival Delivery
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@collector.org"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Payment Information
                </h3>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  256-Bit SSL Encrypted
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Security Code (CVC)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl text-[11px] text-zinc-600 border border-zinc-200 flex items-start gap-2 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Demo Sandbox Mode active. No real credit card charges will occur. Order and archival download token will be created immediately.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing Order...'
              ) : (
                <>
                  Authorize Payment & Unlock Masters (${cartTotal} USD)
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-zinc-950">Order Summary</h3>

            {/* Items List */}
            <div className="space-y-3 divide-y divide-zinc-200">
              {cart.map((item) => (
                <div key={item.artwork.id} className="pt-3 first:pt-0 flex gap-3">
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-zinc-200 shrink-0">
                    <img
                      src={item.artwork.previewImage}
                      alt={item.artwork.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-950 truncate">
                      {item.artwork.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate">
                      by {item.artwork.artistName}
                    </p>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {item.artwork.copyright}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-950 font-mono tabular-nums block">
                      ${item.artwork.price}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.artwork.id)}
                      className="text-[10px] text-zinc-500 hover:text-rose-600 transition-colors mt-1 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({cart.length} masterworks)</span>
                <span className="font-mono tabular-nums text-zinc-950 font-medium">${cartTotal} USD</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Artist Share (90%)</span>
                <span className="font-mono tabular-nums text-emerald-600 font-medium">
                  ${Math.round(cartTotal * 0.9)} USD
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Digital Delivery & Archival Token</span>
                <span className="text-zinc-900 font-medium">Free</span>
              </div>
              <div className="pt-3 border-t border-zinc-200 flex justify-between text-base font-bold text-zinc-950">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">${cartTotal} USD</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
