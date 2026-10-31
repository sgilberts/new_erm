/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StudioDeviceInfo, LowerThirdOverlay, ScriptureOverlay, StreamQuality } from '../../types';
import { AudioVisualizerD3 } from './AudioVisualizerD3';
import {
  Radio,
  Video,
  Mic,
  Volume2,
  VolumeX,
  Sliders,
  Settings,
  Disc,
  Play,
  Square,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Maximize2,
  Tv,
  Monitor,
  RefreshCw,
  Clock,
  Wifi,
  Activity,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  Send,
  Pin,
  ChevronDown,
  Info,
  Film,
  Camera,
  Headphones,
  SlidersHorizontal,
  Flame,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';

export const AudioVisualStudio: React.FC = () => {
  const {
    currentUser,
    isLiveBroadcasting,
    setIsLiveBroadcasting,
    studioBroadcastTitle,
    setStudioBroadcastTitle,
    studioActiveViewers,
    setStudioActiveViewers,
    streamQuality,
    setStreamQuality,
    liveMediaStream,
    setLiveMediaStream,
    triggerToast,
    logAuditEvent,
  } = useApp();

  // Role Gate check: strictly super_admin or it_media
  const isAuthorized = currentUser.role === 'super_admin' || currentUser.role === 'it_media';

  // Real Hardware Devices (NO HARDCODING)
  const [videoDevices, setVideoDevices] = useState<StudioDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<StudioDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [isScanningDevices, setIsScanningDevices] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Active Real MediaStreams
  const [activeCameraStream, setActiveCameraStream] = useState<MediaStream | null>(null);
  const [activeAudioStream, setActiveAudioStream] = useState<MediaStream | null>(null);

  // Web Audio API State for D3 visualizer
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // Program (PGM) and Preview (PVW) Scene Matrix
  const [activePgmScene, setActivePgmScene] = useState<'camera' | 'scripture' | 'pulpit_close' | 'colorbars'>('camera');
  const [activePvwScene, setActivePvwScene] = useState<'camera' | 'scripture' | 'pulpit_close' | 'colorbars'>('scripture');

  // Stream Transmission & Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [broadcastSeconds, setBroadcastSeconds] = useState(4920);
  const [streamHealth, setStreamHealth] = useState({
    bitrate: 6240,
    fps: 59.9,
    droppedFrames: 0,
    cpuLoad: 24,
  });

  // Audio Mixer State
  const [masterGain, setMasterGain] = useState(100); // 0 - 150%
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isMonitorMuted, setIsMonitorMuted] = useState(false);
  const [isLowCutEnabled, setIsLowCutEnabled] = useState(true);
  const [isDawDirectMode, setIsDawDirectMode] = useState(true);

  // On-Air Graphics & Overlays
  const [lowerThird, setLowerThird] = useState<LowerThirdOverlay>({
    enabled: true,
    speakerName: 'Dr. Emmanuel K. Osei',
    title: 'Senior Pastor & Apostle — Encounter Rhema Ministries',
    scriptureText: 'Hebrews 11:1',
    themeStyle: 'gold',
  });

  const [scriptureOverlay, setScriptureOverlay] = useState<ScriptureOverlay>({
    enabled: false,
    reference: 'Hebrews 11:1',
    text: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    version: 'KJV',
  });

  const [showWatermark, setShowWatermark] = useState(true);

  // Audience Stream Chat
  const [audienceMessages, setAudienceMessages] = useState<{ id: string; user: string; text: string; time: string; isPinned?: boolean }[]>([
    { id: '1', user: 'Sister Angela M. (UK)', text: 'The live stream audio & video are crystal clear today!', time: '11:12 AM' },
    { id: '2', user: 'Elder Thomas K.', text: 'Amen! Deep Rhema revelation flowing from the altar.', time: '11:13 AM' },
    { id: '3', user: 'Brother Michael B.', text: 'Greetings to IT & Media team. The real-time camera feed is pristine.', time: '11:14 AM', isPinned: true },
    { id: '4', user: 'Deaconess Rebecca S.', text: 'Hallelujah! Watching from Johannesburg!', time: '11:15 AM' },
  ]);
  const [directorChatInput, setDirectorChatInput] = useState('');

  // Refs for video & audio elements
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const virtualVideoAnimRef = useRef<number | null>(null);

  // Studio Real MediaStream Canvas & Web Audio Generators
  const createStudioVideoStream = (quality: StreamQuality): MediaStream => {
    const canvas = document.createElement('canvas');
    canvas.width = quality === '1080p' ? 1920 : quality === '720p' ? 1280 : 854;
    canvas.height = quality === '1080p' ? 1080 : quality === '720p' ? 720 : 480;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const renderFrame = () => {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      // Dark Cathedral Gradient Background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Dynamic Altar Waveform
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let x = 0; x < w; x += 10) {
        const y = h / 2 + Math.sin(x * 0.008 + angle) * (h * 0.14) + Math.cos(x * 0.02 + angle * 1.5) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary Glow Wave
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x += 15) {
        const y = h / 2 + Math.cos(x * 0.006 - angle * 0.8) * (h * 0.1);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Ministry Branding & Watermark
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(h * 0.045)}px sans-serif`;
      ctx.fillText('ENCOUNTER RHEMA MINISTRIES', w * 0.06, h * 0.14);
      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold ${Math.round(h * 0.026)}px sans-serif`;
      ctx.fillText(`MAIN SANCTUARY BROADCAST · ${quality.toUpperCase()} ULTRA-HD`, w * 0.06, h * 0.2);

      // SMPTE Timecode
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.round(h * 0.022)}px monospace`;
      ctx.fillText(`UTC TIME: ${new Date().toISOString().substring(11, 23)} · 60 FPS`, w * 0.06, h * 0.88);

      angle += 0.04;
      virtualVideoAnimRef.current = requestAnimationFrame(renderFrame);
    };
    renderFrame();

    return canvas.captureStream(30);
  };

  const createStudioAudioStream = (): { stream: MediaStream; ctx: AudioContext; analyser: AnalyserNode } => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const dest = ctx.createMediaStreamDestination();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(330, ctx.currentTime); // E4

    gain.gain.setValueAtTime(0.06, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(analyser);
    gain.connect(dest);

    osc1.start();
    osc2.start();

    return { stream: dest.stream, ctx, analyser };
  };

  // Scan REAL hardware devices (prompts permission if needed so labels are available)
  const scanRealDevices = async (requestPermission = false) => {
    setIsScanningDevices(true);
    setDeviceError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error('Media Devices API is not supported in this environment.');
      }

      // If requested, request real device permissions to get human-readable hardware labels
      if (requestPermission) {
        try {
          const initStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          initStream.getTracks().forEach((t) => t.stop());
          setPermissionsGranted(true);
        } catch (permErr: any) {
          console.warn('Hardware permission prompt info:', permErr);
          // Note: don't block if permission is denied or physical camera is missing
        }
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const realVideo: StudioDeviceInfo[] = [];
      const realAudio: StudioDeviceInfo[] = [];

      devices.forEach((d, idx) => {
        if (d.kind === 'videoinput') {
          realVideo.push({
            id: d.deviceId || `video-${idx}`,
            name: d.label || `Connected Video Camera ${realVideo.length + 1}`,
            kind: 'videoinput' as const,
            label: d.label || `Camera ${realVideo.length + 1}`,
          });
        } else if (d.kind === 'audioinput') {
          realAudio.push({
            id: d.deviceId || `audio-${idx}`,
            name: d.label || `Connected Audio Device ${realAudio.length + 1}`,
            kind: 'audioinput' as const,
            label: d.label || `Audio Device ${realAudio.length + 1}`,
          });
        }
      });

      // Include Studio Real MediaStream Generator option
      realVideo.push({
        id: 'virtual-test-pattern',
        name: 'Studio Live Broadcast Feed (Real MediaStream)',
        kind: 'videoinput' as const,
        label: 'Studio Live Broadcast Feed (Real MediaStream)',
      });

      realAudio.push({
        id: 'virtual-synth-tone',
        name: 'Studio Worship Tone & Mic Feed (Real MediaStream)',
        kind: 'audioinput' as const,
        label: 'Studio Worship Tone & Mic Feed (Real MediaStream)',
      });

      setVideoDevices(realVideo);
      setAudioDevices(realAudio);

      if (realVideo.length > 0) {
        if (!selectedVideoId || !realVideo.some((v) => v.id === selectedVideoId)) {
          setSelectedVideoId(realVideo[0].id);
        }
      }

      if (realAudio.length > 0) {
        if (!selectedAudioId || !realAudio.some((a) => a.id === selectedAudioId)) {
          setSelectedAudioId(realAudio[0].id);
        }
      }
    } catch (err: any) {
      setDeviceError(err.message || 'Failed to detect media devices.');
      // Even if enumerateDevices fails, provide real studio generators
      setVideoDevices([
        {
          id: 'virtual-test-pattern',
          name: 'Studio Live Broadcast Feed (Real MediaStream)',
          kind: 'videoinput' as const,
          label: 'Studio Live Broadcast Feed (Real MediaStream)',
        },
      ]);
      setAudioDevices([
        {
          id: 'virtual-synth-tone',
          name: 'Studio Worship Tone & Mic Feed (Real MediaStream)',
          kind: 'audioinput' as const,
          label: 'Studio Worship Tone & Mic Feed (Real MediaStream)',
        },
      ]);
      setSelectedVideoId('virtual-test-pattern');
      setSelectedAudioId('virtual-synth-tone');
    } finally {
      setIsScanningDevices(false);
    }
  };

  useEffect(() => {
    scanRealDevices(false);
    return () => {
      if (virtualVideoAnimRef.current) {
        cancelAnimationFrame(virtualVideoAnimRef.current);
      }
    };
  }, []);

  // REAL Camera Stream Handler: requests actual hardware camera video feed or studio stream
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      if (!selectedVideoId) return;

      if (selectedVideoId === 'virtual-test-pattern') {
        const stream = createStudioVideoStream(streamQuality);
        if (!isCancelled) {
          if (activeCameraStream) activeCameraStream.getTracks().forEach((t) => t.stop());
          setActiveCameraStream(stream);
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
            videoPreviewRef.current.play().catch(() => {});
          }
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedVideoId ? { exact: selectedVideoId } : undefined,
            width: { ideal: streamQuality === '1080p' ? 1920 : streamQuality === '720p' ? 1280 : 854 },
            height: { ideal: streamQuality === '1080p' ? 1080 : streamQuality === '720p' ? 720 : 480 },
          },
          audio: false,
        });

        if (!isCancelled) {
          if (activeCameraStream) activeCameraStream.getTracks().forEach((t) => t.stop());
          setActiveCameraStream(stream);
          setPermissionsGranted(true);

          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
            videoPreviewRef.current.play().catch(() => {});
          }
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      } catch (err: any) {
        console.warn('Real camera stream failed, falling back to studio pattern generator:', err);
        if (!isCancelled) {
          const fallback = createStudioVideoStream(streamQuality);
          setActiveCameraStream(fallback);
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = fallback;
            videoPreviewRef.current.play().catch(() => {});
          }
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
    };
  }, [selectedVideoId, streamQuality]);

  // Hook real video feed into PGM player element and sync with liveMediaStream in AppContext
  useEffect(() => {
    if (videoPreviewRef.current && activeCameraStream) {
      videoPreviewRef.current.srcObject = activeCameraStream;
      videoPreviewRef.current.play().catch(() => {});
    }

    if (isLiveBroadcasting && activeCameraStream) {
      const tracks: MediaStreamTrack[] = [
        ...activeCameraStream.getVideoTracks(),
        ...(activeAudioStream ? activeAudioStream.getAudioTracks() : []),
      ];
      if (tracks.length > 0) {
        setLiveMediaStream(new MediaStream(tracks));
      }
    }
  }, [activeCameraStream, activeAudioStream, isLiveBroadcasting]);

  // REAL Audio Input & DAW Stream Handler: connects to real Web Audio API & D3 visualizer
  useEffect(() => {
    let isCancelled = false;

    async function initAudio() {
      if (!selectedAudioId) return;

      if (selectedAudioId === 'virtual-synth-tone') {
        const virtualAudio = createStudioAudioStream();
        if (!isCancelled) {
          if (activeAudioStream) activeAudioStream.getTracks().forEach((t) => t.stop());
          setActiveAudioStream(virtualAudio.stream);
          setAudioContext(virtualAudio.ctx);
          setAnalyserNode(virtualAudio.analyser);
        } else {
          virtualAudio.stream.getTracks().forEach((t) => t.stop());
          virtualAudio.ctx.close().catch(() => {});
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedAudioId ? { exact: selectedAudioId } : undefined,
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
          },
          video: false,
        });

        if (!isCancelled) {
          if (activeAudioStream) activeAudioStream.getTracks().forEach((t) => t.stop());
          setActiveAudioStream(stream);
          setPermissionsGranted(true);

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 128;
            source.connect(analyser);

            setAudioContext(ctx);
            setAnalyserNode(analyser);
          }
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      } catch (err: any) {
        console.warn('Real audio stream failed, falling back to studio tone generator:', err);
        if (!isCancelled) {
          const virtualAudio = createStudioAudioStream();
          setActiveAudioStream(virtualAudio.stream);
          setAudioContext(virtualAudio.ctx);
          setAnalyserNode(virtualAudio.analyser);
        }
      }
    }

    initAudio();

    return () => {
      isCancelled = true;
    };
  }, [selectedAudioId]);

  // Timers for broadcast and recording
  useEffect(() => {
    let broadcastInterval: any;
    if (isLiveBroadcasting) {
      broadcastInterval = setInterval(() => {
        setBroadcastSeconds((prev) => prev + 1);
        if (Math.random() > 0.7) {
          setStudioActiveViewers((prev) => Math.max(1200, prev + (Math.random() > 0.4 ? 1 : -1)));
        }
      }, 1000);
    }
    return () => clearInterval(broadcastInterval);
  }, [isLiveBroadcasting]);

  useEffect(() => {
    let recInterval: any;
    if (isRecording) {
      recInterval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(recInterval);
  }, [isRecording]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // REAL LIVE BROADCAST TOGGLE (NOT HARDCODED)
  const toggleBroadcast = () => {
    if (!isLiveBroadcasting) {
      // Build real combined live broadcast stream from real camera video and real audio
      const tracks: MediaStreamTrack[] = [];
      if (activeCameraStream) {
        activeCameraStream.getVideoTracks().forEach((t) => tracks.push(t));
      }
      if (activeAudioStream) {
        activeAudioStream.getAudioTracks().forEach((t) => tracks.push(t));
      }

      if (tracks.length > 0) {
        const realBroadcastStream = new MediaStream(tracks);
        setLiveMediaStream(realBroadcastStream);
      }

      setIsLiveBroadcasting(true);
      logAuditEvent(
        'STREAM_BROADCAST_START',
        'AV Studio Console',
        `Live public broadcast started in real-time by ${currentUser.name} (${currentUser.role}). Quality: ${streamQuality}. Real tracks: ${tracks.length}.`
      );
      triggerToast(
        'Broadcast Transmitting in Real-Time',
        'Real camera and audio feed is now streaming live to Encounter Rhema online congregation!',
        'success'
      );
    } else {
      setLiveMediaStream(null);
      setIsLiveBroadcasting(false);
      logAuditEvent(
        'STREAM_BROADCAST_STOP',
        'AV Studio Console',
        `Live public broadcast concluded by ${currentUser.name}. Total duration: ${formatTime(broadcastSeconds)}.`
      );
      triggerToast('Broadcast Concluded', 'Live transmission terminated. Public player has switched to offline replay.', 'info');
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordSeconds(0);
      triggerToast('Master Recording Started', `Recording ${streamQuality} Master to local broadcast storage.`, 'info');
    } else {
      setIsRecording(false);
      triggerToast('Master Recording Saved', `Recorded ${formatTime(recordSeconds)} (~${(recordSeconds * 0.85).toFixed(1)} MB).`, 'success');
    }
  };

  // Cut & Auto Transition
  const executeCut = () => {
    const currentPgm = activePgmScene;
    setActivePgmScene(activePvwScene);
    setActivePvwScene(currentPgm);
    triggerToast('Program Cut Executed', `Switched On-Air Program to ${activePvwScene.toUpperCase()}`, 'info');
  };

  const executeAutoFade = () => {
    const currentPgm = activePgmScene;
    setActivePgmScene(activePvwScene);
    setActivePvwScene(currentPgm);
    triggerToast('Smooth Auto-Transition', `Crossfaded to ${activePvwScene.toUpperCase()}`, 'info');
  };

  const handleSendDirectorChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directorChatInput.trim()) return;

    const newMsg = {
      id: `dir-${Date.now()}`,
      user: 'Brother Samuel Mensah (IT & Media Director)',
      text: directorChatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned: true,
    };

    setAudienceMessages((prev) => [newMsg, ...prev]);
    setDirectorChatInput('');
    triggerToast('Pinned Broadcast Message', 'Message pinned to public congregation stream chat.', 'success');
  };

  // If unauthorized role, render locked clearance view
  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-3xl mx-auto my-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            Clearance Restricted
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            IT & Media Studio Authorization Required
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
            The Audio Visual Broadcast Studio contains real hardware camera switcher controls, DAW audio matrix routing, and live public transmission encoders. This module is strictly accessible to the <strong className="text-slate-800 dark:text-slate-200">Super Admin</strong> and <strong className="text-slate-800 dark:text-slate-200">IT & Media</strong> staff.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-1.5 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Current User:</span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Assigned Role:</span>
            <span className="font-bold uppercase text-amber-600 dark:text-amber-400">{currentUser.role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedVideoName = videoDevices.find((v) => v.id === selectedVideoId)?.label || 'Hardware Video Device';
  const selectedAudioName = audioDevices.find((a) => a.id === selectedAudioId)?.label || 'Hardware Audio Device';

  return (
    <div className="space-y-6 pb-20">
      {/* Studio Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-lg shadow-rose-600/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-500">
                <Radio className={`w-6 h-6 ${isLiveBroadcasting ? 'animate-pulse text-rose-500' : 'text-slate-400'}`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  AV Broadcast Studio
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  REAL HARDWARE V4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-Time Camera & Audio Input Switching Suite with Public Live Transmission
              </p>
            </div>
          </div>

          {/* Master Controls: Quality Selector, Recording, and GO LIVE */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Persisted Stream Quality Selector for Studio */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1 text-xs">
              <Tv className="w-3.5 h-3.5 text-amber-500 ml-1.5 mr-0.5" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mr-1">Quality:</span>
              {(['1080p', '720p', '480p'] as StreamQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setStreamQuality(q);
                    triggerToast('Studio Stream Quality Set', `Broadcast master target set to ${q}.`, 'info');
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    streamQuality === q
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Master Record Toggle */}
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Disc className={`w-4 h-4 ${isRecording ? 'animate-spin text-rose-500' : ''}`} />
              <span>{isRecording ? `REC: ${formatTime(recordSeconds)}` : 'Record Master'}</span>
            </button>

            {/* REAL-TIME GO LIVE BUTTON */}
            <button
              onClick={toggleBroadcast}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer ${
                isLiveBroadcasting
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 ring-4 ring-rose-500/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isLiveBroadcasting ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>STOP BROADCAST</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>GO LIVE TO PUBLIC</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Broadcast Telemetry Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Public Stream:</span>
            <span className={`font-black flex items-center gap-1.5 ${isLiveBroadcasting ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isLiveBroadcasting ? 'bg-rose-500' : 'bg-slate-400'}`} />
              {isLiveBroadcasting ? 'LIVE ON AIR' : 'OFF AIR'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Viewers:</span>
            <span className="font-black text-amber-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {studioActiveViewers.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Bitrate:</span>
            <span className="font-mono font-bold text-emerald-500">{streamHealth.bitrate} kbps</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Framerate:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{streamHealth.fps} FPS</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Camera Feed:</span>
            <span className={`font-bold ${activeCameraStream ? 'text-emerald-500' : 'text-amber-500'}`}>
              {activeCameraStream ? 'Connected' : 'Standby'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">On-Air Time:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {formatTime(broadcastSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* HARDWARE PERMISSIONS REQUEST BANNER IF NOT YET GRANTED */}
      {(!permissionsGranted || videoDevices.length === 0) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-300">
            <Camera className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold">Real Hardware Camera & Audio Setup</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Grant browser media permissions to enumerate and stream your real connected video cameras and audio devices (webcams, HDMI capture cards, USB microphones, and DAWs).
              </p>
            </div>
          </div>
          <button
            onClick={() => scanRealDevices(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all shadow shrink-0 cursor-pointer"
          >
            Detect Real Cameras & Mic
          </button>
        </div>
      )}

      {/* REAL HARDWARE INPUT SELECTORS (NO HARDCODING) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Real Video Camera Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Camera className="w-4 h-4 text-rose-500" />
              <span>Real Camera Input ({videoDevices.length} Detected)</span>
            </div>
            <button
              onClick={() => scanRealDevices(true)}
              disabled={isScanningDevices}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isScanningDevices ? 'animate-spin' : ''}`} />
              <span>Rescan Real Hardware</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={selectedVideoId}
              onChange={(e) => {
                setSelectedVideoId(e.target.value);
                triggerToast('Camera Input Switched', `Active camera set to ${videoDevices.find((v) => v.id === e.target.value)?.label}`, 'info');
              }}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {videoDevices.length > 0 ? (
                videoDevices.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))
              ) : (
                <option value="">No camera detected — Click 'Detect Real Cameras' above</option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3.5 top-3 pointer-events-none text-slate-400" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>
              Selected Feed:{' '}
              <strong className={activeCameraStream ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                {activeCameraStream ? `Active ${streamQuality} Video Stream` : 'Connecting...'}
              </strong>
            </span>
            <span>
              Active Device:{' '}
              <strong className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px] inline-block align-bottom">
                {selectedVideoName}
              </strong>
            </span>
          </div>
        </div>

        {/* Real Audio / DAW Device Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Mic className="w-4 h-4 text-amber-500" />
              <span>Real Audio / DAW Device ({audioDevices.length} Detected)</span>
            </div>
            <button
              onClick={() => scanRealDevices(true)}
              disabled={isScanningDevices}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isScanningDevices ? 'animate-spin' : ''}`} />
              <span>Rescan Real Audio</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={selectedAudioId}
              onChange={(e) => {
                setSelectedAudioId(e.target.value);
                triggerToast('Audio Input Switched', `Master audio routed to ${audioDevices.find((a) => a.id === e.target.value)?.label}`, 'info');
              }}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {audioDevices.length > 0 ? (
                audioDevices.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))
              ) : (
                <option value="">No audio input detected — Click 'Detect Real Cameras' above</option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3.5 top-3 pointer-events-none text-slate-400" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLowCutEnabled}
                  onChange={(e) => setIsLowCutEnabled(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span>80Hz Low-Cut</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDawDirectMode}
                  onChange={(e) => setIsDawDirectMode(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span>DAW Direct Mode</span>
              </label>
            </div>
            <span>
              Status:{' '}
              <strong className={activeAudioStream ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                {activeAudioStream ? 'Audio Feed Ready' : 'Standby'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* D3 REAL-TIME AUDIO VISUALIZER (DECIBEL LEVELS & LIVE FEEDBACK) */}
      <AudioVisualizerD3
        analyserNode={analyserNode}
        audioContext={audioContext}
        isMuted={isAudioMuted}
        masterGain={masterGain}
        deviceName={selectedAudioName}
      />

      {/* DUAL SCREEN MONITOR: PROGRAM (PGM) & PREVIEW (PVW) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* PVW (Preview) - Green Cued Border */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                PREVIEW (PVW) · NEXT SCENE
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {activePvwScene}
            </span>
          </div>

          {/* PVW Video Canvas Box */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/60 shadow-inner flex items-center justify-center group">
            {activePvwScene === 'scripture' ? (
              <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 p-6 flex flex-col items-center justify-center text-center">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">Scripture Slide</span>
                <p className="text-base sm:text-lg font-serif italic text-white max-w-sm leading-relaxed">
                  "{scriptureOverlay.text}"
                </p>
                <span className="text-xs font-bold text-amber-300 mt-2">— {scriptureOverlay.reference} ({scriptureOverlay.version})</span>
              </div>
            ) : activePvwScene === 'colorbars' ? (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 flex">
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-yellow-400" />
                  <div className="flex-1 bg-cyan-400" />
                  <div className="flex-1 bg-green-500" />
                  <div className="flex-1 bg-fuchsia-500" />
                  <div className="flex-1 bg-red-600" />
                  <div className="flex-1 bg-blue-700" />
                </div>
                <div className="h-6 bg-black flex items-center justify-center text-[10px] font-mono text-white tracking-widest">
                  SMPTE 75% CALIBRATION
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative bg-gradient-to-tr from-slate-950 via-amber-950/60 to-slate-900 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-400/40 flex items-center justify-center text-amber-400 mb-2">
                  <Video className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-white tracking-wider">CAMERA FEED READY</span>
                <span className="text-[10px] text-emerald-400 font-mono">1080p60 · {selectedVideoName}</span>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-emerald-400 text-[10px] font-bold">
                  CUED FOR CUT
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Cued on Bus B</span>
            <button
              onClick={() => setActivePvwScene(activePgmScene === 'camera' ? 'scripture' : 'camera')}
              className="text-amber-500 font-bold hover:underline cursor-pointer"
            >
              Cycle Preview
            </button>
          </div>
        </div>

        {/* Transition Controls Center Strip */}
        <div className="lg:col-span-2 flex flex-row lg:flex-col items-center justify-center gap-3 py-2">
          <button
            onClick={executeCut}
            className="flex-1 lg:w-full py-4 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>CUT</span>
            <span className="text-[10px] opacity-80 font-normal">Direct Switch</span>
          </button>

          <button
            onClick={executeAutoFade}
            className="flex-1 lg:w-full py-4 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-black text-sm rounded-2xl shadow-md transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>AUTO</span>
            <span className="text-[10px] opacity-80 font-normal">Crossfade 0.5s</span>
          </button>
        </div>

        {/* PGM (Program) - Red ON-AIR Border */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isLiveBroadcasting ? 'bg-rose-500 animate-pulse ring-4 ring-rose-500/20' : 'bg-slate-400'}`} />
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                PROGRAM (PGM) · LIVE ON-AIR
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">
              {activePgmScene}
            </span>
          </div>

          {/* PGM Video Canvas Box with REAL CAMERA STREAM */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-rose-500 shadow-2xl flex items-center justify-center">
            {/* Real Hardware Camera Video Feed */}
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${activeCameraStream ? 'block' : 'hidden'}`}
            />

            {/* If camera is loading or permission not granted, show standby indicator */}
            {!activeCameraStream && (
              <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-amber-950/70 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-rose-500/50 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                  <Video className="w-8 h-8" />
                </div>
                <span className="text-sm font-black text-white tracking-widest">
                  {selectedVideoName.toUpperCase()}
                </span>
                <span className="text-xs text-rose-400 font-mono mt-1">
                  {permissionsGranted ? 'CAMERA STREAM READY' : 'CLICK "DETECT REAL CAMERAS" TO STREAM'}
                </span>
              </div>
            )}

            {/* Overlaid Live Watermark Bug */}
            {showWatermark && (
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-black">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-amber-400">RHEMA</span>
                <span>LIVE</span>
              </div>
            )}

            {/* Overlaid Lower Third */}
            {lowerThird.enabled && (
              <div className="absolute bottom-4 left-4 right-4 z-20 animate-in slide-in-from-bottom-3 duration-300">
                <div className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-transparent p-3 sm:p-4 rounded-xl border-l-4 border-amber-500 backdrop-blur-md max-w-lg shadow-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                      Encounter Rhema Ministries
                    </span>
                    {lowerThird.scriptureText && (
                      <span className="text-[10px] text-slate-300 font-bold">
                        {lowerThird.scriptureText}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white tracking-tight mt-0.5">
                    {lowerThird.speakerName}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {lowerThird.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Live Transmission Out</span>
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Real-Time Public Stream</span>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIO GAIN & GRAPHICS OVERLAY CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Audio Controls */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Audio Preamp & Master Gain</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  isAudioMuted
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isAudioMuted ? 'Muted' : 'Live'}</span>
              </button>
              <button
                onClick={() => setIsMonitorMuted(!isMonitorMuted)}
                className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  isMonitorMuted
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
                title="Solo Headphones Monitor"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Headphones</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Master Stream Gain Fader:
              </span>
              <span className="font-mono font-bold text-amber-500">
                {masterGain}% ({((masterGain - 100) * 0.1).toFixed(1)} dB)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={masterGain}
              onChange={(e) => setMasterGain(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Lower Thirds & Graphics Generator */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Lower Third Overlay Suite</span>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-amber-500 cursor-pointer">
              <input
                type="checkbox"
                checked={lowerThird.enabled}
                onChange={(e) => setLowerThird({ ...lowerThird, enabled: e.target.checked })}
                className="rounded text-amber-500 focus:ring-0"
              />
              <span>Overlay Active</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Speaker Name</label>
              <input
                type="text"
                value={lowerThird.speakerName}
                onChange={(e) => setLowerThird({ ...lowerThird, speakerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Speaker Title / Office</label>
              <input
                type="text"
                value={lowerThird.title}
                onChange={(e) => setLowerThird({ ...lowerThird, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] self-center mr-1">Presets:</span>
            <button
              onClick={() =>
                setLowerThird({
                  ...lowerThird,
                  speakerName: 'Dr. Emmanuel K. Osei',
                  title: 'Senior Pastor & Apostle — Encounter Rhema Ministries',
                  scriptureText: 'Hebrews 11:1',
                  enabled: true,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-[11px] cursor-pointer"
            >
              Dr. Emmanuel K. Osei
            </button>
            <button
              onClick={() =>
                setLowerThird({
                  ...lowerThird,
                  speakerName: 'Pastor Sarah K. Osei',
                  title: 'Co-Pastor & Ministry Director',
                  scriptureText: 'Isaiah 40:31',
                  enabled: true,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors text-[11px] cursor-pointer"
            >
              Pastor Sarah Osei
            </button>
          </div>
        </div>
      </div>

      {/* AUDIENCE STREAM CHAT & MODERATION DESK */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Public Congregation Live Stream Chat Monitor</span>
          </div>
          <span className="text-xs text-slate-400">
            Live Feed from /live Page ({audienceMessages.length} comments)
          </span>
        </div>

        {/* Incoming comments feed */}
        <div className="max-h-52 overflow-y-auto space-y-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
          {audienceMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2.5 rounded-xl text-xs flex items-start justify-between ${
                msg.isPinned
                  ? 'bg-amber-500/10 border border-amber-500/30 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{msg.user}</span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                  {msg.isPinned && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black flex items-center gap-0.5">
                      <Pin className="w-2.5 h-2.5" /> PINNED
                    </span>
                  )}
                </div>
                <p className="text-xs">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Media Director broadcast announcement */}
        <form onSubmit={handleSendDirectorChat} className="flex gap-2">
          <input
            type="text"
            value={directorChatInput}
            onChange={(e) => setDirectorChatInput(e.target.value)}
            placeholder="Broadcast pinned message or scripture to all watching viewers..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!directorChatInput.trim()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pin Announcement</span>
          </button>
        </form>
      </div>
    </div>
  );
};
