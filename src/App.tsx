import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router as WouterRouter, Switch, Route, Link, useLocation } from "wouter";

const queryClient = new QueryClient();

const GITHUB_REPO = "Courtney250/TRUTH-MD";

function AnimatedBackground() {
  return (
    <div className="blob-wrap">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
    </div>
  );
}

function useGitHubStats() {
  const [stats, setStats] = useState<{ stars: number | null; forks: number | null }>({ stars: null, forks: null });
  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => r.json())
      .then((data) => setStats({ stars: data.stargazers_count ?? null, forks: data.forks_count ?? null }))
      .catch(() => {});
  }, []);
  return stats;
}

function formatStat(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

const PAIR_SERVERS = [
  { label: "Server 1", url: "https://truth-md.courtneytech.xyz/" },
  { label: "Server 2", url: "https://pairxx2-d40fab925d95.herokuapp.com/" },
  { label: "Server 3", url: "https://web-production-733d8.up.railway.app/" },
  { label: "Server 4", url: "https://pairxx4-5738bb8ab79b.herokuapp.com/" },
];

const QR_SERVERS = [
  { label: "QR Server 1", url: "https://qrxx-cdea8408c65b.herokuapp.com/" },
  { label: "QR Server 2", url: "https://qrxx1-7a8480e8db1d.herokuapp.com/" },
];

const FAQS = [
  { q: "Is TRUTH MD free to use?", a: "Yes, TRUTH MD is free to use, but not open-source. However, its multi-session version has some premium functions." },
  { q: "Does TRUTH MD violate WhatsApp's terms?", a: "While we've designed TRUTH MD to minimize policy violations, any automation of WhatsApp may conflict with their terms. We recommend using a secondary account and being mindful of usage patterns." },
  { q: "What is the multi-session version?", a: "The multi-session version of TRUTH MD allows you to connect multiple WhatsApp accounts on the same bot instance." },
  { q: "Where can I deploy TRUTH MD?", a: "You can deploy TRUTH MD on Heroku, Render, Replit, Railway, VPS, Koyeb, and many other platforms." },
  { q: "How do I get support?", a: "Join our Telegram community for peer support. For enterprise needs, consider our premium support options." },
  { q: "How do I update TRUTH MD?", a: "TRUTH MD automatically updates itself to the latest version whenever a new update is detected, regardless of deployment platform." },
];

const INSTALL_TABS = [
  { id: "windows", label: "Windows" },
  { id: "vps", label: "VPS" },
  { id: "termux", label: "Termux" },
  { id: "pm2", label: "PM2" },
];

const INSTALL_CONTENT: Record<string, { prereqs: string[]; title: string; code: string; notes?: { label: string; text: string }[] }> = {
  windows: {
    title: "Windows PowerShell Installation",
    prereqs: ["Windows 10/11", "PowerShell (Admin)", "Internet connection"],
    code: `# Update system\nwinget upgrade --all\n\n# Install required software\nwinget install Git.Git\nwinget install Gyan.FFmpeg\nwinget install ImageMagick.ImageMagick\nwinget install OpenJS.NodeJS.LTS\n\n# IMPORTANT: Restart PowerShell before proceeding\n\n# Clone repository\ngit clone https://github.com/Courtney250/TRUTH-MD.git\ncd TRUTH-MD\n\n# Install dependencies\nnpm install\n\n# Start bot\nnpm start`,
    notes: [{ label: "Important", text: "Restart PowerShell after installing Node.js before the git clone step" }],
  },
  vps: {
    title: "VPS Installation",
    prereqs: ["Ubuntu/Debian VPS", "SSH access", "Minimum 1GB RAM"],
    code: `sudo apt update && sudo apt upgrade -y\nsudo apt install -y git imagemagick ffmpeg libwebp-dev\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash\nsource ~/.bashrc\nnvm install 20\nnvm use 20\ngit clone https://github.com/Courtney250/TRUTH-MD.git\ncd TRUTH-MD\nnpm install --build-from-source\nnpm start`,
  },
  termux: {
    title: "Termux Installation",
    prereqs: ["Termux (from F-Droid)", "Storage permission", "Stable power source"],
    code: `pkg update -y && pkg upgrade -y\npkg install -y git nodejs-lts python make clang libsqlite\ntermux-setup-storage\ncd ~\ngit clone https://github.com/Courtney250/TRUTH-MD.git\ncd TRUTH-MD\nnpm config set python python3\nnpm install --build-from-source\nnpm start`,
  },
  pm2: {
    title: "PM2 Process Manager",
    prereqs: ["Already installed bot", "Node.js environment", "Production server"],
    code: `npm install -g pm2\npm2 start index.js --name TRUTH-MD\npm2 save\npm2 startup\npm2 logs TRUTH-MD`,
    notes: [
      { label: "Stop Bot", text: "pm2 stop TRUTH-MD" },
      { label: "Restart Bot", text: "pm2 restart TRUTH-MD" },
      { label: "Monitor", text: "pm2 monit" },
    ],
  },
};


function LiveBadge() {
  return (
    <span
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
      style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
      LIVE
    </span>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="text-indigo-400 w-5 flex items-center justify-center shrink-0">{icon}</span>
      <span className="flex-1 text-slate-600 text-sm">{label}</span>
      <span className="font-bold text-indigo-600 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
    >
      {copied ? "Copied!" : "Copy All"}
    </button>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4 group">
        <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{q}</span>
        <span className="text-slate-400 text-xl shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="pb-5 text-slate-600 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

function BottomNav() {
  const [location] = useLocation();
  const [active, setActive] = useState("home");

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const items = [
    {
      id: "home", label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      id: "hub", label: "Hub",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      id: "deploy", label: "Deploy",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8l7 4-7 4z" />
        </svg>
      ),
    },
    {
      id: "install", label: "Install",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
      ),
    },
  ];

  if (location !== "/") return null;

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-8">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "rgba(22, 18, 38, 0.92)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex items-center justify-center transition-all"
          >
            <span
              className={`p-3 rounded-full transition-all ${
                active === item.id
                  ? "text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={active === item.id ? { background: "linear-gradient(135deg, #7c3aed, #6366f1)" } : {}}
            >
              {item.icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function useSiteStats() {
  const [stats, setStats] = useState<{ pair_clicks: number | null; page_views: number | null }>({ pair_clicks: null, page_views: null });
  const refresh = () => {
    fetch("/api/stats").then((r) => r.json()).then((data) => setStats({ pair_clicks: data.pair_clicks ?? null, page_views: data.page_views ?? null })).catch(() => {});
  };
  useEffect(() => {
    refresh();
    fetch("/api/stats/page-view", { method: "POST" }).then(() => refresh()).catch(() => {});
  }, []);
  return { stats, refresh };
}

function trackPairClick(refresh: () => void) {
  fetch("/api/stats/pair-click", { method: "POST" }).then(() => refresh()).catch(() => {});
}

function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-6 text-center space-y-6">

        <h1
          className="text-5xl font-black tracking-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #22d3ee 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          TRUTH MD
        </h1>

        <p className="text-2xl font-bold text-slate-800 leading-snug max-w-xs mx-auto">
          The Ultimate WhatsApp Bot Experience
        </p>

        <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto">
          Deploy powerful TRUTH MD bots with advanced features, multi-session support, and high reliability.
        </p>

        {/* Stacked full-width pill buttons */}
        <div className="w-full max-w-xs space-y-3 pt-2">
          <button
            onClick={() => document.getElementById("deploy")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-indigo-300"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Quick Deploy
          </button>
          <button
            onClick={() => document.getElementById("install")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #5b21b6, #4f46e5)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Manual Install
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 pt-2">
          {[["30K+", "Active Users"], ["340K+", "Features"], ["99.9%", "Uptime"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <p
                className="text-3xl font-black"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >{val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Large logo image pinned at the bottom, partially behind bottom nav */}
      <div className="w-full px-4 pb-0">
        <div className="rounded-3xl overflow-hidden w-full" style={{ maxHeight: "260px", background: "#0f0f1a" }}>
          <img
            src="https://files.catbox.moe/evpvot.jpg"
            alt="TRUTH MD"
            className="w-full object-cover object-center"
            style={{ height: "260px" }}
          />
        </div>
      </div>
    </section>
  );
}

function HubSection() {
  const { stars, forks } = useGitHubStats();
  const { stats, refresh } = useSiteStats();

  return (
    <section id="hub" className="py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Quick Access Hub
        </h2>

        {/* Pair Code Servers */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg">🔗</div>
              <h3 className="font-bold text-slate-800">Pair Code Servers</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">Generate session codes instantly</p>
          <div className="grid grid-cols-2 gap-3">
            {PAIR_SERVERS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPairClick(refresh)}
                className="flex items-center justify-center py-3 rounded-2xl font-semibold text-sm text-indigo-700 transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.2)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3.5" y="3.5" width="3" height="3" fill="currentColor"/>
                <rect x="13" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="15.5" y="3.5" width="3" height="3" fill="currentColor"/>
                <rect x="1" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3.5" y="15.5" width="3" height="3" fill="currentColor"/>
                <rect x="13" y="13" width="2.5" height="2.5" fill="currentColor"/>
                <rect x="16.5" y="13" width="2.5" height="2.5" fill="currentColor"/>
                <rect x="13" y="16.5" width="2.5" height="2.5" fill="currentColor"/>
                <rect x="16.5" y="16.5" width="2.5" height="2.5" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="font-bold text-slate-800">QR Code Generator</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {QR_SERVERS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center px-5 py-2.5 rounded-2xl font-semibold text-sm text-indigo-700 transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.2)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* TRUTH MD Analytics */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img src="https://files.catbox.moe/evpvot.jpg" alt="TRUTH MD" className="w-10 h-10 rounded-2xl object-cover" />
              <h3 className="font-bold text-slate-800">TRUTH MD Analytics</h3>
            </div>
            <LiveBadge />
          </div>
          <StatRow icon={<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>} label="GitHub Stars" value={formatStat(stars)} />
          <StatRow icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M7 5C7 3.346 8.346 2 10 2s3 1.346 3 3-1.346 3-3 3-3-1.346-3-3zM17 2c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM7 19c0-1.654 1.346-3 3-3s3 1.346 3 3-1.346 3-3 3-3-1.346-3-3zM10 14c-1.87 0-3.526.902-4.576 2.28A4.978 4.978 0 0 1 4 14c0-2.206 1.794-4 4-4 .622 0 1.202.157 1.73.417A5.009 5.009 0 0 0 10 14zm7-4c.622 0 1.202.157 1.73.417A5.009 5.009 0 0 0 17 14c0-.695-.129-1.357-.356-1.97A4.987 4.987 0 0 1 18 14a4.978 4.978 0 0 1-1.424 2.28C15.526 14.902 13.87 14 12 14a5.009 5.009 0 0 0-1.73.417C10.202 13.157 9.622 13 9 13c0 0 .378-3 4-3z"/></svg>} label="Forks" value={formatStat(forks)} />
          <StatRow icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>} label="Uptime" value="99.8%" />
        </div>

        {/* Multi-Session Analytics */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="3.5" y="3.5" width="3" height="3" fill="currentColor"/>
                  <rect x="13" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="15.5" y="3.5" width="3" height="3" fill="currentColor"/>
                  <rect x="1" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="3.5" y="15.5" width="3" height="3" fill="currentColor"/>
                  <rect x="13" y="13" width="2.5" height="2.5" fill="currentColor"/>
                  <rect x="16.5" y="13" width="2.5" height="2.5" fill="currentColor"/>
                  <rect x="13" y="16.5" width="2.5" height="2.5" fill="currentColor"/>
                  <rect x="16.5" y="16.5" width="2.5" height="2.5" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="font-bold text-slate-800">Multi-Session Analytics</h3>
            </div>
            <LiveBadge />
          </div>
          <StatRow icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>} label="Site Visits" value={stats.page_views !== null ? formatStat(stats.page_views) : "—"} />
          <StatRow icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>} label="Pair Attempts" value={stats.pair_clicks !== null ? formatStat(stats.pair_clicks) : "—"} />
          <StatRow icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>} label="Uptime" value="99.5%" />
        </div>

        {/* Download */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <img src="https://files.catbox.moe/evpvot.jpg" alt="TRUTH MD" className="w-10 h-10 rounded-2xl object-cover" />
            <h3 className="font-bold text-slate-800">Download TRUTH MD</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/Courtney250/TRUTH-MD/archive/refs/heads/main.zip" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              👑 Download Latest ZIP
            </a>
            <a href="https://github.com/Courtney250/TRUTH-MD" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm text-indigo-700 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.2)" }}
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeploySection() {
  const platforms = [
    {
      name: "Heroku",
      desc: "Cloud platform",
      logo: "https://avatars.githubusercontent.com/u/23211?s=64&v=4",
      color: "#430098",
      isInternal: true,
    },
    {
      name: "Replit",
      desc: "Online IDE",
      logo: "https://avatars.githubusercontent.com/u/983194?s=64&v=4",
      color: "#F26207",
      url: "https://repl.it/github/Courtney250/TRUTH-MD",
    },
    {
      name: "Render",
      desc: "Cloud hosting",
      logo: "https://avatars.githubusercontent.com/u/36424661?s=64&v=4",
      color: "#46E3B7",
      url: "https://render.com/deploy?repo=https://github.com/Courtney250/TRUTH-MD",
    },
    {
      name: "Railway",
      desc: "Modern platform",
      logo: "https://avatars.githubusercontent.com/u/66716858?s=64&v=4",
      color: "#0B0D0E",
      url: "https://railway.app/new/template?template=https://github.com/Courtney250/TRUTH-MD",
    },
  ];

  return (
    <section id="deploy" className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          One-Click Deployment
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center gap-3"
            >
              {/* Logo circle */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md overflow-hidden"
                style={{ background: p.color + "18", border: "1.5px solid " + p.color + "30" }}
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="w-10 h-10 object-contain rounded-xl"
                />
              </div>

              {/* Info */}
              <div>
                <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
              </div>

              {/* Button */}
              {p.isInternal ? (
                <Link
                  href="/deploy"
                  className="w-full flex items-center justify-center py-2.5 rounded-2xl text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
                >
                  Deploy
                </Link>
              ) : (
                <a
                  href={(p as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center py-2.5 rounded-2xl text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
                >
                  Deploy
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstallSection() {
  const [activeTab, setActiveTab] = useState("windows");
  const content = INSTALL_CONTENT[activeTab];

  return (
    <section id="install" className="py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Installation Guide
        </h2>

        <div className="flex flex-wrap gap-2 justify-center">
          {INSTALL_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === tab.id ? "text-white shadow-md shadow-indigo-200" : "text-slate-500 bg-white hover:text-indigo-600"}`}
              style={activeTab === tab.id ? { background: "linear-gradient(135deg, #6366f1, #818cf8)" } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3">{content.title}</h3>
            <div className="flex flex-wrap gap-2">
              {content.prereqs.map((p) => (
                <span key={p} className="text-xs px-3 py-1 rounded-full text-indigo-600 font-medium" style={{ background: "rgba(99,102,241,0.1)" }}>{p}</span>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Commands</p>
              <CopyButton text={content.code} />
            </div>
            <div className="bg-slate-900 rounded-2xl p-5 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre">{content.code}</pre>
            </div>
            {content.notes && (
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {content.notes.map((note) => (
                  <div key={note.label} className="rounded-2xl p-4" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <p className="text-xs font-bold text-amber-700 mb-1">{note.label}</p>
                    <p className="text-xs text-amber-600">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-3xl px-6 shadow-sm mb-4">
          {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
        <div className="rounded-3xl p-5 text-sm text-amber-800 leading-relaxed" style={{ background: "rgba(251,191,36,0.1)", border: "1.5px solid rgba(251,191,36,0.25)" }}>
          <p className="font-bold mb-1">⚠️ Important Notice</p>
          <p>TRUTH MD is offered <strong>strictly for personal and educational use only</strong>. Use at your own risk.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-6 text-center text-sm text-slate-400 pb-28">
      <p className="font-bold text-slate-700 text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TRUTH MD</p>
      <p className="mb-2">The Ultimate WhatsApp Bot Experience</p>
      <p className="text-slate-400 text-xs">© {new Date().getFullYear()} TRUTH MD. For personal &amp; educational use only.</p>
    </footer>
  );
}

type ForkStatus = "idle" | "checking" | "found" | "notfound" | "outofdate" | "error";

function DeployPage() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<ForkStatus>("idle");

  const checkFork = async () => {
    if (!username.trim()) return;
    setStatus("checking");
    try {
      const user = username.trim();
      const forkRes = await fetch(`https://api.github.com/repos/${user}/TRUTH-MD`);
      if (forkRes.status === 404) { setStatus("notfound"); return; }
      if (!forkRes.ok) { setStatus("error"); return; }
      const [upstreamRes, forkCommitRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`),
        fetch(`https://api.github.com/repos/${user}/TRUTH-MD/commits?per_page=1`),
      ]);
      if (!upstreamRes.ok || !forkCommitRes.ok) { setStatus("found"); return; }
      const [upstreamCommits, forkCommits] = await Promise.all([upstreamRes.json(), forkCommitRes.json()]);
      const upstreamSha = upstreamCommits[0]?.sha;
      const forkSha = forkCommits[0]?.sha;
      setStatus(upstreamSha && forkSha && upstreamSha !== forkSha ? "outofdate" : "found");
    } catch {
      setStatus("error");
    }
  };

  const herokuUrl = `https://heroku.com/deploy?template=https://github.com/${GITHUB_REPO}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e2a3a 50%, #0f172a 100%)" }}
    >
      <div className="w-full max-w-md rounded-3xl p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1e2a3a, #172035)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
        />
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>🚀</div>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Deploy TRUTH MD</h1>
          <p className="text-slate-400 text-sm">Deploy your WhatsApp bot to Heroku with one click</p>
        </div>
        <div className="rounded-2xl p-4 mb-6 text-sm leading-relaxed"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <span className="text-amber-400 font-semibold">Important: </span>
          <span className="text-slate-300">Make sure you have forked{" "}
            <a href={`https://github.com/${GITHUB_REPO}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">TRUTH-MD</a>
            {" "}to your GitHub account before deploying.</span>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">GitHub Username</label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "#272e3f", border: "1px solid #3f4555" }}>
            <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && checkFork()}
              placeholder="Enter your GitHub username"
              className="bg-transparent flex-1 text-white placeholder-slate-500 outline-none text-sm"
            />
          </div>
        </div>
        {status === "checking" && <p className="text-indigo-400 text-xs mb-4 flex items-center gap-2"><span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />Checking repository...</p>}
        {status === "found" && <p className="text-green-400 text-xs mb-4">✓ Fork confirmed — you're good to deploy!</p>}
        {status === "notfound" && (
          <div className="mb-4">
            <p className="text-red-400 text-xs mb-2">✗ No fork found for <strong>{username}</strong>. Please fork the repo first.</p>
            <a href={`https://github.com/${GITHUB_REPO}/fork`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl text-white font-medium"
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}
            >Fork TRUTH-MD on GitHub →</a>
          </div>
        )}
        {status === "outofdate" && (
          <div className="mb-4 rounded-2xl p-4" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <p className="text-amber-400 text-xs font-semibold mb-1">⚠ Your fork is out of date</p>
            <p className="text-slate-400 text-xs mb-3">Sync your fork before deploying to get the newest features.</p>
            <a href={`https://github.com/${username.trim()}/TRUTH-MD`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl text-white font-medium"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
            >Sync fork on GitHub →</a>
          </div>
        )}
        {status === "error" && <p className="text-amber-400 text-xs mb-4">⚠ Could not verify — check your username and try again.</p>}
        {status === "found" ? (
          <a href={herokuUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center">
            <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku" className="h-10" />
          </a>
        ) : (
          <button onClick={checkFork} disabled={!username.trim() || status === "checking"}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
          >
            {status === "checking" ? "Checking…" : "Check & Deploy to Heroku"}
          </button>
        )}
        <div className="text-center mt-5">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HubSection />
      <DeploySection />
      <InstallSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AnimatedBackground />
        <BottomNav />
        <Switch>
          <Route path="/deploy" component={DeployPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
