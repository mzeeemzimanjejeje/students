import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router as WouterRouter, Switch, Route, Link } from "wouter";

const queryClient = new QueryClient();

const GITHUB_REPO = "Courtney250/TRUTH-MD";

function useGitHubStats() {
  const [stats, setStats] = useState<{ stars: number | null; forks: number | null }>({ stars: null, forks: null });

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => r.json())
      .then((data) => {
        setStats({ stars: data.stargazers_count ?? null, forks: data.forks_count ?? null });
      })
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
  {
    q: "Is TRUTH MD free to use?",
    a: "Yes, TRUTH MD is free to use, but not open-source. However, its multi-session version has some premium functions.",
  },
  {
    q: "Does TRUTH MD violate WhatsApp's terms?",
    a: "While we've designed TRUTH MD to minimize policy violations, any automation of WhatsApp may conflict with their terms. We recommend using a secondary account and being mindful of usage patterns.",
  },
  {
    q: "What is the multi-session version?",
    a: "The multi-session version of TRUTH MD allows you to connect multiple WhatsApp accounts on the same bot instance.",
  },
  {
    q: "Where can I deploy TRUTH MD?",
    a: "You can deploy TRUTH MD on Heroku, Render, Replit, Railway, VPS, Koyeb, and many other platforms.",
  },
  {
    q: "How do I get support?",
    a: "Join our Telegram community for peer support. For enterprise needs, consider our premium support options.",
  },
  {
    q: "How do I update TRUTH MD?",
    a: "TRUTH MD automatically updates itself to the latest version whenever a new update is detected, regardless of deployment platform. You can also restart to trigger the update process.",
  },
];

const INSTALL_TABS = [
  { id: "windows", label: "Windows PowerShell" },
  { id: "vps", label: "VPS Setup" },
  { id: "termux", label: "Termux (Android)" },
  { id: "pm2", label: "PM2 Manager" },
];

