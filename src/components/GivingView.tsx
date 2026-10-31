/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GivingRecord } from '../types';
import { calculateGivingBreakdown } from '../utils/rules';
import {
  Heart,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  FileText,
  DollarSign,
  Download,
  Lock,
  Sparkles,
} from 'lucide-react';

export const GivingView: React.FC = () => {
  const { givingRecords, addGivingRecord, setLastGeneratedReceipt, currentUser, triggerToast } = useApp();

  const [fund, setFund] = useState<'tithe' | 'offering' | 'missions' | 'building_fund' | 'benevolence'>('tithe');
  const [frequency, setFrequency] = useState<'one_time' | 'weekly' | 'monthly'>('one_time');
  const [amount, setAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'apple_pay'>('card');
  const [donorName, setDonorName] = useState<string>(currentUser.name);
  const [donorEmail, setDonorEmail] = useState<string>(currentUser.email);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const presetAmounts = [50, 100, 250, 500, 1000, 5000];

  const breakdown = calculateGivingBreakdown(givingRecords);

  const handleGivingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;

    if (!finalAmount || finalAmount <= 0) {
      triggerToast('Invalid Amount', 'Please specify a valid contribution amount.', 'alert');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const record = addGivingRecord({
        donorName: donorName.trim() || 'Faithful Partner',
        donorEmail: donorEmail.trim() || 'partner@rhema.org',
        amount: finalAmount,
        currency: 'USD',
        fund,
        paymentMethod,
        frequency,
        status: 'successful',
        taxDeductible: true,
      });

      setIsProcessing(false);
      setCustomAmount('');
    }, 900);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT ENCRYPTED DIGITAL GIVING VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Covenant Partnership & Stewardship
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            "Give, and it will be given to you: good measure, pressed down, shaken together, and running over will be put into your bosom." (Luke 6:38). Your sacrificial giving fuels the global preaching of the living Rhema Word.
          </p>
        </div>
      </section>

      {/* Main Giving Form & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Giving Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Secure Giving Portal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                IRS 501(c)(3) Eligible · Instant Official Receipt Generated
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              <Lock className="w-3.5 h-3.5" /> PCI Compliant
            </div>
          </div>

          <form onSubmit={handleGivingSubmit} className="mt-6 space-y-6">
            {/* Fund Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                1. Select Giving Fund
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'tithe', label: 'Tithe (10%)' },
                  { id: 'offering', label: 'General Offering' },
                  { id: 'building_fund', label: 'Rhema Sanctuary' },
                  { id: 'missions', label: 'Global Missions' },
                  { id: 'benevolence', label: 'Mercy & Outreach' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFund(item.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                      fund === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                2. Giving Frequency
              </label>
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {[
                  { id: 'one_time', label: 'One-Time Gift' },
                  { id: 'weekly', label: 'Weekly Recurring' },
                  { id: 'monthly', label: 'Monthly Recurring' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrequency(item.id as any)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      frequency === item.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                3. Contribution Amount (USD)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      amount === amt && !customAmount
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Or enter a custom amount..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                4. Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-xs">Bank ACH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">Apple / Google Pay</span>
                </button>
              </div>
            </div>

            {/* Donor Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Full Name (For Tax Receipt)
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Email Address (Receipt Delivery)
                </label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Securing Transaction & Processing...</span>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current text-rose-800" />
                  <span>
                    Complete Giving of ${customAmount || amount}.00
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stewardship Breakdown & Recent Receipts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stewardship stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Kingdom Impact Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              100% of designated contributions directly advance ministry operations, missions, and benevolence.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Tithe & Worship Fund:</span>
                <span className="font-mono font-bold text-amber-400">${breakdown.byFund.tithe.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Rhema Building Sanctuary:</span>
                <span className="font-mono font-bold text-amber-400">${breakdown.byFund.building_fund.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Global Missions Crusades:</span>
                <span className="font-mono font-bold text-amber-400">${breakdown.byFund.missions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Benevolence & Community Outreach:</span>
                <span className="font-mono font-bold text-amber-400">${breakdown.byFund.benevolence.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Recorded Giving</span>
              <span className="text-lg font-black text-white">${breakdown.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Recent Giving Transactions & Receipts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Contributions & Receipts
              </h3>
              <span className="text-xs text-slate-400">{givingRecords.length} Cleared</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {givingRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                      <span>${rec.amount.toLocaleString()}</span>
                      <span className="text-amber-600 dark:text-amber-400 capitalize font-medium text-[11px]">
                        · {rec.fund.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {rec.donorName} · {new Date(rec.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => setLastGeneratedReceipt(rec)}
                    className="p-1.5 text-slate-500 hover:text-amber-500 rounded-lg flex items-center gap-1 text-[11px] font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
