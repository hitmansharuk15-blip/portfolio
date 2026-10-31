"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Shield, Cpu, HardDrive, ArrowRight } from "lucide-react";

const ASCII_LOGO = `
  ____  _   _    _    ____  _   _ _  __
 / ___|| | | |  / \\  |  _ \\| | | | |/ /
 \\___ \\| |_| | / _ \\ | |_) | | | | ' / 
  ___) |  _  |/ ___ \\|  _ <| |_| | . \\ 
 |____/|_| |_/_/   \\_\\_| \\_\\\\___/|_|\\_\\
`;

const ASCII_BANNER = `
 ██████╗██╗  ██╗ █████╗ ██████╗ ██╗   ██╗██╗  ██╗
██╔════╝██║  ██║██╔══██╗██╔══██╗██║   ██║██║ ██╔╝
╚█████╗ ███████║███████║██████╔╝██║   ██║█████╔╝ 
 ╚═══██╗██╔══██║██╔══██║██╔══██╗██║   ██║██╔═██╗ 
██████╔╝██║  ██║██║  ██║██║  ██║╚██████╔╝██║  ██╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`;

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why did the developer go broke? Because he used up all his cache.",
];

// 👇 UPDATED: 100% HTTPS STREAMS (Mobile Compatible)
const STATIONS = [
  { name: "Tamil Hits Radio", url: "https://stream.zeno.fm/8hrzqn65pa0uv" },
  { name: "Anbu FM Tamil", url: "https://stream.zeno.fm/5csru2np4bruv" },
  { name: "Radio Mirchi Tamil", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
  { name: "Old Tamil Melodies", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/TL01_TAMIL_S01_SC" },
];

export default function TerminalOS({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [booting, setBooting] = useState(true);
  const [isMatrix, setIsMatrix] = useState(false);
  const [stats, setStats] = useState({ cpu: 12, ram: 45 });
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [isCrashing, setIsCrashing] = useState(false);
  const [textColor, setTextColor] = useState("text-lime");
  const [currentStation, setCurrentStation] = useState(0);
  
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

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
      setIsCrashing(false);
      setTextColor("text-lime");
      setHistory([]);
      
      // 👇 MOBILE AUDIO UNLOCK HACK 👇
      // This plays a silent audio file to unlock the browser's audio engine for this session
      try {
        const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
        silentAudio.play().catch(() => {});
      } catch (e) {}

      const timer = setTimeout(() => setBooting(false), 1000);
      return () => clearTimeout(timer);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || booting || isCrashing) return;
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 5,
        ram: Math.floor(Math.random() * 20) + 40,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen, booting, isCrashing]);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  }, [history, input, isCrashing]);

  useEffect(() => {
    if (!booting && isOpen && inputRef.current && !isCrashing) inputRef.current.focus();
  }, [booting, isOpen, isCrashing]);

  const executeCommand = () => {
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
          "  social     - Get social links",
          "  resume     - Download my resume",
          "  banner     - Print huge ASCII banner",
          "  radio      - List Tamil stations",
          "  music      - Play selected station",
          "  stop       - Stop music",
          "  dance      - Make UI dance",
          "  weather    - Cyberpunk weather",
          "  ping       - Ping my brain",
          "  sudo su    - Escalate privileges",
          "  hack       - Initiate hack sequence",
          "  matrix     - Toggle matrix rain",
          "  rm -rf /   - DO NOT RUN THIS",
          "  clear      - Clear terminal",
          "  exit       - Close terminal",
        ];
        break;
      case "about":
        output = [" > I am a Creative Developer building immersive web experiences."];
        break;
      case "projects":
        output = [
          " > [01] Neural E-Commerce",
          " > [02] Quantum Dashboard",
          " > [03] Aether AI",
        ];
        break;
      case "social":
        output = [
          " > GitHub: github.com/hitmansharuk15-blip",
          " > LinkedIn: linkedin.com/in/your-handle",
        ];
        break;
      case "resume":
        output = [" > Initializing secure download..."];
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Sharuk_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case "banner":
        output = [`\n${ASCII_BANNER}\n`];
        break;
      case "radio":
        output = [
          " > Available Tamil Stations:",
          ...STATIONS.map((s, i) => `   [${i + 1}] ${s.name}`),
          " > Type 'radio <number>' to switch (e.g., 'radio 2')",
        ];
        break;
      case "music":
        if (audioRef.current) {
          audioRef.current.src = STATIONS[currentStation].url;
          audioRef.current.load(); 
          
          audioRef.current.play()
            .then(() => {
              output = [` > Playing: ${STATIONS[currentStation].name} 🎵`];
            })
            .catch((error) => {
              console.warn("Playback failed:", error);
              output = [
                " > ⚠️ Playback blocked by browser.",
                " > Please tap the RUN button one more time to unlock audio.",
              ];
              isError = true;
            });
        }
        break;
      case "stop":
        if (audioRef.current) {
          audioRef.current.pause();
          output = [" > Music stopped."];
        }
        break;
      case "dance":
        output = [" > PARTY MODE ACTIVATED. 🕺"];
        document.body.classList.add("dance-mode");
        setTimeout(() => {
          document.body.classList.remove("dance-mode");
        }, 3000);
        break;
      case "weather":
        output = [
          " > City: Neo-Tokyo (Villupuram)",
          " > Temp: 24°C (Perfect coding weather)",
          " > Condition: Acid Rain (Bring an umbrella)",
          " > Humidity: 80% (Coffee levels critical)",
        ];
        break;
      case "ping":
        output = [
          " > PING brain.dev (127.0.0.1): 56 data bytes",
          " > 64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms",
          " > 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms",
          " > 64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.045 ms",
          " > --- brain.dev ping statistics ---",
          " > 3 packets transmitted, 3 packets received, 0.0% packet loss",
        ];
        break;
      case "sudo su":
        setTextColor("text-red-500");
        output = [" > ROOT ACCESS GRANTED. GOD MODE ENABLED. 🔥"];
        break;
      case "hack":
        setIsHacking(true);
        output = [" > INITIATING HACK SEQUENCE..."];
        let prog = 0;
        const interval = setInterval(() => {
          prog += 10;
          setHackProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            setIsHacking(false);
            setHistory((prev) => [...prev, { cmd: "HACK_COMPLETE", output: [" > ACCESS GRANTED. Welcome, Admin."], isError: false }]);
          }
        }, 300);
        break;
      case "matrix":
        setIsMatrix(!isMatrix);
        output = ["> TOGGLING THE MATRIX..."];
        break;
      case "rm -rf /":
      case "rm -rf":
        setIsCrashing(true);
        setInput("");
        return;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        onClose();
        return;
      default:
        if (cmd.startsWith("radio ")) {
          const stationNum = parseInt(cmd.split(" ")[1]);
          if (stationNum >= 1 && stationNum <= STATIONS.length) {
            setCurrentStation(stationNum - 1);
            output = [` > Switched to ${STATIONS[stationNum - 1].name}. Type 'music' to play.`];
          } else {
            output = [" > Invalid station number. Type 'radio' to list stations."];
            isError = true;
          }
        } else {
          output = [`Command not found: ${cmd}. Type 'help' for options.`];
          isError = true;
        }
    }

    setHistory((prev) => [...prev, { cmd, output, isError }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    playTypeSound();
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand();
    }
  };

  const [columns, setColumns] = useState([]);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 8 : 25;
    const newCols = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i / count) * 100}%`,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * -5,
      text: Array.from({ length: 40 }, () => (Math.random() > 0.5 ? "1" : "0")).join("\n"),
    }));
    setColumns(newCols);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl"
        >
          {/* 👇 FIXED AUDIO TAG FOR MOBILE 👇 */}
          <audio 
            ref={audioRef} 
            className="w-0 h-0 opacity-0 absolute pointer-events-none" 
            playsInline 
          />

          {isMatrix && (
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
          )}

          <div className="relative z-10 w-full h-[100dvh] md:h-[85vh] md:max-w-4xl md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:absolute bg-[#0A0A0A] border-0 md:border border-lime/30 shadow-[0_0_50px_rgba(163,230,53,0.15)] md:rounded-lg flex flex-col overflow-hidden font-mono text-sm md:text-base">
            
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full cursor-pointer ${isCrashing ? "bg-red-900" : "bg-red-500"}`} onClick={onClose} />
                <div className="w-3 h-3 rounded-full bg-yellow-500 hidden md:block" />
                <div className="w-3 h-3 rounded-full bg-green-500 hidden md:block" />
                <span className="ml-2 md:ml-4 text-muted text-[10px] tracking-widest flex items-center gap-2">
                  <Terminal size={12} /> {isCrashing ? "SYSTEM_CRASH" : "SHARUK_OS v4.0"}
                </span>
              </div>
              <button onClick={onClose} className="text-muted hover:text-white transition-colors p-2">
                <X size={20} />
              </button>
            </div>

            <div className="bg-black px-4 py-1 flex items-center gap-4 border-b border-lime/10 text-[9px] text-lime/70 shrink-0 overflow-x-auto whitespace-nowrap">
              <span className="flex items-center gap-1"><Cpu size={10} /> CPU: {isCrashing ? "99" : stats.cpu}%</span>
              <span className="flex items-center gap-1"><HardDrive size={10} /> RAM: {isCrashing ? "99" : stats.ram}%</span>
              <span className={`ml-auto flex items-center gap-1 ${isCrashing ? "text-red-500" : "text-green-400"}`}>
                <Shield size={10} /> {isCrashing ? "COMPROMISED" : "SECURE"}
              </span>
            </div>

            <div 
              ref={scrollRef}
              className={`flex-1 p-4 md:p-6 overflow-y-auto relative ${isCrashing ? "bg-red-950/20" : textColor}`}
            >
              {isCrashing ? (
                <div className="text-red-500 font-mono text-xs md:text-sm">
                  <p className="mb-2">WARNING: CRITICAL SYSTEM FAILURE DETECTED</p>
                  <p className="mb-2">Removing directory: /bin</p>
                  <p className="mb-2">Removing directory: /etc</p>
                  <p className="mb-2">Removing directory: /usr</p>
                  <p className="mb-2">Removing directory: /home</p>
                  <p className="mb-4">Kernel panic - not syncing: Fatal exception</p>
                  <p className="animate-pulse">Rebooting SHARUK_OS in 3...</p>
                  <button 
                    onClick={() => {
                      setIsCrashing(false);
                      setBooting(true);
                      setTimeout(() => setBooting(false), 1500);
                    }}
                    className="mt-6 border border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-black transition-colors"
                  >
                    HARD REBOOT
                  </button>
                </div>
              ) : booting ? (
                <div className="flex flex-col gap-2">
                  <p className="animate-pulse">Booting SHARUK_OS v4.0...</p>
                  <p>Loading kernel modules...</p>
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
                        <span className="text-muted">root@sharuk</span>$ {h.cmd}
                      </p>
                      <div className={`mt-1 pl-4 whitespace-pre-wrap ${h.isError ? "text-red-400" : ""}`}>
                        {h.output.map((line, j) => (
                          <p key={j}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {isHacking && (
                    <div className="mt-2 mb-4">
                      <p className="text-red-500 animate-pulse">Hacking mainframe...</p>
                      <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-lime transition-all duration-300" style={{ width: `${hackProgress}%` }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {!isCrashing && (
              <div className="bg-black/50 border-t border-lime/20 p-3 md:p-4 flex items-center gap-3 shrink-0 pb-safe">
                <span className="text-lime font-bold">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white caret-lime text-base md:text-lg"
                  placeholder="Type a command..."
                  autoComplete="off"
                  spellCheck="false"
                />
                <button 
                  onClick={executeCommand}
                  className="bg-lime text-black px-4 py-2 rounded font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform"
                >
                  RUN <ArrowRight size={14} />
                </button>
              </div>
            )}
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}