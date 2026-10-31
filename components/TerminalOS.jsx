"use client";

import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback,
  useMemo 
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  X, 
  Shield, 
  Cpu, 
  HardDrive, 
  ArrowRight, 
  Wifi, 
  Clock, 
  Battery, 
  Activity
} from "lucide-react";

/* =========================================================================
   00. NEW: AUDIO SYNTHESIZER ENGINE (MECHANICAL KEYBOARD)
   ========================================================================= */
let audioCtx = null;

const playKeySound = () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "square";
    osc.frequency.setValueAtTime(600 + Math.random() * 300, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) {}
};

/* =========================================================================
   01. CONSTANTS, ASCII ART & STATIC DATA
   ========================================================================= */

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

const ASCII_COFFEE = `
      (  )   (   )  )
       ) (   )  (  (
       ( )  (    ) )
       _____________
      <_____________> ___
      |             |/ _ \\
      |               | | |
      |               |_|_|
      |             |/\\__/
   ___|             |___/
  /    \\___________/    \\
  \\_____________________/
`;

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why did the developer go broke? Because he used up all his cache.",
  "There are 10 types of people in this world: those who understand binary, and those who don't.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.' He returns with 12 loaves of bread.",
  "What is the most used language in programming? Profanity.",
  "Why did the programmer quit his job? Because he didn't get arrays.",
  "I would tell you a UDP joke, but you might not get it.",
  "Knock, knock. Who's there? Recursion. Recursion who? Knock, knock...",
  "There's no place like 127.0.0.1.",
  "Debugging: Being the detective in a crime movie where you are also the murderer.",
  "The best thing about a Boolean is even if you are wrong, you are only off by a bit.",
  "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears."
];

const QUOTES = [
  "Talk is cheap. Show me the code. - Linus Torvalds",
  "Programs must be written for people to read. - Harold Abelson",
  "Simplicity is the soul of efficiency. - Austin Freeman",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "Make it work, make it right, make it fast. - Kent Beck",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
  "The most disastrous thing that you can ever learn is your first programming language. - Alan Kay",
  "Premature optimization is the root of all evil. - Donald Knuth"
];

const STATIONS = [
  { name: "Tamil Hits Radio", url: "https://stream.zeno.fm/8hrzqn65pa0uv" },
  { name: "Anbu FM Tamil", url: "https://stream.zeno.fm/5csru2np4bruv" },
  { name: "Radio Mirchi Tamil", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
];

const THEMES = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/30" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/30" },
  purple: { text: "text-purple-400", bg: "bg-purple-400", border: "border-purple-400/30" },
  amber: { text: "text-amber-400", bg: "bg-amber-400", border: "border-amber-400/30" },
  rose: { text: "text-rose-400", bg: "bg-rose-400", border: "border-rose-400/30" },
  blue: { text: "text-blue-400", bg: "bg-blue-400", border: "border-blue-400/30" },
};

const FILE_SYSTEM = {
  "about.txt": "I am a Creative Developer building immersive web experiences.",
  "contact.txt": "GitHub: github.com/hitmansharuk15-blip\nLinkedIn: linkedin.com/in/your-handle",
  "projects.txt": "[01] Neural E-Commerce\n[02] Quantum Dashboard\n[03] Aether AI",
  "secret.txt": "You found the hidden file! Type 'matrix' in the terminal for a surprise.",
};

/* =========================================================================
   02. MATRIX RAIN COMPONENT (ISOLATED)
   ========================================================================= */
