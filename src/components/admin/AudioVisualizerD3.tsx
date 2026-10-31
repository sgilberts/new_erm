/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Volume2, VolumeX, Activity, AlertTriangle, CheckCircle2, Mic } from 'lucide-react';

interface AudioVisualizerD3Props {
  analyserNode: AnalyserNode | null;
  audioContext: AudioContext | null;
  isMuted?: boolean;
  masterGain?: number;
  deviceName?: string;
}

export const AudioVisualizerD3: React.FC<AudioVisualizerD3Props> = ({
  analyserNode,
  audioContext,
  isMuted = false,
  masterGain = 100,
  deviceName = 'Selected Audio Device',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [currentPeakDb, setCurrentPeakDb] = useState<number>(-60);
  const [currentRmsDb, setCurrentRmsDb] = useState<number>(-60);
  const [isClipping, setIsClipping] = useState<boolean>(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 640;
    const height = 180;
    const margin = { top: 15, right: 35, bottom: 25, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .classed('w-full h-auto', true);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Decibel Y Scale (-60 dB to 0 dB)
    const yScale = d3.scaleLinear().domain([-60, 0]).range([innerHeight, 0]);

    // Frequency Bins Count
    const BINS = 36;
    const xScale = d3
      .scaleBand()
      .domain(d3.range(BINS).map(String))
      .range([0, innerWidth])
      .padding(0.22);

    // Gridlines for Decibels
    const dbTicks = [-48, -36, -24, -12, -6, 0];
    const gridGroup = g.append('g').attr('class', 'grid-lines');

    gridGroup
      .selectAll('line')
      .data(dbTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', (d) => (d === 0 ? '#ef4444' : d === -12 ? '#f59e0b' : '#334155'))
      .attr('stroke-width', (d) => (d === 0 || d === -12 ? 1.2 : 0.6))
      .attr('stroke-dasharray', (d) => (d === 0 ? 'none' : '3 3'))
      .attr('opacity', 0.65);

    // Y Axis (Decibels)
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(dbTicks)
      .tickFormat((d) => `${d} dB`);

    g.append('g')
      .attr('class', 'y-axis text-[9px] font-mono')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8');

    g.select('.y-axis').select('.domain').attr('stroke', '#475569');

    // Frequency markers along the bottom
    const freqLabels = [
      { bin: 2, label: '60Hz' },
      { bin: 8, label: '250Hz' },
      { bin: 15, label: '1kHz' },
      { bin: 24, label: '4kHz' },
      { bin: 32, label: '12kHz' },
    ];

    const freqGroup = g
      .append('g')
      .attr('transform', `translate(0, ${innerHeight + 14})`);

    freqLabels.forEach((f) => {
      const xPos = xScale(String(f.bin));
      if (xPos !== undefined) {
        freqGroup
          .append('text')
          .attr('x', xPos + xScale.bandwidth() / 2)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .attr('fill', '#64748b')
          .attr('class', 'text-[8px] font-mono')
          .text(f.label);
      }
    });

    // Bars Group
    const barsGroup = g.append('g').attr('class', 'frequency-bars');

    const bars = barsGroup
      .selectAll('rect')
      .data(d3.range(BINS))
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(String(d)) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 2)
      .attr('fill', '#10b981');

    // Peak Target Guideline marker
    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', yScale(-12) - 3)
      .attr('text-anchor', 'end')
      .attr('fill', '#f59e0b')
      .attr('class', 'text-[8px] font-mono font-bold')
      .text('TARGET VOCAL (-12 dBFS)');

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', yScale(0) + 10)
      .attr('text-anchor', 'end')
      .attr('fill', '#ef4444')
      .attr('class', 'text-[8px] font-mono font-bold')
      .text('CLIP (0 dBFS)');

    // Allocate buffer for audio data
    let bufferLength = 64;
    let dataArray = new Uint8Array(bufferLength);
    if (analyserNode) {
      analyserNode.fftSize = 128;
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const renderFrame = () => {
      let maxVal = 0;
      let sumSquares = 0;
      const binValues: number[] = new Array(BINS).fill(-60);

      if (analyserNode && !isMuted) {
        analyserNode.getByteFrequencyData(dataArray);

        // Step through bins and aggregate
        const step = Math.max(1, Math.floor(bufferLength / BINS));
        for (let i = 0; i < BINS; i++) {
          let binSum = 0;
          for (let j = 0; j < step; j++) {
            const idx = i * step + j;
            if (idx < bufferLength) {
              binSum += dataArray[idx];
            }
          }
          const rawAvg = binSum / step;
          // Apply gain factor
          const gainedVal = Math.min(255, rawAvg * (masterGain / 100));
          if (gainedVal > maxVal) maxVal = gainedVal;
          sumSquares += gainedVal * gainedVal;

          // Convert raw 0-255 to dBFS (-60 to 0)
          const normalized = gainedVal / 255;
          const dB = normalized > 0.001 ? Math.max(-60, 20 * Math.log10(normalized)) : -60;
          binValues[i] = dB;
        }
      } else if (!isMuted) {
        // Fallback simulated ambient floor for setup visual feedback
        const time = Date.now() * 0.003;
        for (let i = 0; i < BINS; i++) {
          const wave = Math.sin(time + i * 0.3) * 0.3 + 0.5;
          const noise = (Math.random() - 0.5) * 0.1;
          const amp = Math.max(0.01, (wave + noise) * (masterGain / 100) * 0.4);
          const dB = 20 * Math.log10(amp);
          binValues[i] = Math.max(-60, Math.min(0, dB));
        }
        maxVal = 100;
        sumSquares = 5000;
      }

      // Update D3 bars heights and colors
      bars
        .data(binValues)
        .attr('y', (d) => yScale(d))
        .attr('height', (d) => Math.max(0, innerHeight - yScale(d)))
        .attr('fill', (d) => {
          if (d >= -1) return '#ef4444'; // Red clip
          if (d >= -6) return '#f97316'; // Orange high
          if (d >= -16) return '#f59e0b'; // Amber target
          return '#10b981'; // Green safe
        });

      // Update Peak & RMS telemetry
      const peakDbValue = maxVal > 0 ? 20 * Math.log10(maxVal / 255) : -60;
      const rmsValue = Math.sqrt(sumSquares / BINS);
      const rmsDbValue = rmsValue > 0 ? 20 * Math.log10(rmsValue / 255) : -60;

      setCurrentPeakDb(Math.round(peakDbValue * 10) / 10);
      setCurrentRmsDb(Math.round(rmsDbValue * 10) / 10);
      setIsClipping(peakDbValue >= -0.5);

      animationFrameId.current = requestAnimationFrame(renderFrame);
    };

    animationFrameId.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [analyserNode, isMuted, masterGain]);

  const getSignalStatus = () => {
    if (isMuted) {
      return {
        label: 'Audio Input Muted',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        icon: <VolumeX className="w-3.5 h-3.5" />,
      };
    }
    if (isClipping) {
      return {
        label: 'Peak Clipping Detected — Reduce Preamp',
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
        icon: <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />,
      };
    }
    if (currentPeakDb >= -18 && currentPeakDb <= -6) {
      return {
        label: 'Signal Optimal for Live Sermon & Worship (-18 to -6 dBFS)',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    }
    if (currentPeakDb < -45) {
      return {
        label: 'Ambient Floor / Low Signal (Check Microphone Placement)',
        color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        icon: <Activity className="w-3.5 h-3.5" />,
      };
    }
    return {
      label: 'Live Audio Signal Active & Calibrated',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      icon: <Activity className="w-3.5 h-3.5" />,
    };
  };

  const status = getSignalStatus();

  return (
    <div
      ref={containerRef}
      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3"
    >
      {/* Header telemetry strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>D3 Real-Time Decibel Visualizer</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                FFT 128
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
              {deviceName}
            </p>
          </div>
        </div>

        {/* Status Chip */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${status.color}`}
        >
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      {/* D3 Rendered Canvas / SVG */}
      <div className="w-full relative overflow-hidden bg-slate-900/60 rounded-xl border border-slate-800/80 p-2">
        <svg ref={svgRef} className="w-full h-auto" />
      </div>

      {/* Digital dB Readout Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 uppercase">Instant Peak</span>
          <span
            className={`text-sm font-black ${
              isClipping
                ? 'text-rose-500 animate-pulse'
                : currentPeakDb >= -18
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {isMuted ? '-INF' : `${currentPeakDb} dBFS`}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 uppercase">Average RMS</span>
          <span className="text-sm font-bold text-slate-200">
            {isMuted ? '-INF' : `${currentRmsDb} dBFS`}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 uppercase">Gain Multiplier</span>
          <span className="text-sm font-bold text-amber-500">{masterGain}%</span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 uppercase">Clip Protection</span>
          <span className={`text-sm font-black ${isClipping ? 'text-rose-500' : 'text-emerald-400'}`}>
            {isClipping ? 'OVERLOAD' : 'NORMAL'}
          </span>
        </div>
      </div>
    </div>
  );
};
