/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { GivingRecord } from '../types';
import { CheckCircle2, Printer, Download, X, ShieldCheck, HeartHandshake } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { lastGeneratedReceipt, setLastGeneratedReceipt } = useApp();

  if (!lastGeneratedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
ENCOUNTER RHEMA MINISTRIES
OFFICIAL DIGITAL GIVING RECEIPT & TAX STATEMENT
==================================================
Receipt Number: ${lastGeneratedReceipt.receiptNumber}
Transaction Ref: ${lastGeneratedReceipt.transactionRef}
Date & Time: ${new Date(lastGeneratedReceipt.timestamp).toLocaleString()}
Donor Name: ${lastGeneratedReceipt.donorName}
Donor Email: ${lastGeneratedReceipt.donorEmail}
Contribution Amount: $${lastGeneratedReceipt.amount.toLocaleString()} ${lastGeneratedReceipt.currency}
Designated Fund: ${lastGeneratedReceipt.fund.toUpperCase()}
Payment Method: ${lastGeneratedReceipt.paymentMethod.toUpperCase()}
Frequency: ${lastGeneratedReceipt.frequency}
Status: VERIFIED & CLEARED
Tax Exemption Status: IRS 501(c)(3) Eligible

Thank you for your cheerful giving and partnership in expanding God's Kingdom.
Encounter Rhema Ministries — 1200 Rhema Way, Capital City
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EncounterRhema_Receipt_${lastGeneratedReceipt.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="receipt-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setLastGeneratedReceipt(null)}
          aria-label="Close receipt"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Encounter Rhema Ministries
          </p>
          <h2 id="receipt-title" className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Official Giving Receipt
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Receipt #{lastGeneratedReceipt.receiptNumber} · IRS 501(c)(3) Compliant
          </p>
        </div>

        <div className="py-5 space-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Donor Name</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{lastGeneratedReceipt.donorName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Donor Email</span>
            <span className="text-slate-900 dark:text-slate-100">{lastGeneratedReceipt.donorEmail}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Designated Fund</span>
            <span className="font-medium text-amber-600 dark:text-amber-400 capitalize">
              {lastGeneratedReceipt.fund.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Payment Method</span>
            <span className="text-slate-900 dark:text-slate-100 capitalize">
              {lastGeneratedReceipt.paymentMethod.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Transaction Date</span>
            <span className="text-slate-900 dark:text-slate-100 text-xs">
              {new Date(lastGeneratedReceipt.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Ref Code</span>
            <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
              {lastGeneratedReceipt.transactionRef}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl flex items-center justify-between mt-4">
            <div>
              <span className="text-xs uppercase font-medium text-slate-500">Amount Given</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ${lastGeneratedReceipt.amount.toLocaleString()}.00
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-4 h-4" />
              Tax Deductible
            </div>
          </div>
        </div>

        <div className="bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <HeartHandshake className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <span>
            "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." (2 Corinthians 9:7)
          </span>
        </div>

        <div className="pt-6 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Statement
          </button>
        </div>
      </div>
    </div>
  );
};