const MatrixRain = () => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 10 : 30;
    const newCols = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i / count) * 100}%`,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * -5,
      text: Array.from({ length: 50 }, () => (Math.random() > 0.5 ? "1" : "0")).join("\n"),
    }));
    setColumns(newCols);
  }, []);

  return (
    <div className="matrix-rain-container">
      {columns.map((col) => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: col.left,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.text}
        </div>
      ))}
    </div>
  );
};

/* =========================================================================
   03. MAIN TERMINAL COMPONENT
   ========================================================================= */
export default function TerminalOS({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [booting, setBooting] = useState(true);
  const [isMatrix, setIsMatrix] = useState(false);
  const [isCrashing, setIsCrashing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("emerald");
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  
  const [stats, setStats] = useState({ 
    cpu: 12, 
    ram: 45, 
    net: 88, 
    battery: 100,
    uptime: 0 
  });

  const [currentStation, setCurrentStation] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [gameActive, setGameActive] = useState(false);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  const theme = THEMES[currentTheme];

  const fetchWeather = async () => {
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true");
      const data = await res.json();
      return data.current_weather;
    } catch (error) {
      console.error("Weather fetch failed", error);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setBooting(true);
      setIsCrashing(false);
      setCurrentTheme("emerald");
      setHistory([]);
      setGameActive(false);
      
      try {
        const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
        silentAudio.play().catch(() => {});
      } catch (e) {}

      const timer = setTimeout(() => setBooting(false), 1200);
      return () => clearTimeout(timer);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || booting || isCrashing) return;
    
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.floor(Math.random() * 30) + 5,
        ram: Math.floor(Math.random() * 20) + 40,
        net: Math.floor(Math.random() * 50) + 50,
        battery: prev.battery > 20 ? prev.battery - 1 : 100,
        uptime: prev.uptime + 1
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isOpen, booting, isCrashing]);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
    }
  }, [history, input, isCrashing, gameActive]);

  useEffect(() => {
    if (!booting && isOpen && inputRef.current && !isCrashing) {
      inputRef.current.focus();
    }
  }, [booting, isOpen, isCrashing]);

  const executeCommand = async () => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output = [];
    let isError = false;

    const pushToHistory = (text, error = false) => {
      setHistory(prev => [...prev, { cmd, output: Array.isArray(text) ? text : [text], isError: error }]);
      setInput("");
    };

    if (cmd.startsWith("calc ")) {
      try {
        const expression = cmd.replace("calc ", "");
        const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
        if (!sanitized) throw new Error("Invalid");
        const result = new Function(`return ${sanitized}`)();
        if (result === undefined || Number.isNaN(result)) throw new Error("Invalid");
        pushToHistory(` > ${sanitized} = ${result}`);
      } catch (e) {
        pushToHistory(" > Invalid math. Example: calc 5 + 5", true);
      }
      return;
    }

    if (gameActive) {
      if (cmd === "attack") {
        const dmg = Math.floor(Math.random() * 20) + 10;
        const newEnemyHP = Math.max(0, enemyHP - dmg);
        setEnemyHP(newEnemyHP);
        let msg = ` > You dealt ${dmg} damage! Enemy HP: ${newEnemyHP}`;
        
        if (newEnemyHP === 0) {
          setGameActive(false);
          msg += "\n > VICTORY! You defeated the Bug! Type 'start game' to play again.";
          pushToHistory(msg);
        } else {
          const enemyDmg = Math.floor(Math.random() * 15) + 5;
          const newPlayerHP = Math.max(0, playerHP - enemyDmg);
          setPlayerHP(newPlayerHP);
          msg += `\n > Enemy hit you for ${enemyDmg} damage! Your HP: ${newPlayerHP}`;
          if (newPlayerHP === 0) {
            setGameActive(false);
            msg += "\n > GAME OVER. The Bug got you. Type 'start game' to retry.";
          }
          pushToHistory(msg);
        }
      } else if (cmd === "heal") {
        const heal = Math.floor(Math.random() * 20) + 10;
        const newPlayerHP = Math.min(100, playerHP + heal);
        setPlayerHP(newPlayerHP);
        pushToHistory(` > You healed ${heal} HP! Your HP: ${newPlayerHP}`);
      } else if (cmd === "exit") {
        setGameActive(false);
        pushToHistory(" > You fled the battle.");
      } else {
        pushToHistory(" > Invalid command. Type 'attack', 'heal', or 'exit'.", true);
      }
      return;
    }

    switch (cmd) {
      case "help":
        pushToHistory([
          "=========================================",
          "  SHARUK_OS v6.0 - COMMANDS",
          "=========================================",
          "  NAVIGATION",
          "  about      - Who am I?",
          "  projects   - View my work",
          "  social     - Get social links",
          "  resume     - Download my resume",
          "",
          "  SYSTEM INFO",
          "  neofetch   - Display system hardware",
          "  time       - Show current time",
          "  date       - Show current date",
          "  weather    - Fetch real-time weather",
          "  sys        - Deep system diagnostics",
          "  ping       - Network diagnostic test",
          "",
          "  FILE SYSTEM",
          "  ls         - List files",
          "  cat <file> - Read file contents",
          "  dir        - Alias for ls",
          "",
          "  GAME",
          "  start game - Start the Bug Battle",
          "",
          "  FUN & UTILITIES",
          "  calc <num> - Calculate math (calc 5+5)",
          "  beep       - Play a terminal beep",
          "  crypto     - Fetch live crypto prices",
          "  theme      - Change color (emerald/cyan)",
          "  quote      - Print a dev quote",
          "  joke       - Tell a joke",
          "  coffee     - Print a coffee",
          "  banner     - Print huge ASCII banner",
          "  whoami     - Print user info",
          "  echo <txt> - Print text",
          "  history    - Show command history",
          "",
          "  AUDIO",
          "  radio      - List stations",
          "  music      - Play station",
          "  stop       - Stop music",
          "",
          "  EASTER EGGS",
          "  hack       - Initiate hack",
          "  matrix     - Toggle rain",
          "  glitch     - Trigger visual glitch",
          "  sudo su    - Escalate",
          "  rm -rf /   - DO NOT RUN",
          "",
          "  clear      - Clear screen",
          "  exit       - Close",
          "=========================================",
        ]);
        break;

      case "neofetch":
        pushToHistory([
          `       .---.        root@sharuk`,
          `      /     \\       ------------`,
          `      \\.@-@./       OS: SHARUK_OS v6.0`,
          `      /\`\\_/\`\\       Host: Next.js 16`,
          `     //  _  \\\\      Kernel: React 18`,
          `    | \\     )|_     Shell: bash`,
          `   /\`\\_\`>  <_/ \\    Resolution: ${typeof window !== 'undefined' ? window.innerWidth : 1920}x${typeof window !== 'undefined' ? window.innerHeight : 1080}`,
          `   \\__/'---'\\__/    DE: Framer Motion`,
          `                    Terminal: SHARUK_TTY`,
          `                    CPU: ${typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8}-core`,
          `                    Memory: ${typeof navigator !== 'undefined' ? (navigator.deviceMemory || 8) + 'GB' : '8GB'}`,
        ]);
        break;

      case "time":
        pushToHistory([` > Time: ${new Date().toLocaleTimeString()}`]);
        break;

      case "date":
        pushToHistory([` > Date: ${new Date().toLocaleDateString()}`]);
        break;

      case "weather":
        if (isFetchingWeather) {
          pushToHistory(" > Weather scan already in progress...", true);
          break;
        }
        setIsFetchingWeather(true);
        pushToHistory(" > Scanning atmospheric conditions...");
        
        const weatherData = await fetchWeather();
        setIsFetchingWeather(false);
        
        if (weatherData) {
          pushToHistory([
            " > ATMOSPHERIC_SCAN COMPLETE",
            " > -------------------------",
            ` > Location: Villupuram, IN`,
            ` > Temperature: ${weatherData.temperature}°C`,
            ` > Wind Speed: ${weatherData.windspeed} km/h`,
            ` > Wind Direction: ${weatherData.winddirection}°`,
            ` > Time: ${weatherData.time}`,
            ` > Status: SECURE`,
          ]);
        } else {
          pushToHistory(" > Weather API offline. Estimated temp: 25°C", true);
        }
        break;

      case "sys":
        pushToHistory([
          " > INITIATING DEEP SYSTEM DIAGNOSTICS...",
          " > ----------------------------------------",
          " > OS: SHARUK_OS v6.0 (Build 2025.10)",
          " > Kernel: React 18.2.0",
          " > Runtime: Next.js 16.4.3 (Turbopack)",
          " > Architecture: x86_64 / ARM64 (Cross-compiled)",
          " > Shell: bash 5.2",
          " > Terminal: SHARUK_TTY",
          " > User: root",
          " > Hostname: sharuk-mainframe",
          " > Local Time: " + new Date().toString(),
          " > Uptime: " + stats.uptime + " seconds",
          " > Load Average: 0.12, 0.08, 0.05",
          " > CPU Usage: " + stats.cpu + "%",
          " > RAM Usage: " + stats.ram + "%",
          " > Network: " + stats.net + " MB/s",
          " > Battery: " + stats.battery + "%",
          " > Disk: 512GB SSD (256GB Free)",
          " > GPU: WebGL 2.0 (Hardware Accelerated)",
          " > Display: " + window.innerWidth + "x" + window.innerHeight,
          " > Language: " + navigator.language,
          " > Platform: " + navigator.platform,
          " > User Agent: " + navigator.userAgent,
          " > Cookies: " + navigator.cookieEnabled,
          " > Online: " + navigator.onLine,
          " > Theme: " + currentTheme,
          " > Matrix Mode: " + (isMatrix ? "ON" : "OFF"),
          " > Audio: " + (isPlayingAudio ? "PLAYING" : "STOPPED"),
          " > Game: " + (gameActive ? "ACTIVE" : "IDLE"),
          " > ----------------------------------------",
          " > ALL SYSTEMS NOMINAL. SECURE CONNECTION ESTABLISHED."
        ]);
        break;

      case "ping":
        pushToHistory([
          " > PING sharuk.dev (127.0.0.1)",
          " > 64 bytes time=0.042 ms",
          " > 64 bytes time=0.038 ms",
          " > 64 bytes time=0.045 ms",
          " > 0.0% packet loss",
        ]);
        break;

      case "ls":
      case "dir":
        pushToHistory([
          " > Directory listing:",
          ...Object.keys(FILE_SYSTEM).map(f => `   - ${f}`),
        ]);
        break;

      case "start game":
        setGameActive(true);
        setPlayerHP(100);
        setEnemyHP(100);
        pushToHistory([
          " > INITIALIZING BUG BATTLE...",
          " > A wild NullPointerException appeared!",
          " > Commands: 'attack', 'heal', 'exit'",
        ]);
        break;

      case "theme":
        pushToHistory([
          " > Available Themes:",
          "   [1] emerald",
          "   [2] cyan",
          "   [3] purple",
          "   [4] amber",
          "   [5] rose",
          "   [6] blue",
          " > Type 'theme <name>' to apply.",
        ]);
        break;

      case "quote":
        pushToHistory([` > "${QUOTES[Math.floor(Math.random() * QUOTES.length)]}"`]);
        break;

      case "joke":
        pushToHistory([` > ${JOKES[Math.floor(Math.random() * JOKES.length)]}`]);
        break;

      case "coffee":
        pushToHistory([`\n${ASCII_COFFEE}\n`]);
        break;

      case "banner":
        pushToHistory([`\n${ASCII_BANNER}\n`]);
        break;

      case "about":
        pushToHistory([
          " > Name: Sharuk",
          " > Role: vibe codeDeveloper",
          " > Status: Building immersive digital experiences.",
        ]);
        break;

      case "projects":
        pushToHistory([
          " > [01] Neural E-Commerce",
          " > [02] Quantum Dashboard",
          " > [03] Aether AI",
        ]);
        break;

      case "social":
        pushToHistory([
          " > GitHub: github.com/hitmansharuk15-blip",
          " > LinkedIn: linkedin.com/in/your-handle",
        ]);
        break;

      case "resume":
        pushToHistory(" > Initializing secure download...");
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Sharuk_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;

      case "radio":
        pushToHistory([
          " > Available Tamil Stations:",
          ...STATIONS.map((s, i) => `   [${i + 1}] ${s.name}`),
          " > Type 'radio <number>' to switch.",
        ]);
        break;

      case "music":
        if (audioRef.current) {
          audioRef.current.src = STATIONS[currentStation].url;
          audioRef.current.load();
          audioRef.current.play()
            .then(() => {
              setIsPlayingAudio(true);
              pushToHistory(` > Playing: ${STATIONS[currentStation].name} 🎵`);
            })
            .catch(() => {
              pushToHistory(" > ⚠️ Playback blocked. Tap RUN again.", true);
            });
        }
        break;

      case "stop":
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
          pushToHistory(" > Music stopped.");
        }
        break;

      case "hack":
        setIsHacking(true);
        pushToHistory(" > INITIATING HACK SEQUENCE...");
        let prog = 0;
        const interval = setInterval(() => {
          prog += 5;
          setHackProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            setIsHacking(false);
            setHistory(prev => [...prev, { 
              cmd: "HACK_COMPLETE", 
              output: [" > ACCESS GRANTED."], 
              isError: false 
            }]);
          }
        }, 150);
        break;

      case "glitch":
        document.documentElement.classList.add("glitch-active");
        pushToHistory([
          " > ⚠️ WARNING: SYSTEM INSTABILITY DETECTED...",
          " > INITIATING VISUAL CORRUPTION..."
        ]);
        setTimeout(() => {
          document.documentElement.classList.remove("glitch-active");
        }, 2000);
        break;

      // 👇 NEW BEEP COMMAND 👇
      case "beep":
        playKeySound();
        pushToHistory(" > BEEP!");
        break;

      // 👇 NEW CRYPTO COMMAND 👇
      case "crypto":
        pushToHistory(" > Fetching live crypto prices...");
        try {
          const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
          const data = await res.json();
          pushToHistory([
            " > LIVE CRYPTO PRICES (USD)",
            " > -------------------------",
            ` > BTC: $${data.bitcoin.usd.toLocaleString()}`,
            ` > ETH: $${data.ethereum.usd.toLocaleString()}`,
            " > Data provided by CoinGecko"
          ]);
        } catch (e) {
          pushToHistory(" > Failed to fetch crypto data. Network offline.", true);
        }
        break;

      case "matrix":
        setIsMatrix(!isMatrix);
        pushToHistory(isMatrix ? " > Disabling Matrix..." : " > Enabling Matrix...");
        break;

      case "sudo su":
        setCurrentTheme("purple");
        pushToHistory(" > ROOT ACCESS GRANTED. 🔥");
        break;

      case "whoami":
        pushToHistory([
          " > User: root",
          " > Host: sharuk-mainframe",
          " > Role: Creative Developer",
          " > Mission: Building the future of the web.",
        ]);
        break;

      case "history":
        if (history.length === 0) {
          pushToHistory(" > No commands in history.", true);
        } else {
          pushToHistory([
            " > Command History:",
            ...history.map((h, i) => `   ${i + 1}. ${h.cmd}`)
          ]);
        }
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
        if (gameActive) {
          setGameActive(false);
          pushToHistory(" > You fled the battle.");
        } else {
          onClose();
        }
        return;

      default:
        if (cmd.startsWith("cat ")) {
          const file = cmd.replace("cat ", "");
          if (FILE_SYSTEM[file]) {
            pushToHistory([` > ${FILE_SYSTEM[file]}`]);
          } else {
            pushToHistory(` > File not found: ${file}`, true);
          }
        } else if (cmd.startsWith("echo ")) {
          const text = cmd.replace("echo ", "");
          pushToHistory([` > ${text}`]);
        } else if (cmd.startsWith("radio ")) {
          const num = parseInt(cmd.split(" ")[1]);
          if (num >= 1 && num <= STATIONS.length) {
            setCurrentStation(num - 1);
            pushToHistory(` > Switched to ${STATIONS[num - 1].name}.`);
          } else {
            pushToHistory(" > Invalid station.", true);
          }
        } else if (cmd.startsWith("theme ")) {
          const themeName = cmd.split(" ")[1];
          if (THEMES[themeName]) {
            setCurrentTheme(themeName);
            pushToHistory(` > Theme: ${themeName}.`);
          } else {
            pushToHistory(" > Invalid theme.", true);
          }
        } else {
          pushToHistory(`Command not found: ${cmd}. Type 'help'.`, true);
        }
    }
  };

  const handleKeyDown = (e) => {
    // 👇 NEW: PLAY SOUND ON EVERY KEYSTROKE
    playKeySound();
    
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
            isMatrix ? "bg-black" : "bg-black/90 backdrop-blur-xl"
          }`}
        >
          <audio 
            ref={audioRef} 
            className="w-0 h-0 opacity-0 absolute pointer-events-none" 
            playsInline 
          />

          {isMatrix && <MatrixRain />}

          <div className={`relative z-10 w-full h-[100dvh] md:h-[85vh] md:max-w-5xl md:rounded-xl flex flex-col overflow-hidden font-mono text-sm md:text-base shadow-2xl transition-all duration-500 ${
            isMatrix 
              ? `bg-[#0A0A0A]/80 ${theme.border} border-2` 
              : `bg-[#0A0A0A] border ${theme.border}`
          } ${isCrashing ? "border-red-500" : ""} md:rounded-lg`}>
            
            <div className="crt-scanline" />

            {/* Header */}
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0 relative z-20">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${isCrashing ? "bg-red-900" : "bg-red-500 hover:bg-red-600"}`} 
                  onClick={onClose} 
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500 hidden md:block" />
                <div className="w-3 h-3 rounded-full bg-green-500 hidden md:block" />
                <span className="ml-2 md:ml-4 text-muted text-[10px] tracking-widest flex items-center gap-2">
                  <Terminal size={12} /> 
                  {isCrashing ? "SYSTEM_CRASH" : "SHARUK_OS v6.0"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {isPlayingAudio && (
                  <div className="flex items-center gap-1 text-[9px] text-emerald-400 animate-pulse">
                    <Wifi size={12} /> AUDIO_ON
                  </div>
                )}
                <button onClick={onClose} className="text-muted hover:text-white transition-colors p-2">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-black/80 px-4 py-1 flex items-center gap-4 border-b border-white/10 text-[9px] text-muted shrink-0 overflow-x-auto whitespace-nowrap relative z-20">
              <span className={`flex items-center gap-1 ${theme.text}`}>
                <Cpu size={10} /> CPU: {isCrashing ? "99" : stats.cpu}%
              </span>
              <span className={`flex items-center gap-1 ${theme.text}`}>
                <HardDrive size={10} /> RAM: {isCrashing ? "99" : stats.ram}%
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> UPTIME: {stats.uptime}s
              </span>
              <span className="flex items-center gap-1">
                <Battery size={10} /> {stats.battery}%
              </span>
              <span className={`ml-auto flex items-center gap-1 ${isCrashing ? "text-red-500" : "text-green-400"}`}>
                <Shield size={10} /> {isCrashing ? "COMPROMISED" : "SECURE"}
              </span>
            </div>

            {/* Body */}
            <div 
              ref={scrollRef}
              className={`flex-1 p-4 md:p-6 overflow-y-auto relative z-10 custom-scrollbar ${
                isCrashing ? "bg-red-950/20 text-red-500" : theme.text
              }`}
            >
              {isCrashing ? (
                <div className="font-mono text-xs md:text-sm">
                  <p className="mb-2 font-bold animate-pulse">CRITICAL SYSTEM FAILURE</p>
                  <p className="mb-2">Removing directory: /bin</p>
                  <p className="mb-2">Removing directory: /etc</p>
                  <p className="mb-2">Removing directory: /usr</p>
                  <p className="mb-4">Kernel panic - Fatal exception</p>
                  <p className="animate-pulse">Rebooting in 3...</p>
                  <button 
                    onClick={() => {
                      setIsCrashing(false);
                      setBooting(true);
                      setCurrentTheme("emerald");
                      setTimeout(() => setBooting(false), 1500);
                    }}
                    className="mt-6 border border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-black transition-colors font-bold"
                  >
                    HARD REBOOT
                  </button>
                </div>
              ) : booting ? (
                <div className="flex flex-col gap-2">
                  <p className={`animate-pulse ${theme.text}`}>Booting SHARUK_OS v6.0...</p>
                  <p className="text-muted">Loading kernel modules...</p>
                  <p className="text-muted">Establishing secure connection...</p>
                </div>
              ) : (
                <>
                  {history.length === 0 && (
                    <div className="mb-6">
                      <pre className={`${theme.text} text-[6px] md:text-[10px] leading-none mb-4`}>{ASCII_LOGO}</pre>
                      <p className="text-white font-bold text-base">Welcome to SHARUK_OS.</p>
                      <p className="text-muted mt-1">
                        Type <span className={`${theme.text} font-bold bg-white/5 px-1`}>'help'</span> to see commands.
                      </p>
                    </div>
                  )}

                  {history.map((h, i) => (
                    <div key={i} className="mb-4">
                      <p className="flex gap-2 text-white">
                        <span className={theme.text}>➜</span> 
                        <span className="text-muted">root@sharuk</span>
                        <span className="text-blue-400">~</span>
                        <span>$ {h.cmd}</span>
                      </p>
                      <div className={`mt-1 pl-4 whitespace-pre-wrap ${h.isError ? "text-red-400" : theme.text}`}>
                        {h.output.map((line, j) => (
                          <p key={j}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {isHacking && (
                    <div className="mt-2 mb-4">
                      <p className="text-red-500 animate-pulse font-bold">Hacking... {hackProgress}%</p>
                      <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full ${theme.bg} transition-all duration-300`} 
                          style={{ width: `${hackProgress}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            {!isCrashing && (
              <div className="bg-black/80 border-t border-white/10 p-3 md:p-4 flex items-center gap-3 shrink-0 pb-safe relative z-20">
                <span className={`${theme.text} font-bold text-lg`}>$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white caret-emerald-400 text-base md:text-lg font-mono placeholder:text-muted/50"
                  placeholder="Type a command..."
                  autoComplete="off"
                  spellCheck="false"
                />
                <button 
                  onClick={executeCommand}
                  className={`${theme.bg} text-black px-4 py-2 md:px-6 md:py-3 rounded font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform hover:opacity-90`}
                >
                  RUN <ArrowRight size={16} />
                </button>
              </div>
            )}
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}