const INSTALL_CONTENT: Record<string, { prereqs: string[]; title: string; code: string; notes?: { label: string; text: string }[] }> = {
  windows: {
    title: "Windows PowerShell Installation",
    prereqs: ["Windows 10/11", "PowerShell (Admin)", "Internet connection"],
    code: `# Update system
winget upgrade --all

# Install required software
winget install Git.Git
winget install Gyan.FFmpeg
winget install ImageMagick.ImageMagick
winget install OpenJS.NodeJS.LTS

# IMPORTANT: Restart PowerShell before proceeding

# Clone repository
git clone https://github.com/Courtney250/TRUTH-MD.git
cd TRUTH-MD

# Install dependencies
npm install

# Start bot
npm start`,
    notes: [
      { label: "Important", text: "You must restart PowerShell after installing Node.js before proceeding with the git clone step" },
    ],
  },
  vps: {
    title: "VPS Installation",
    prereqs: ["Ubuntu/Debian VPS", "SSH access", "Minimum 1GB RAM"],
    code: `sudo apt update && sudo apt upgrade -y
sudo apt install -y git imagemagick ffmpeg libwebp-dev
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
git clone https://github.com/Courtney250/TRUTH-MD.git
cd TRUTH-MD
npm install --build-from-source
npm start`,
  },
  termux: {
    title: "Termux Installation",
    prereqs: ["Termux (from F-Droid)", "Storage permission", "Stable power source"],
    code: `pkg update -y && pkg upgrade -y
pkg install -y git nodejs-lts python make clang libsqlite
termux-setup-storage
cd ~
git clone https://github.com/Courtney250/TRUTH-MD.git
cd TRUTH-MD
npm config set python python3
npm install --build-from-source
npm start`,
  },
  pm2: {
    title: "PM2 Process Manager",
    prereqs: ["Already installed bot", "Node.js environment", "Production server"],
    code: `npm install -g pm2
pm2 start index.js --name TRUTH-MD
pm2 save
pm2 startup
pm2 logs TRUTH-MD`,
    notes: [
      { label: "Stop Bot", text: "pm2 stop TRUTH-MD" },
      { label: "Restart Bot", text: "pm2 restart TRUTH-MD" },
      { label: "List Processes", text: "pm2 list" },
      { label: "Monitor", text: "pm2 monit" },
    ],
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{q}</span>
        <span className="text-slate-400 text-xl shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="pb-5 text-slate-600 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function SideNav({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const items = [
    { id: "hero", icon: "⌂" },
    { id: "hub", icon: "★" },
    { id: "deploy", icon: "🚀" },
    { id: "install", icon: "👑" },
  ];
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 bg-white rounded-3xl py-3 px-2 shadow-xl flex flex-col gap-2 z-50 hidden lg:flex">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            setActive(item.id);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${
            active === item.id
              ? "bg-indigo-500 text-white"
              : "text-slate-500 hover:bg-indigo-500 hover:text-white"
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8ecf8 0%, #dde4f0 30%, #e0e9f8 60%, #d8e4f5 100%)" }}
    >
      {/* Diagonal panel */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-30"
        style={{
          background: "linear-gradient(135deg, rgba(180,200,240,0.6) 0%, rgba(160,190,240,0.3) 100%)",
          clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-indigo-600 text-sm font-medium">
              <span className="text-base">🤖</span>
              Next-Gen Bot Platform
            </div>

            <h1
              className="text-5xl font-black tracking-tight text-indigo-600"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              TRUTH MD
            </h1>

            <p className="text-xl font-semibold text-slate-800">
              The Ultimate WhatsApp Bot Experience
            </p>

            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Deploy powerful TRUTH MD bots with advanced features, multi-session support, and high reliability.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
              <button
                onClick={() => document.getElementById("deploy")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
              >
                ⚡ Quick Deploy
              </button>
              <a
                href="https://github.com/Courtney250/TRUTH-MD/archive/refs/heads/main.zip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-200"
              >
                👑 Download Latest ZIP
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-2">
              <div>
                <p className="text-3xl font-black text-indigo-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>20K+</p>
                <p className="text-xs text-slate-500 mt-0.5">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-black text-indigo-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>300+</p>
                <p className="text-xs text-slate-500 mt-0.5">Features</p>
              </div>
              <div>
                <p className="text-3xl font-black text-indigo-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>99.9%</p>
                <p className="text-xs text-slate-500 mt-0.5">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right - Logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/logo.png"
                alt="TRUTH MD Bot"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useSiteStats() {
  const [stats, setStats] = useState<{ pair_clicks: number | null; page_views: number | null }>({ pair_clicks: null, page_views: null });

  const refresh = () => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats({ pair_clicks: data.pair_clicks ?? null, page_views: data.page_views ?? null }))
      .catch(() => {});
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

function HubSection() {
  const { stars, forks } = useGitHubStats();
  const { stats, refresh } = useSiteStats();

  return (
    <section id="hub" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Quick Access Hub
          </h2>
          <p className="text-slate-500">Everything you need to get started with TRUTH MD</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pair Code Servers */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">🔗</div>
              <h3 className="font-semibold text-slate-800">Pair Code Servers</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Generate session codes instantly</p>
            <div className="grid grid-cols-2 gap-2">
              {PAIR_SERVERS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="server-btn server-btn-lg text-center"
                  onClick={() => trackPairClick(refresh)}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <h3 className="font-semibold text-slate-800">QR Code Generator</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Scan to connect instantly</p>
            <div className="flex flex-wrap gap-2">
              {QR_SERVERS.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="server-btn">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Download */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://files.catbox.moe/evpvot.jpg" alt="TRUTH MD Logo" className="w-9 h-9 rounded-xl object-cover" />
              <h3 className="font-semibold text-slate-800">TRUTH MD Download</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Get the latest release</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://github.com/Courtney250/TRUTH-MD/archive/refs/heads/main.zip" target="_blank" rel="noopener noreferrer" className="server-btn" style={{ background: "#3b82f6", color: "white", borderColor: "#3b82f6" }}>
                Download Latest ZIP
              </a>
              <a href="https://github.com/Courtney250/TRUTH-MD" target="_blank" rel="noopener noreferrer" className="server-btn">
                GitHub Repo
              </a>
            </div>
          </div>

          {/* Analytics TRUTH MD */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="https://files.catbox.moe/evpvot.jpg" alt="TRUTH MD Logo" className="w-9 h-9 rounded-xl object-cover" />
                <h3 className="font-semibold text-slate-800">TRUTH MD Analytics</h3>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                [formatStat(stars), "GitHub Stars"],
                [formatStat(forks), "Forks"],
                ["99.8%", "Uptime"],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold text-indigo-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Multi-session */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <h3 className="font-semibold text-slate-800">Multi-Session Analytics</h3>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                [stats.page_views !== null ? formatStat(stats.page_views) : "—", "Site Visits"],
                [stats.pair_clicks !== null ? formatStat(stats.pair_clicks) : "—", "Pair Attempts"],
                ["99.5%", "Uptime"],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold text-indigo-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{val}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-session Download */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <h3 className="font-semibold text-slate-800">Multi-Session Download</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Multi-session bot platform</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://github.com/Courtney250/TRUTH-MD/archive/refs/heads/main.zip" target="_blank" rel="noopener noreferrer" className="server-btn" style={{ background: "#3b82f6", color: "white", borderColor: "#3b82f6" }}>
                Download Latest ZIP
              </a>
              <a href="https://github.com/Courtney250/TRUTH-MD" target="_blank" rel="noopener noreferrer" className="server-btn">
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const HEROKU_DEPLOY_URL = "https://heroku.com/deploy?template=https://github.com/Courtney250/TRUTH-MD";

function DeploySection() {
  const otherPlatforms = [
    { name: "Replit", desc: "Online IDE deployment", logo: "https://avatars.githubusercontent.com/u/983194?s=64&v=4", url: "https://repl.it/github/Courtney250/TRUTH-MD", status: "Run on Replit" },
    { name: "Render", desc: "Cloud hosting platform", logo: "https://avatars.githubusercontent.com/u/36424661?s=64&v=4", url: "https://render.com/deploy?repo=https://github.com/Courtney250/TRUTH-MD", status: "Deploy Now" },
    { name: "Railway", desc: "Modern deployment platform", logo: "https://avatars.githubusercontent.com/u/66716858?s=64&v=4", url: "https://railway.app/new/template?template=https://github.com/Courtney250/TRUTH-MD", status: "Deploy Now" },
  ];

  return (
    <section id="deploy" className="py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            One-Click Deployment
          </h2>
          <p className="text-slate-500">Deploy your bots instantly on your preferred platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {["TRUTH MD Deployment", "Multi-Session Deployment"].map((title) => (
            <div key={title}>
              <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">{title}</h3>
              <div className="space-y-3">

                {/* Heroku */}
                <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <img src="https://avatars.githubusercontent.com/u/23211?s=64&v=4" alt="Heroku" className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-100 p-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Heroku</p>
                      <p className="text-xs text-slate-500">Cloud platform deployment</p>
                    </div>
                  </div>
                  <Link
                    href="/deploy"
                    className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Deploy Now
                  </Link>
                </div>

                {otherPlatforms.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {"logo" in p
                        ? <img src={p.logo} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-100 p-0.5" />
                        : <span className="text-2xl">{p.icon}</span>
                      }
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.desc}</p>
                      </div>
                    </div>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        {p.status}
                      </a>
                    ) : (
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed">
                        {p.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
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
    <section id="install" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Installation Guide
          </h2>
          <p className="text-slate-500">Choose your preferred installation method</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl mb-8 w-fit mx-auto">
          {INSTALL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg mb-3">{content.title}</h3>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Prerequisites</p>
              <ul className="flex flex-wrap gap-2">
                {content.prereqs.map((p) => (
                  <li key={p} className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Commands</p>
              <CopyButton text={content.code} />
            </div>
            <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre">{content.code}</pre>
            </div>

            {content.notes && (
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {content.notes.map((note) => (
                  <div key={note.label} className="bg-amber-50 border border-amber-100 rounded-xl p-4">
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
    <section className="py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%)" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500">Everything you need to know about TRUTH MD</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-800 leading-relaxed">
          <p className="font-bold mb-2">⚠️ Important Notice</p>
          <p>
            TRUTH MD is offered <strong>strictly for personal and educational use only</strong>. The developers do not promote misuse, automation abuse, or violation of any platform's terms of service.
          </p>
          <p className="mt-2">
            <strong>Use at your own risk.</strong> We are not responsible for any actions taken against your account.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 px-6 text-center text-sm">
      <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TRUTH MD</p>
      <p className="mb-4">The Ultimate WhatsApp Bot Experience</p>
      <p className="text-slate-600 text-xs">© {new Date().getFullYear()} TRUTH MD. For personal &amp; educational use only.</p>
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

      // Check fork exists
      const forkRes = await fetch(`https://api.github.com/repos/${user}/TRUTH-MD`);
      if (forkRes.status === 404) { setStatus("notfound"); return; }
      if (!forkRes.ok) { setStatus("error"); return; }

      // Compare latest commit of fork vs upstream
      const [upstreamRes, forkCommitRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`),
        fetch(`https://api.github.com/repos/${user}/TRUTH-MD/commits?per_page=1`),
      ]);

      if (!upstreamRes.ok || !forkCommitRes.ok) { setStatus("found"); return; }

      const [upstreamCommits, forkCommits] = await Promise.all([
        upstreamRes.json(),
        forkCommitRes.json(),
      ]);

      const upstreamSha = upstreamCommits[0]?.sha;
      const forkSha = forkCommits[0]?.sha;

      if (upstreamSha && forkSha && upstreamSha !== forkSha) {
        setStatus("outofdate");
      } else {
        setStatus("found");
      }
    } catch {
      setStatus("error");
    }
  };

  const herokuUrl = `https://heroku.com/deploy?template=https://github.com/${GITHUB_REPO}`;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e2a3a 50%, #0f172a 100%)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1e2a3a, #172035)",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
        }}
      >
        {/* Glow accent top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
        />

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
          >
            🚀
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Deploy TRUTH MD
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Deploy your WhatsApp bot to Heroku with one click
          </p>
        </div>

        {/* Important notice */}
        <div
          className="rounded-xl p-4 mb-6 text-sm leading-relaxed"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <span className="text-amber-400 font-semibold">Important: </span>
          <span className="text-slate-300">
            Make sure you have forked{" "}
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              TRUTH-MD
            </a>{" "}
            to your GitHub account before deploying.
          </span>
        </div>

        {/* GitHub Username input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            GitHub Username
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "#272e3f", border: "1px solid #3f4555" }}
          >
            <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && checkFork()}
              placeholder="Enter your GitHub username"
              className="bg-transparent flex-1 text-white placeholder-slate-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Status message */}
        {status === "checking" && (
          <p className="text-indigo-400 text-xs mb-4 flex items-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            Checking repository...
          </p>
        )}
        {status === "found" && (
          <p className="text-green-400 text-xs mb-4 flex items-center gap-2">
            ✓ Fork confirmed — you're good to deploy!
          </p>
        )}
        {status === "notfound" && (
          <div className="mb-4">
            <p className="text-red-400 text-xs mb-2">
              ✗ No fork found for <strong>{username}</strong>. Please fork the repo first.
            </p>
            <a
              href={`https://github.com/${GITHUB_REPO}/fork`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              Fork TRUTH-MD on GitHub →
            </a>
          </div>
        )}
        {status === "outofdate" && (
          <div className="mb-4 rounded-xl p-4" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <p className="text-amber-400 text-xs font-semibold mb-1">⚠ Your fork is out of date</p>
            <p className="text-slate-400 text-xs mb-3">
              Sync your fork with the latest TRUTH MD updates before deploying to get the newest features.
            </p>
            <a
              href={`https://github.com/${username.trim()}/TRUTH-MD`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
            >
              Sync fork on GitHub →
            </a>
          </div>
        )}
        {status === "error" && (
          <p className="text-amber-400 text-xs mb-4">
            ⚠ Could not verify — check your username and try again.
          </p>
        )}

        {/* Deploy button */}
        {status === "found" ? (
          <a
            href={herokuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center"
          >
            <img
              src="https://www.herokucdn.com/deploy/button.svg"
              alt="Deploy to Heroku"
              className="h-10"
            />
          </a>
        ) : (
          <button
            onClick={checkFork}
            disabled={!username.trim() || status === "checking"}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
          >
            {status === "checking" ? "Checking…" : "Check & Deploy to Heroku"}
          </button>
        )}

        {/* Back to Home */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [activeSection, setActiveSection] = useState("hero");
  return (
    <div className="relative">
      <SideNav active={activeSection} setActive={setActiveSection} />
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
        <Switch>
          <Route path="/deploy" component={DeployPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
