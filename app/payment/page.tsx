'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function PaymentPage() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [form, setForm] = useState({ cardNumber: '', cardExpiry: '', cardCvv: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, plan }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Payment failed. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/student');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">Subscribe to Continue</h1>
          <p className="text-gray-500 mt-2">Your free trial has ended. Choose a plan to keep learning.</p>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setPlan('monthly')}
            className={`border-2 rounded-xl p-4 text-left transition ${plan === 'monthly' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
          >
            <p className="font-bold text-lg text-indigo-800">Monthly</p>
            <p className="text-2xl font-bold mt-1">$300<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <p className="text-xs text-gray-500 mt-1">$3,600 over 12 months</p>
          </button>
          <button
            onClick={() => setPlan('annual')}
            className={`border-2 rounded-xl p-4 text-left transition relative ${plan === 'annual' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
          >
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Save 20%</span>
            <p className="font-bold text-lg text-indigo-800">Annual</p>
            <p className="text-2xl font-bold mt-1">$2,880<span className="text-sm font-normal text-gray-500"> once</span></p>
            <p className="text-xs text-gray-500 mt-1">vs $3,600 monthly</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChange={e => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '') })}
              maxLength={16}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={form.cardExpiry}
                onChange={e => setForm({ ...form, cardExpiry: e.target.value })}
                maxLength={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={form.cardCvv}
                onChange={e => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, '') })}
                maxLength={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition text-lg"
          >
            {loading ? 'Processing...' : `Pay ${plan === 'annual' ? '$2,880' : '$300'}`}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Payments processed securely via Authorize.net
        </p>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
