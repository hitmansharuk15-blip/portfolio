"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Shield, Cpu, HardDrive, Wifi, AlertTriangle } from "lucide-react";

const ASCII_LOGO = `
  ____  _   _    _    ____  _   _ _  __
 / ___|| | | |  / \\  |  _ \\| | | | |/ /
 \\___ \\| |_| | / _ \\ | |_) | | | | ' / 
  ___) |  _  |/ ___ \\|  _ <| |_| | . \\ 
 |____/|_| |_/_/   \\_\\_| \\_\\\\___/|_|\\_\\
`;

// Lightweight CSS Matrix Generator
const MatrixRain = () => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Generate columns only on client to avoid SSR mismatch
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 10 : 25; // Less columns on mobile
    const newCols = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i / count) * 100}%`,
      duration: Math.random() * 5 + 4, // 4s to 9s
      delay: Math.random() * -5,
      text: Array.from({ length: 40 }, () => (Math.random() > 0.5 ? "1" : "0")).join("\n"),
    }));
    setColumns(newCols);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      {columns.map((col) => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: col.left,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
            whiteSpace: "pre-line"
          }}
        >
          {col.text}
        </div>
      ))}
    </div>
  );
};

export default function TerminalOS({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [booting, setBooting] = useState(true);
  const [isMatrix, setIsMatrix] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [stats, setStats] = useState({ cpu: 12, ram: 45, net: 88 });
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Audio Synth for Typing
  const playTypeSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(400 + Math.random() * 100, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen) {
      setBooting(true);
      const timer = setTimeout(() => setBooting(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || booting) return;
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 5,
        ram: Math.floor(Math.random() * 20) + 40,
        net: Math.floor(Math.random() * 50) + 50,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen, booting]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (!booting && isOpen && inputRef.current) inputRef.current.focus();
  }, [booting, isOpen]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      if (!cmd) return;

      let output = [];
      let isError = false;

      switch (cmd) {
        case "help":
          output = [
            "Available commands:",
            "  about      - Who am I?",
            "  projects   - View my work",
            "  skills     - My tech stack",
            "  contact    - Get in touch",
            "  diag       - Run system diagnostics",
            "  glitch     - Trigger visual glitch",
            "  matrix     - Enter the matrix",
            "  clear      - Clear terminal",
            "  exit       - Close terminal",
          ];
          break;
        case "about":
          output = [
            "> Name: Sharuk",
            "> Role: Creative Developer",
            "> Status: Building immersive digital experiences.",
          ];
          break;
        case "projects":
          output = [
            "> [01] Neural E-Commerce",
            "> [02] Quantum Dashboard",
            "> [03] Aether AI",
          ];
          break;
        case "contact":
          output = [
            "> Email: hello@yourdomain.dev",
            "> GitHub: github.com/hitmansharuk15-blip",
          ];
          break;
        case "diag":
          output = [
            "> INITIATING DIAGNOSTICS...",
            `> CPU_LOAD: ${stats.cpu}%`,
            `> MEMORY: ${stats.ram}%`,
            `> NETWORK: ${stats.net}MB/s`,
            "> SYSTEM STATUS: OPTIMAL",
          ];
          break;
        case "glitch":
          setIsGlitching(true);
          output = ["> WARNING: VISUAL CORTEX OVERLOAD..."];
          setTimeout(() => setIsGlitching(false), 2000);
          break;
        case "matrix":
          setIsMatrix(!isMatrix);
          output = ["> TOGGLING THE MATRIX..."];
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "exit":
          onClose();
          return;
        default:
          output = [`Command not found: ${cmd}. Type 'help' for options.`];
          isError = true;
      }

      setHistory((prev) => [...prev, { cmd, output, isError }]);
      setInput("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-12 bg-black/90 backdrop-blur-xl"
        >
          {/* Matrix Background */}
          {isMatrix && <MatrixRain />}

          {/* Main Terminal Window */}
          <div className={`relative z-10 w-full max-w-4xl h-[90dvh] md:h-[80vh] bg-[#0A0A0A] border border-lime/30 shadow-[0_0_50px_rgba(163,230,53,0.15)] rounded-lg flex flex-col overflow-hidden font-mono text-sm md:text-base transition-all duration-300 ${isGlitching ? "translate-x-2 translate-y-2" : ""}`}>
            
            {/* Glitch Overlay */}
            {isGlitching && <div className="absolute inset-0 bg-lime/20 z-50 pointer-events-none mix-blend-overlay" />}

            {/* CRT Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-30" />

            {/* Header */}
            <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10 z-30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className={`ml-4 text-muted text-[10px] tracking-widest flex items-center gap-2 ${isGlitching ? "glitch-text text-lime" : ""}`}>
                  <Terminal size={12} /> SHARUK_OS v2.0.0
                </span>
              </div>
              <button onClick={onClose} className="text-muted hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="bg-black px-4 py-1 flex items-center gap-4 md:gap-6 border-b border-lime/10 text-[9px] md:text-[10px] text-lime/70 z-30 overflow-x-auto whitespace-nowrap">
              <span className="flex items-center gap-1"><Cpu size={10} /> CPU: {stats.cpu}%</span>
              <span className="flex items-center gap-1"><HardDrive size={10} /> RAM: {stats.ram}%</span>
              <span className="flex items-center gap-1"><Wifi size={10} /> NET: {stats.net}MB/s</span>
              <span className="ml-auto flex items-center gap-1 text-green-400"><Shield size={10} /> SECURE</span>
            </div>

            {/* Body */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 md:p-6 overflow-y-auto z-10 text-lime"
              onClick={() => inputRef.current?.focus()}
            >
              {booting ? (
                <div className="flex flex-col gap-2">
                  <p className="animate-pulse">Booting SHARUK_OS...</p>
                  <p>Loading kernel modules...</p>
                  <p>Establishing secure connection...</p>
                </div>
              ) : (
                <>
                  {history.length === 0 && (
                    <div className="mb-6">
                      <pre className="text-lime text-[6px] md:text-[10px] leading-none mb-4">{ASCII_LOGO}</pre>
                      <p className="text-white">Welcome to my interactive terminal.</p>
                      <p className="text-muted">Type <span className="text-lime font-bold">'help'</span> to see available commands.</p>
                    </div>
                  )}

                  {history.map((h, i) => (
                    <div key={i} className="mb-4">
                      <p className="flex gap-2 text-white">
                        <span className="text-lime">➜</span> 
                        <span className="text-muted">root@sharuk</span>:<span className="text-blue-400">~</span>$ {h.cmd}
                      </p>
                      <div className={`mt-1 pl-4 ${h.isError ? "text-red-400" : "text-lime/80"}`}>
                        {h.output.map((line, j) => (
                          <p key={j}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <span className="text-lime">➜</span>
                    <span className="text-muted">root@sharuk</span>:<span className="text-blue-400">~</span>$
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        playTypeSound();
                        handleCommand(e);
                      }}
                      className="flex-1 bg-transparent outline-none border-none text-white caret-lime"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                </>
              )}
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}