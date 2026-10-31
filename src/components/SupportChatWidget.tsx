/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Paperclip,
  Shield,
  FileText,
  Lock,
  Headphones,
  CheckCircle,
} from 'lucide-react';

export const SupportChatWidget: React.FC = () => {
  const { chatMessages, sendChatMessage, isChatOpen, setIsChatOpen, currentUser } = useApp();
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: 'document' | 'image' | 'audio';
    encrypted: boolean;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    sendChatMessage(inputText, attachedFile || undefined);
    setInputText('');
    setAttachedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      const isAud = file.type.startsWith('audio/');
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;

      setAttachedFile({
        name: file.name,
        size: sizeStr,
        type: isImg ? 'image' : isAud ? 'audio' : 'document',
        encrypted: true,
      });
    }
  };

  const sendQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  return (
    <>
      {/* Floating launcher button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Pastoral Care & Support Chat"
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-full p-3.5 shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 group border border-amber-400/30"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-white" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold pr-1">Pastoral Care Desk</span>
        </button>
      )}

      {/* Slide-out / floating drawer */}
      {isChatOpen && (
        <div
          role="dialog"
          aria-labelledby="chat-title"
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-400/30">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 id="chat-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                  Pastoral Care Desk
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> End-to-End Encrypted Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              aria-label="Close Chat Window"
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Encryption security banner */}
          <div className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>Messages & shared files are protected with AES-256 ministerial privacy</span>
          </div>

          {/* Chat message stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/40">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 text-[11px] mb-1">{msg.senderName}</p>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => sendQuickPrompt('I need urgent prayer for healing')}
                        className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md hover:border-amber-500 transition-colors"
                      >
                        Pray for Healing
                      </button>
                      <button
                        onClick={() => sendQuickPrompt('How do I receive a tax receipt for my giving?')}
                        className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md hover:border-amber-500 transition-colors"
                      >
                        Giving & Tax Receipts
                      </button>
                      <button
                        onClick={() => sendQuickPrompt('What are your Sunday service and broadcast times?')}
                        className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md hover:border-amber-500 transition-colors"
                      >
                        Service Schedules
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-amber-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* File attachment preview */}
                    {msg.fileAttachment && (
                      <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 border text-[11px] ${
                        isUser
                          ? 'bg-amber-700/60 border-amber-500 text-white'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        <FileText className="w-4 h-4 shrink-0 text-amber-300" />
                        <div className="flex-1 truncate">
                          <p className="font-medium truncate">{msg.fileAttachment.name}</p>
                          <p className="text-[10px] opacity-80">{msg.fileAttachment.size} · E2E Encrypted</p>
                        </div>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached file chip */}
          {attachedFile && (
            <div className="px-3 py-2 bg-amber-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 truncate">
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate font-medium">{attachedFile.name}</span>
                <span className="text-[10px] text-slate-400">({attachedFile.size})</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                aria-label="Remove attachment"
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file (Encrypted)"
              title="Attach document, photo, or audio note"
              className="text-slate-400 hover:text-amber-500 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your prayer or inquiry..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-slate-700"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachedFile}
              aria-label="Send message"
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
