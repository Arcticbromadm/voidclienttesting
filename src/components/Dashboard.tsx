import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, 
  Download, 
  Terminal, 
  Key, 
  User, 
  Check, 
  ShieldAlert, 
  AlertCircle 
} from "lucide-react";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export default function Dashboard({ username, onLogout }: DashboardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseStatus, setLicenseStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [injectionLogs, setInjectionLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"client" | "license" | "logs">("client");
  
  const consoleBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInjectionLogs([
      `[void-auth] Connected securely from client terminal.`,
      `[void-auth] Handshake: TLS_AES_256_GCM_SHA384 active.`,
      `[void-auth] Fetching manifest mapping parameters...`,
      `[void-auth] User session verified: ${username.toUpperCase()}`,
      `[void-auth] HWID hash validation: matched cached signature.`,
      `[void-auth] Ready for client loader initialization.`
    ]);
  }, [username]);

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [injectionLogs]);

  const triggerDownload = () => {
    if (downloading || downloadCompleted) return;
    setDownloading(true);
    setDownloadProgress(0);
    
    setInjectionLogs(prev => [
      ...prev,
      `[loader] Requesting loader ZIP file build payload...`,
      `[loader] Connection opened port 443 -> voidclient.lol/dist/loader`
    ]);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadCompleted(true);
          setInjectionLogs(prevLogs => [
            ...prevLogs,
            `[loader] Package download successful!`,
            `[loader] MD5 Hash check: e4d909c290d2358bc753447385fb575a - Verified.`,
            `[loader] Instruction: Extract voidclient.exe and run with Administrator capabilities.`
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleApplyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseStatus({ type: null, msg: "" });
    
    if (!licenseKey.trim()) {
      setLicenseStatus({ type: "error", msg: "Please insert a non-empty license key first." });
      return;
    }

    if (licenseKey.length < 12) {
      setLicenseStatus({ type: "error", msg: "Invalid license formatting. Must be at least 12 characters." });
      return;
    }

    setLicenseStatus({ type: "success", msg: `Key successfully redeemed! Subscription lifetime unlocked for user ${username}.` });
    setLicenseKey("");
    
    setInjectionLogs(prev => [
      ...prev,
      `[licensing] Redeeming certificate key: ${licenseKey.substring(0, 5)}****************`,
      `[licensing] Server response: SUCCESS. Lifetime access attached to account.`
    ]);
  };

  const clearInjectionsLogs = () => {
    setInjectionLogs([
      `[void-auth] Console log cleared.`,
      `[void-auth] Handshake active.`
    ]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-zinc-950/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-[400px] h-[400px] bg-zinc-900/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono tracking-widest uppercase mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure connection active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight">
            Dashboard Panel
          </h1>
          <p className="text-zinc-550 text-xs sm:text-sm mt-1">
            Welcome, active operative <span className="text-white font-mono font-semibold">{username}</span>. Manage systems and loader updates.
          </p>
        </div>

        <button 
          onClick={onLogout}
          className="self-start md:self-auto inline-flex items-center gap-2 text-xs border border-zinc-900 bg-[#060608] hover:bg-zinc-950 hover:border-zinc-800 text-zinc-400 hover:text-white rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95"
        >
          <LogOut className="w-4 h-4 text-zinc-650" />
          Disconnect Panel
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-6">
            <h2 className="text-xs font-mono tracking-wider text-zinc-500 uppercase mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Account Details
            </h2>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center py-2.5 border-b border-zinc-900/60">
                <span className="text-zinc-550">Username</span>
                <span className="text-zinc-200">{username}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-zinc-900/60">
                <span className="text-zinc-550">Subscription Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                  <Check className="w-3 h-3" /> Active Lifetime
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-zinc-900/60">
                <span className="text-zinc-550">Node Version</span>
                <span className="text-zinc-400">v4.1.20-premium</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-zinc-550">Unique HWID</span>
                <span className="text-zinc-450 text-[10px]">8F9E-3D2A-0B4C-1E5F</span>
              </div>
            </div>
          </div>

          <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-4 space-y-1">
            <button
              onClick={() => setActiveTab("client")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center justify-between transition-colors ${
                activeTab === "client" 
                  ? "bg-white text-black font-semibold" 
                  : "text-zinc-450 hover:text-white hover:bg-zinc-950"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Download className="w-4 h-4" /> Downloads & Loader
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-zinc-900 font-semibold">Ready</span>
            </button>

            <button
              onClick={() => setActiveTab("license")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center justify-between transition-colors ${
                activeTab === "license" 
                  ? "bg-white text-black font-semibold" 
                  : "text-zinc-450 hover:text-white hover:bg-zinc-950"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Key className="w-4 h-4" /> License Activation
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-zinc-900 font-semibold">Active</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center justify-between transition-colors ${
                activeTab === "logs" 
                  ? "bg-white text-black font-semibold" 
                  : "text-zinc-450 hover:text-white hover:bg-zinc-950"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4" /> Live Injection Logs
              </span>
              <span className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold">Stream</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#050507] border border-zinc-900 rounded-2xl p-8 min-h-[460px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === "client" && (
              <motion.div
                key="client-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 pb-1.5 mb-4 border-b border-zinc-900/60">
                    <Download className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-base font-sans font-medium text-white">Client Executable Package</h3>
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    Download the compiled loader tool. Launch the binary tool with Administrator privileges prior to booting up your gaming client workspace for automatic kernel mapping overlay injections.
                  </p>

                  <div className="bg-amber-950/15 border border-amber-900/30 rounded-xl p-4 mb-6 text-xs text-amber-300 flex gap-3">
                    <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block font-mono uppercase text-[10px] mb-0.5">Disclaimer notice:</span>
                      Keep Defender or any third-party real-time scanning tools paused during injection routines to bypass aggressive low-level heuristics triggers.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {downloading && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>Payload Download Stream</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 border border-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-100 ease-out" 
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {downloadCompleted && (
                    <div className="bg-emerald-950/10 border border-emerald-900/35 rounded-xl p-4 mb-2 text-xs text-emerald-400 flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Package voidclient_loader.zip downloaded successfully! Check download folder.</span>
                    </div>
                  )}

                  <button
                    onClick={triggerDownload}
                    disabled={downloading || downloadCompleted}
                    className={`w-full py-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all ${
                      downloadCompleted 
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-650 cursor-default"
                        : "bg-white hover:bg-zinc-250 text-black active:scale-[0.98]"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? `Downloading Payload (${downloadProgress}%)` : downloadCompleted ? "Download Complete" : "Download Void Client Tool"}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "license" && (
              <motion.div
                key="license-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 pb-1.5 mb-4 border-b border-zinc-900/60">
                    <Key className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-base font-sans font-medium text-white">Redeem Licensing Plan</h3>
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    Activate high-grade billing subscription sequences or redeem keys distributed via our secure ticketing dispatch channels.
                  </p>

                  <form onSubmit={handleApplyLicense} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider font-semibold text-zinc-500 uppercase mb-2">
                        License Certificate Key
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#0a0a0d] border border-zinc-900 focus:border-zinc-750 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-700 outline-none transition-colors duration-200 font-mono"
                        placeholder="VOID-XXXX-XXXX-XXXX-XXXX"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                      />
                    </div>

                    {licenseStatus.type && (
                      <div className={`p-4 rounded-xl border text-xs flex gap-3 ${
                        licenseStatus.type === "success" 
                          ? "border-emerald-900/30 bg-emerald-950/20 text-emerald-400" 
                          : "border-rose-900/30 bg-rose-950/20 text-rose-400"
                      }`}>
                        {licenseStatus.type === "success" ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                        <p>{licenseStatus.msg}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-white hover:bg-zinc-250 active:scale-[0.98] text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
                    >
                      Redeem License Verification
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === "logs" && (
              <motion.div
                key="logs-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1.5 mb-4 border-b border-zinc-900/60">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-zinc-400" />
                      <h3 className="text-base font-sans font-medium text-white">Stream Kernel Injection Logs</h3>
                    </div>
                    <button 
                      onClick={clearInjectionsLogs}
                      className="text-[10px] font-mono text-zinc-550 hover:text-zinc-300 uppercase transition-colors"
                    >
                      Clear Log
                    </button>
                  </div>

                  <div className="h-64 bg-[#030304] border border-zinc-900 rounded-xl p-4 font-mono text-[11px] text-zinc-400 overflow-y-auto space-y-1.5 shadow-inner">
                    {injectionLogs.map((log, i) => {
                      let colorClass = "text-zinc-400";
                      if (log.includes("[void-auth]")) colorClass = "text-sky-400";
                      else if (log.includes("[loader]")) colorClass = "text-amber-400";
                      else if (log.includes("[licensing]")) colorClass = "text-emerald-400";
                      
                      return (
                        <div key={i} className="flex gap-2">
                          <span className="text-zinc-650 text-[10px]">[{new Date().toLocaleTimeString()}]</span>
                          <span className={colorClass}>{log}</span>
                        </div>
                      );
                    })}
                    <div ref={consoleBottomRef} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
