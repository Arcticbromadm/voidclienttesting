import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Lock, 
  User, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Check
} from "lucide-react";

interface AuthPageProps {
  onBack: () => void;
  onLoginSuccess: (username: string) => void;
  initialMode?: "login" | "register";
}

export default function AuthPage({ onBack, onLoginSuccess, initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (password.length > 0) {
      setShowPasswordRequirements(true);
    } else {
      setShowPasswordRequirements(false);
    }
  }, [password]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      time += 0.003;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const drawWave = (
        baseY: number,
        amplitude: number,
        colorStart: string,
        colorEnd: string,
        speedScale: number,
        frequencyScale: number,
        waveType: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 4) {
          let dY = 0;
          if (waveType === 0) {
            dY += Math.sin(x * 0.002 * frequencyScale + time * 1.0 * speedScale) * amplitude;
            dY += Math.cos(x * 0.004 * frequencyScale - time * 0.7 * speedScale) * (amplitude * 0.5);
          } else if (waveType === 1) {
            dY += Math.sin(x * 0.0025 * frequencyScale + time * 0.8 * speedScale) * amplitude;
            dY += Math.cos(x * 0.005 * frequencyScale - time * 1.1 * speedScale) * (amplitude * 0.4);
          } else {
            dY += Math.cos(x * 0.0022 * frequencyScale + time * 0.5 * speedScale) * amplitude;
            dY += Math.sin(x * 0.0045 * frequencyScale - time * 0.8 * speedScale) * (amplitude * 0.45);
          }
          ctx.lineTo(x, baseY + dY);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - amplitude * 2, 0, height);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.6, colorEnd);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.fill();
      };

      drawWave(height * 0.78, height * 0.12, "rgba(24, 24, 30, 0.45)", "rgba(9, 9, 11, 0)", 0.6, 0.75, 0);
      drawWave(height * 0.68, height * 0.09, "rgba(42, 42, 55, 0.25)", "rgba(10, 10, 12, 0)", -0.4, 0.95, 1);
      drawWave(height * 0.58, height * 0.1, "rgba(80, 80, 105, 0.08)", "rgba(12, 12, 15, 0)", 0.3, 0.85, 2);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  const ruleMinLength = password.length >= 8;
  const ruleUpper = /[A-Z]/.test(password);
  const ruleLower = /[a-z]/.test(password);
  const ruleNumber = /[0-9]/.test(password);
  const ruleSymbol = /[^A-Za-z0-9]/.test(password);
  const ruleMatches = confirmPassword.length > 0 && password === confirmPassword;

  let percentage = 0;
  if (ruleMinLength) percentage += 20;
  if (ruleUpper) percentage += 20;
  if (ruleLower) percentage += 20;
  if (ruleNumber) percentage += 20;
  if (ruleSymbol) percentage += 20;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    const savedUsersStr = localStorage.getItem("voidclient_users") || "[]";
    const savedUsers = JSON.parse(savedUsersStr);

    const user = savedUsers.find(
      (u: any) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      setErrorMsg("Invalid username or password credentials.");
      return;
    }

    if (user.password !== password) {
      setErrorMsg("Invalid username or password credentials.");
      return;
    }

    setSuccessMsg("Welcome back! Loading secure environment dashboard...");
    setTimeout(() => {
      onLoginSuccess(user.username);
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg("All registration fields are required.");
      return;
    }

    const usernameRegex = /^[A-Za-z0-9_]{3,16}$/;
    if (!usernameRegex.test(username)) {
      setErrorMsg("Username must be between 3 and 16 characters containing only letters, numbers, or underscore.");
      return;
    }

    if (percentage < 100) {
      setErrorMsg("Password does not meet all secure requirements.");
      return;
    }

    if (!ruleMatches) {
      setErrorMsg("Provided passwords do not match.");
      return;
    }

    const savedUsersStr = localStorage.getItem("voidclient_users") || "[]";
    const savedUsers = JSON.parse(savedUsersStr);

    const nameTaken = savedUsers.some(
      (u: any) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (nameTaken) {
      setErrorMsg("Username choice already registered.");
      return;
    }

    const newUser = {
      username: username,
      email: email,
      password: password,
      registeredAt: new Date().toISOString()
    };
    
    savedUsers.push(newUser);
    localStorage.setItem("voidclient_users", JSON.stringify(savedUsers));

    setSuccessMsg("Account generated successfully! Redirecting to login...");
    
    setTimeout(() => {
      setMode("login");
      setSuccessMsg(null);
      setEmail("");
      setConfirmPassword("");
    }, 1500);
  };

  const toggleAuthMode = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setMode(prev => prev === "login" ? "register" : "login");
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative flex flex-col items-center justify-start px-4 pt-32 pb-16 overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full opacity-60" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-950/20 via-black to-black -z-10" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-stretch gap-4">
        <div className="flex justify-start">
          <button 
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[10px] text-zinc-300 hover:text-white transition-all duration-200 tracking-widest font-mono py-2 px-5 border border-zinc-800 border-b-[3.5px] border-b-zinc-700 rounded-full bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.15),_0_6px_16px_rgba(0,0,0,0.8)] hover:-translate-y-0.5 hover:border-b-[4px] hover:border-b-zinc-600 active:translate-y-0.5 active:border-b-[1.5px] active:shadow-inner"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK
          </button>
        </div>

        <motion.div 
          layout 
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className="bg-[#060608]/90 border border-zinc-900 rounded-2xl p-8 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-900 bg-zinc-950 text-zinc-400 text-[9px] font-mono tracking-widest mb-4">
              <span>Void Dashboard</span>
            </div>
            
            <h1 className="text-2xl font-display font-bold tracking-tight text-white">
              void<span className="text-zinc-500 font-light">client</span>
            </h1>

            <AnimatePresence mode="wait">
              <motion.p 
                key={mode}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="text-zinc-500 text-xs mt-1.5 font-sans"
              >
                {mode === "login" 
                  ? "Sign in to continue to your dashboard." 
                  : "Register to access your dashboard and client downloads."}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="p-4 rounded-xl border border-rose-900/30 bg-rose-950/20 text-rose-400 text-xs flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-emerald-400 text-xs flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>{successMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            <motion.div layout className="space-y-1.5">
              <label className="block text-[10px] font-mono tracking-wider font-semibold text-zinc-500 uppercase">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-600">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a0a0d] border border-zinc-900 focus:border-zinc-750 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-white placeholder-zinc-700 outline-none transition-colors duration-200 animate-none"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {mode === "register" && (
                <span className="text-[9px] text-zinc-650 block mt-1 font-mono">
                  3–16 characters: letters (A–Z), numbers, underscores.
                </span>
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {mode === "register" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, transform: "scaleY(0.9)" }}
                  animate={{ opacity: 1, height: "auto", transform: "scaleY(1)" }}
                  exit={{ opacity: 0, height: 0, transform: "scaleY(0.9)" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-1.5 overflow-hidden"
                  layout
                >
                  <label className="block text-[10px] font-mono tracking-wider font-semibold text-zinc-500 uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required={mode === "register"}
                      className="w-full bg-[#0a0a0d] border border-zinc-900 focus:border-zinc-750 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-white placeholder-zinc-700 outline-none transition-colors duration-200"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout className="space-y-1.5">
              <label className="block text-[10px] font-mono tracking-wider font-semibold text-zinc-500 uppercase">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-600">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  className="w-full bg-[#0a0a0d] border border-zinc-900 focus:border-zinc-750 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-white placeholder-zinc-700 outline-none transition-colors duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {mode === "register" && (
                <span className="text-[9px] text-zinc-650 block mt-1 font-mono">
                  Minimum 8 characters.
                </span>
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {mode === "register" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, transform: "scaleY(0.9)" }}
                  animate={{ opacity: 1, height: "auto", transform: "scaleY(1)" }}
                  exit={{ opacity: 0, height: 0, transform: "scaleY(0.9)" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-4 overflow-hidden"
                  layout
                >
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider font-semibold text-zinc-500 uppercase">
                      Confirm password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-600">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required={mode === "register"}
                        className="w-full bg-[#0a0a0d] border border-zinc-900 focus:border-zinc-750 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-white placeholder-zinc-700 outline-none transition-colors duration-200"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {showPasswordRequirements && (
                    <div className="bg-[#0b0b0f] border border-zinc-900 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase">
                          Password strength
                        </span>
                        <span className="text-[9px] font-mono text-white tracking-wide font-semibold">
                          {percentage}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            percentage <= 20 
                              ? "bg-rose-500" 
                              : percentage <= 60 
                              ? "bg-amber-500" 
                              : percentage <= 80 
                              ? "bg-sky-500" 
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[9px] font-mono text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <span className={`p-0.5 rounded transition-all duration-250 ${ruleMinLength ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-400" : "bg-zinc-950 border border-zinc-900 text-zinc-650"}`}>
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className={ruleMinLength ? "text-zinc-300" : "text-zinc-600"}>8+ Chars</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`p-0.5 rounded transition-all duration-250 ${ruleUpper ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-400" : "bg-zinc-950 border border-zinc-900 text-zinc-650"}`}>
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className={ruleUpper ? "text-zinc-300" : "text-zinc-600"}>Uppercase</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`p-0.5 rounded transition-all duration-250 ${ruleLower ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-400" : "bg-zinc-950 border border-zinc-900 text-zinc-650"}`}>
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className={ruleLower ? "text-zinc-300" : "text-zinc-600"}>Lowercase</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`p-0.5 rounded transition-all duration-250 ${ruleNumber ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-400" : "bg-zinc-950 border border-zinc-900 text-zinc-650"}`}>
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className={ruleNumber ? "text-zinc-300" : "text-zinc-600"}>Number</span>
                        </div>

                        <div className="flex items-center gap-1.5 col-span-2">
                          <span className={`p-0.5 rounded transition-all duration-250 ${ruleMatches ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-400" : "bg-zinc-950 border border-zinc-900 text-zinc-650"}`}>
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className={ruleMatches ? "text-zinc-300" : "text-zinc-600"}>Passwords match</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-550 leading-relaxed font-sans pt-1">
                    Your account choice may be recycled if no license key is redeemed within 90 days of registration.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout>
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-white hover:bg-zinc-200 active:scale-[0.98] text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-200 font-sans"
              >
                {mode === "login" ? "Login" : "Register"}
              </button>
            </motion.div>
          </form>

          <motion.div 
            layout 
            className="text-center mt-6 pt-6 border-t border-zinc-900/60 text-xs text-zinc-550 font-sans"
          >
            {mode === "login" ? (
              <>
                Don't have an account yet?{" "}
                <button 
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-white hover:underline focus:outline-none font-medium ml-1"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-white hover:underline focus:outline-none font-medium ml-1"
                >
                  Login
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
