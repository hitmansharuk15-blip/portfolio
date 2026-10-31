"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Shield, Cpu, HardDrive, Wifi } from "lucide-react";

// Fake ASCII Art
const ASCII_LOGO = `
  ____  _   _    _    ____  _   _ _  __
 / ___|| | | |  / \\  |  _ \\| | | | |/ /
 \\___ \\| |_| | / _ \\ | |_) | | | | ' / 
  ___) |  _  |/ ___ \\|  _ <| |_| | . \\ 
 |____/|_| |_/_/   \\_\\_| \\_\\\\___/|_|\\_\\
`;

export default function TerminalOS({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [booting, setBooting] = useState(true);
  const [isMatrix, setIsMatrix] = useState(false);
  const [stats, setStats] = useState({ cpu: 12, ram: 45, net: 88 });
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Boot sequence
  useEffect(() => {
    if (isOpen) {
      setBooting(true);
      const timer = setTimeout(() => setBooting(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fake System Stats
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on load
  useEffect(() => {
    if (!booting && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
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
            "> Location: Villupuram, India",
          ];
          break;
        case "projects":
          output = [
            "> [01] Neural E-Commerce (Next.js, Three.js)",
            "> [02] Quantum Dashboard (React, D3.js)",
            "> [03] Aether AI (Python, OpenAI)",
            "Type 'open [id]' to view (e.g., open 01)",
          ];
          break;
        case "contact":
          output = [
            "> Email: hello@yourdomain.dev",
            "> GitHub: github.com/hitmansharuk15-blip",
            "> LinkedIn: linkedin.com/in/your-handle",
          ];
          break;
        case "matrix":
          setIsMatrix(true);
          output = ["> ENTERING THE MATRIX..."];
          setTimeout(() => setIsMatrix(false), 4000);
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "exit":
          onClose();
          return;
        default:
          if (cmd.startsWith("open ")) {
            output = [`> Launching project ${cmd.split(" ")[1]}...`];
          } else {
            output = [`Command not found: ${cmd}. Type 'help' for options.`];
            isError = true;
          }
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
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 ${
            isMatrix ? "bg-black" : "bg-black/80 backdrop-blur-xl"
          }`}
        >
          {/* Matrix Background Effect */}
          {isMatrix && (
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden font-mono text-green-500 text-xs flex justify-between">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "linear" }}
                  className="flex flex-col"
                >
                  {Array.from({ length: 50 }).map((_, j) => (
                    <span key={j}>{Math.random() > 0.5 ? "1" : "0"}</span>
                  ))}
                </motion.div>
              ))}
            </div>
          )}

          {/* Terminal Window */}
          <div className="relative z-10 w-full max-w-4xl h-[80vh] bg-[#0A0A0A] border border-lime/30 shadow-[0_0_50px_rgba(163,230,53,0.15)] rounded-lg flex flex-col overflow-hidden font-mono text-sm md:text-base">
            
            {/* CRT Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-30" />

            {/* Header Bar */}
            <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10 z-30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-muted text-[10px] tracking-widest flex items-center gap-2">
                  <Terminal size={12} /> SHARUK_OS v1.0.0
                </span>
              </div>
              <button onClick={onClose} className="text-muted hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* System Stats Bar */}
            <div className="bg-black px-4 py-1 flex items-center gap-6 border-b border-lime/10 text-[10px] text-lime/70 z-30">
              <span className="flex items-center gap-1"><Cpu size={10} /> CPU: {stats.cpu}%</span>
              <span className="flex items-center gap-1"><HardDrive size={10} /> RAM: {stats.ram}%</span>
              <span className="flex items-center gap-1"><Wifi size={10} /> NET: {stats.net}MB/s</span>
              <span className="ml-auto flex items-center gap-1 text-green-400"><Shield size={10} /> SECURE</span>
            </div>

            {/* Terminal Body */}
            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto z-10 text-lime"
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
                  {/* Welcome Logo */}
                  {history.length === 0 && (
                    <div className="mb-8">
                      <pre className="text-lime text-[8px] md:text-xs leading-none mb-4">{ASCII_LOGO}</pre>
                      <p className="text-white">Welcome to my interactive terminal.</p>
                      <p className="text-muted">Type <span className="text-lime font-bold">'help'</span> to see available commands.</p>
                    </div>
                  )}

                  {/* Command History */}
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

                  {/* Active Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-lime">➜</span>
                    <span className="text-muted">root@sharuk</span>:<span className="text-blue-400">~</span>$
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleCommand}
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