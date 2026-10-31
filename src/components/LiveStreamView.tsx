/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Users,
  Send,
  Heart,
  Flame,
  Sparkles,
  BookOpen,
  Share2,
  Volume2,
  Maximize2,
  CheckCircle2,
  Smile,
  Sliders,
} from 'lucide-react';
import { StreamQuality } from '../types';

interface LiveChatMessage {
  id: string;
  user: string;
  location: string;
  text: string;
  time: string;
  badge?: string;
}

export const LiveStreamView: React.FC = () => {
  const {
    setCurrentPage,
    triggerToast,
    currentUser,
    isLiveBroadcasting,
    studioBroadcastTitle,
    studioActiveViewers,
    streamQuality,
    setStreamQuality,
    liveMediaStream,
  } = useApp();

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { id: '1', user: 'Sister Angela M.', location: 'London, UK', text: 'Watching live from London! The presence of God is already so heavy in my living room.', time: '11:02 AM' },
    { id: '2', user: 'Brother Kevin O.', location: 'Houston, TX', text: 'Amen! Standing in faith for financial breakthrough today!', time: '11:03 AM' },
    { id: '3', user: 'Pastor Isaac N.', location: 'Accra, Ghana', text: 'Hallelujah! The altar fire is burning brightly! Greetings Encounter Rhema family.', time: '11:04 AM', badge: 'Pastor' },
    { id: '4', user: 'Sister Christine D.', location: 'Toronto, Canada', text: 'Ready for the Rhema Word! Declaring healing over my sister!', time: '11:05 AM' },
  ]);

  const [newChatText, setNewChatText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'give'>('chat');
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    '🙏': 412,
    '🔥': 328,
    '❤️': 580,
    '🙌': 240,
  });
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const triggerReaction = (emoji: string) => {
    setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 80) + 10;
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  };

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      user: currentUser.name,
      location: 'Online Congregation',
      text: newChatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: currentUser.role === 'super_admin' ? 'Apostle' : undefined,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewChatText('');

    setTimeout(() => {
      chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerToast('Live Broadcast Link Copied', 'Share this link with friends and family to join the service!', 'success');
    }
  };

  const publicVideoRef = useRef<HTMLVideoElement>(null);

  // Hook live media stream from studio in real-time
  useEffect(() => {
    if (publicVideoRef.current) {
      if (isLiveBroadcasting && liveMediaStream) {
        publicVideoRef.current.srcObject = liveMediaStream;
        publicVideoRef.current.play().catch(() => {});
      } else {
        publicVideoRef.current.srcObject = null;
      }
    }
  }, [isLiveBroadcasting, liveMediaStream]);

  return (
    <div className="space-y-6 pb-16">
      {/* Stream & Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Video Player */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-video flex items-center justify-center group">
            {/* Real-time live video feed or replay video */}
            <video
              ref={publicVideoRef}
              src={!liveMediaStream || !isLiveBroadcasting ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : undefined}
              controls
              autoPlay
              playsInline
              muted={isLiveBroadcasting}
              loop={!isLiveBroadcasting || !liveMediaStream}
              className="w-full h-full object-cover"
            />

            {/* Overlaid Live Badges */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-sm ${
                isLiveBroadcasting ? 'bg-rose-600/90 animate-pulse' : 'bg-slate-700/90'
              }`}>
                <Radio className="w-3.5 h-3.5" /> {isLiveBroadcasting ? 'LIVE NOW' : 'OFFLINE REPLAY'}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-sm">
                <Users className="w-3.5 h-3.5 text-amber-400" /> {studioActiveViewers.toLocaleString()} Watching
              </span>
            </div>

            {/* Overlaid Top Right Stream Quality Selector */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-xl">
              <Sliders className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Quality:</span>
              {(['1080p', '720p', '480p'] as StreamQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setStreamQuality(q);
                    triggerToast('Stream Quality Selected', `Playback resolution changed to ${q}.`, 'info');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    streamQuality === q
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Floating emojis animation overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {floatingEmojis.map((item) => (
                <div
                  key={item.id}
                  style={{ left: `${item.left}%`, bottom: '20px' }}
                  className="absolute text-3xl animate-bounce transition-all duration-1000 transform -translate-y-40 opacity-80"
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Details Strip */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">
                  <span>Sunday Miracle & Encounter Celebration</span>
                  <span>·</span>
                  <span>Broadcasted in {streamQuality} {streamQuality === '1080p' ? 'Ultra-HD' : streamQuality === '720p' ? 'HD' : 'Standard'}</span>
                  {isLiveBroadcasting && <span className="text-emerald-500 font-bold">· Stream Healthy (60 FPS)</span>}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {studioBroadcastTitle}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ministering: Dr. Emmanuel K. Osei & Pastor Sarah K. Osei
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleShare}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4 text-amber-500" />
                  <span>Share Broadcast</span>
                </button>
                <button
                  onClick={() => setCurrentPage('giving')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Give Offering</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Reaction Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Release Praise & Reactions:
              </span>
              <div className="flex items-center gap-2">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:border-amber-500 text-xs font-semibold rounded-xl border border-transparent transition-all transform hover:scale-105"
                  >
                    <span>{emoji}</span>
                    <span className="text-slate-600 dark:text-slate-300 text-[11px] font-mono">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat & Interactive Tabs */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col h-[650px] overflow-hidden">
          {/* Tab selector */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 rounded-xl transition-colors text-center ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl transition-colors text-center ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sermon Notes
            </button>
            <button
              onClick={() => setActiveTab('give')}
              className={`flex-1 py-2 rounded-xl transition-colors text-center ${
                activeTab === 'give'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Live Giving
            </button>
          </div>

          {/* Tab Content: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-slate-900/40"
              >
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
                  <p className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Sanctuary Moderation Rules
                  </p>
                  <p className="mt-0.5">Welcome! Keep chat uplifting, filled with faith, praise, and prayer requests.</p>
                </div>

                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{msg.user}</span>
                      {msg.badge && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded">
                          {msg.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{msg.location} · {msg.time}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs pl-0.5 leading-relaxed bg-white dark:bg-slate-800/80 p-2 rounded-lg border border-slate-150 dark:border-slate-800">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendLiveChat} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  placeholder="Share an Amen, prayer, or declaration..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  aria-label="Send live chat"
                  className="p-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab Content: Synchronized Notes */}
          {activeTab === 'notes' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  Scripture Anchor
                </span>
                <p className="font-serif italic text-slate-900 dark:text-slate-100 mt-1">
                  "Through faith we understand that the worlds were framed by the word of God, so that things which are seen were not made of things which do appear." (Hebrews 11:3)
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Outline Points:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <li><strong>Logos vs Rhema:</strong> Logos is the eternal written counsel; Rhema is the specific, living word spoken into your now season.</li>
                  <li><strong>The Atmosphere of Decreeing:</strong> You do not pray about mountains; you speak to the mountain in Jesus' name.</li>
                  <li><strong>Covenant Seal:</strong> Every Rhema word requires agreement in fasting, giving, and unshakeable expectation.</li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => triggerToast('Notes Saved', 'Sermon notes synced to your member study log.', 'success')}
                  className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold transition-colors"
                >
                  Save Notes to My Profile
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Live Giving */}
          {activeTab === 'give' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div className="text-center space-y-1">
                <Heart className="w-8 h-8 text-rose-500 mx-auto fill-current" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Honor the Lord with Your Substance</h4>
                <p className="text-slate-500 text-[11px]">Sow into today's live service offering or tithe.</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCurrentPage('giving')}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 border border-transparent hover:border-amber-500 rounded-xl text-center font-bold text-slate-900 dark:text-white transition-all"
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage('giving')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all text-xs"
              >
                Go to Full Giving Portal & Tax Receipts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
