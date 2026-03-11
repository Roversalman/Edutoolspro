import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Video, Play, Pause, Scissors, Type, Music, Download, 
  Sparkles, Layers, Wand2, Plus, Trash2, Volume2, VolumeX, 
  ChevronLeft, ChevronRight, Clock, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoClip {
  id: string;
  url: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  filter: string;
}

interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface AudioTrack {
  id: string;
  url: string;
  name: string;
  duration: number;
  volume: number;
}

export default function VideoEditor() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'clips' | 'audio' | 'text' | 'filters'>('clips');
  
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Calculate total duration whenever clips change
  useEffect(() => {
    const duration = clips.reduce((acc, clip) => acc + (clip.endTime - clip.startTime), 0);
    setTotalDuration(duration);
  }, [clips]);

  // Sync video and audio playback
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, totalDuration]);

  // Determine which clip should be playing at the current time
  const getCurrentClip = useCallback(() => {
    let accumulatedTime = 0;
    for (const clip of clips) {
      const clipDuration = clip.endTime - clip.startTime;
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clipDuration) {
        return { clip, offset: currentTime - accumulatedTime };
      }
      accumulatedTime += clipDuration;
    }
    return null;
  }, [clips, currentTime]);

  const currentClipData = getCurrentClip();

  useEffect(() => {
    if (videoRef.current && currentClipData) {
      const { clip, offset } = currentClipData;
      if (videoRef.current.src !== clip.url) {
        videoRef.current.src = clip.url;
      }
      
      // Only seek if the difference is significant to avoid stuttering
      const targetTime = clip.startTime + offset;
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.3) {
        videoRef.current.currentTime = targetTime;
      }

      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.volume = clip.volume;
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentClipData, isPlaying]);

  // Handle Audio Sync
  useEffect(() => {
    if (audioRef.current && audioTracks.length > 0) {
      if (isPlaying) {
        audioRef.current.currentTime = currentTime % audioTracks[0].duration;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
      audioRef.current.volume = audioTracks[0].volume;
    }
  }, [isPlaying, currentTime, audioTracks]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const tempVideo = document.createElement('video');
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const newClip: VideoClip = {
          id: `clip-${Date.now()}`,
          url,
          name: file.name,
          duration: tempVideo.duration,
          startTime: 0,
          endTime: tempVideo.duration,
          volume: 1,
          filter: 'none'
        };
        setClips([...clips, newClip]);
        setSelectedClipId(newClip.id);
      };
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const tempAudio = document.createElement('audio');
      tempAudio.src = url;
      tempAudio.onloadedmetadata = () => {
        const newTrack: AudioTrack = {
          id: `audio-${Date.now()}`,
          url,
          name: file.name,
          duration: tempAudio.duration,
          volume: 0.5
        };
        setAudioTracks([...audioTracks, newTrack]);
      };
    }
  };

  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: `text-${Date.now()}`,
      text: 'New Text',
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, totalDuration),
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff'
    };
    setTextOverlays([...textOverlays, newOverlay]);
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Video exported successfully! (Simulation)');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedClip = clips.find(c => c.id === selectedClipId);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            Video Studio Pro <Sparkles size={18} className="text-emerald-400" />
          </h1>
        </div>
        <button 
          onClick={handleExport}
          disabled={loading || clips.length === 0}
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Processing...' : <><Download size={16} /> Export</>}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Assets & Tools */}
        <div className="w-80 bg-slate-900 border-r border-white/10 flex flex-col">
          <div className="flex border-b border-white/10">
            {[
              { id: 'clips', icon: <Video size={16} />, label: 'Clips' },
              { id: 'audio', icon: <Music size={16} />, label: 'Audio' },
              { id: 'text', icon: <Type size={16} />, label: 'Text' },
              { id: 'filters', icon: <Wand2 size={16} />, label: 'FX' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {activeTab === 'clips' && (
              <div className="space-y-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/40 hover:text-emerald-400 hover:border-emerald-400/50 transition-all"
                >
                  <PlusCircle size={20} /> Add Media
                </button>
                {clips.map((clip, idx) => (
                  <div 
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group ${selectedClipId === clip.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                        <Video size={20} className="text-white/20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{clip.name}</p>
                        <p className="text-[10px] text-white/40">{formatTime(clip.endTime - clip.startTime)}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setClips(clips.filter(c => c.id !== clip.id)); }}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-3">
                <button 
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/40 hover:text-blue-400 hover:border-blue-400/50 transition-all"
                >
                  <PlusCircle size={20} /> Add Music
                </button>
                {audioTracks.map(track => (
                  <div key={track.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Music size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{track.name}</p>
                      <input 
                        type="range" min="0" max="1" step="0.1" value={track.volume}
                        onChange={(e) => setAudioTracks(audioTracks.map(t => t.id === track.id ? { ...t, volume: parseFloat(e.target.value) } : t))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-blue-500 mt-1"
                      />
                    </div>
                    <button 
                      onClick={() => setAudioTracks(audioTracks.filter(t => t.id !== track.id))}
                      className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-3">
                <button 
                  onClick={addTextOverlay}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 transition-all"
                >
                  <Plus size={18} /> Add Text Overlay
                </button>
                {textOverlays.map(overlay => (
                  <div key={overlay.id} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                    <input 
                      value={overlay.text}
                      onChange={(e) => setTextOverlays(textOverlays.map(o => o.id === overlay.id ? { ...o, text: e.target.value } : o))}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase mb-1">Start</p>
                        <input 
                          type="number" step="0.1" value={overlay.startTime}
                          onChange={(e) => setTextOverlays(textOverlays.map(o => o.id === overlay.id ? { ...o, startTime: parseFloat(e.target.value) } : o))}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase mb-1">End</p>
                        <input 
                          type="number" step="0.1" value={overlay.endTime}
                          onChange={(e) => setTextOverlays(textOverlays.map(o => o.id === overlay.id ? { ...o, endTime: parseFloat(e.target.value) } : o))}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'filters' && selectedClip && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Original', filter: 'none' },
                  { id: 'grayscale', label: 'B&W', filter: 'grayscale(100%)' },
                  { id: 'sepia', label: 'Vintage', filter: 'sepia(100%)' },
                  { id: 'invert', label: 'Invert', filter: 'invert(100%)' },
                  { id: 'blur', label: 'Dreamy', filter: 'blur(5px)' },
                  { id: 'hue', label: 'Psychedelic', filter: 'hue-rotate(90deg)' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setClips(clips.map(c => c.id === selectedClip.id ? { ...c, filter: f.filter } : c))}
                    className={`p-3 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedClip.filter === f.filter ? 'bg-emerald-500 text-black' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-950">
          {/* Preview Window */}
          <div className="flex-1 relative flex items-center justify-center p-8">
            <div className="w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
              {clips.length > 0 ? (
                <>
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    style={{ filter: currentClipData?.clip.filter || 'none' }}
                  />
                  {/* Text Overlays */}
                  <AnimatePresence>
                    {textOverlays.map(overlay => (
                      currentTime >= overlay.startTime && currentTime <= overlay.endTime && (
                        <motion.div
                          key={overlay.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute pointer-events-none"
                          style={{ 
                            left: `${overlay.x}%`, 
                            top: `${overlay.y}%`,
                            fontSize: `${overlay.fontSize}px`,
                            color: overlay.color,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            fontWeight: 'bold'
                          }}
                        >
                          {overlay.text}
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                  <Video size={64} className="mb-4" />
                  <p className="text-sm font-medium">No clips added yet</p>
                </div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10">
              <button onClick={() => setCurrentTime(Math.max(0, currentTime - 5))} className="text-white/60 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 5))} className="text-white/60 hover:text-white transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-72 bg-slate-900 border-t border-white/10 flex flex-col">
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-lg">
                  <Clock size={16} />
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </div>
              </div>
              {selectedClip && (
                <div className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Trimming: {selectedClip.name}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" step="0.1" value={selectedClip.startTime}
                      onChange={(e) => setClips(clips.map(c => c.id === selectedClip.id ? { ...c, startTime: parseFloat(e.target.value) } : c))}
                      className="w-12 bg-black/40 border border-white/10 rounded px-1 text-[10px] text-center"
                    />
                    <span className="text-white/20">-</span>
                    <input 
                      type="number" step="0.1" value={selectedClip.endTime}
                      onChange={(e) => setClips(clips.map(c => c.id === selectedClip.id ? { ...c, endTime: parseFloat(e.target.value) } : c))}
                      className="w-12 bg-black/40 border border-white/10 rounded px-1 text-[10px] text-center"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-950/50">
              {/* Playhead Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-30 pointer-events-none shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ left: `${(currentTime / Math.max(totalDuration, 1)) * 100}%` }}
              >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-emerald-500 rounded-full" />
              </div>

              <div className="p-6 space-y-4 min-w-full" style={{ width: `${Math.max(100, (totalDuration / 30) * 100)}%` }}>
                {/* Video Track */}
                <div className="h-16 bg-white/5 rounded-xl border border-white/5 flex relative overflow-hidden">
                  {clips.map((clip) => (
                    <div 
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`h-full border-r border-white/10 flex items-center px-4 gap-2 transition-all cursor-pointer ${selectedClipId === clip.id ? 'bg-emerald-500/20' : 'hover:bg-white/5'}`}
                      style={{ width: `${((clip.endTime - clip.startTime) / totalDuration) * 100}%` }}
                    >
                      <Video size={14} className={selectedClipId === clip.id ? 'text-emerald-400' : 'text-white/40'} />
                      <span className="text-[10px] font-bold truncate">{clip.name}</span>
                    </div>
                  ))}
                </div>

                {/* Audio Track */}
                <div className="h-12 bg-white/5 rounded-xl border border-white/5 flex relative overflow-hidden">
                  {audioTracks.map(track => (
                    <div 
                      key={track.id}
                      className="h-full bg-blue-500/10 border-r border-blue-500/20 flex items-center px-4 gap-2"
                      style={{ width: '100%' }}
                    >
                      <Music size={14} className="text-blue-400" />
                      <span className="text-[10px] font-bold truncate text-blue-400/60">{track.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element for Background Music */}
      {audioTracks.length > 0 && (
        <audio ref={audioRef} src={audioTracks[0].url} loop />
      )}

      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
      <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioUpload} />
    </div>
  );
}
