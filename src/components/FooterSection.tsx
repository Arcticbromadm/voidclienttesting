import { useRef, useEffect } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

export default function FooterSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const crazyRef = useRef<number>(1.0);
  const isHoldingRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (isHoldingRef.current) {
        crazyRef.current += (2.2 - crazyRef.current) * 0.08;
      } else {
        crazyRef.current += (1.0 - crazyRef.current) * 0.045;
      }
      const cMult = crazyRef.current;

      ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + (cMult - 1.0) * 0.12})`;

      const spacing = 11;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      time += 0.0075 * (1.0 + (cMult - 1.0) * 0.65);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * spacing;
          const y = r * spacing;

          const scaleX = 0.0035;
          const scaleY = 0.005;

          const w1 = Math.sin(x * scaleX + y * 0.0016 + time * 1.5) * (1.2 + (cMult - 1.0) * 0.12);
          const w2 = Math.cos(x * 0.0012 - y * scaleY - time * 0.8) * (0.8 + (cMult - 1.0) * 0.08);
          const w3 = Math.sin((x + y) * 0.0018 + time * 0.5) * 0.5;

          const waveHeight = w1 + w2 + w3;

          const base = (x * 0.0015) + (y * 0.002) + waveHeight;
          const waveValue = Math.sin(base * 2.5);

          let intensity = (waveValue + 1) / 2;

          intensity = Math.pow(intensity, 3.5);

          const maxRadius = (spacing / 2) * 1.05;
          const radius = intensity * maxRadius;

          if (radius > 0.4) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer 
      onMouseDown={() => { isHoldingRef.current = true; }}
      onMouseUp={() => { isHoldingRef.current = false; }}
      onMouseLeave={() => { isHoldingRef.current = false; }}
      onTouchStart={() => { isHoldingRef.current = true; }}
      onTouchEnd={() => { isHoldingRef.current = false; }}
      className="bg-black text-zinc-400 font-sans border-t border-zinc-900 pt-20 pb-36 relative overflow-hidden select-none cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.24] z-10"
      />

      <div className="absolute inset-x-0 bottom-[-3vw] select-none pointer-events-none z-15 overflow-hidden leading-none text-center mix-blend-difference">
        <span className="text-[17vw] font-black tracking-tighter select-none lowercase">
          <span className="text-white">void</span>
          <span className="text-zinc-400 font-light">client</span>
        </span>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-20 mix-blend-difference">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="https://voidclient.lol/logo.png"
                alt="voidclient Logo"
                className="w-7 h-7 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-bold text-white text-md tracking-wider">
                void<span className="text-zinc-550 font-light">client</span>
              </span>
            </div>

            <p className="text-zinc-450 text-xs sm:text-sm max-w-xs leading-relaxed font-sans">
              Roblox's premium, secure, and undetected environment. Developed dynamically with zero impact on gameplay performance.
            </p>
          </div>

          <div>
            <span className="block font-sans text-xs font-semibold tracking-wider text-white mb-4">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-sans">
              <li>
                <a href="#home" className="hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors duration-200">
                  Pricing plans
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="block font-sans text-xs font-semibold tracking-wider text-white mb-4">
              Disclaimer
            </span>
            <p className="text-xs text-zinc-650 leading-relaxed font-sans">
              © 2026 Void Client. All trademarks, logos, screenshots and gameplay are property of their respective owners. We are not affiliated with, nor are we officially connected to, Byfron, Roblox or Cherax.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-zinc-500">
          <div>
            <span>© 2026 Void Client. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/getvoid"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors text-zinc-550"
            >
              <span>Discord Guild</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-650" />
            </a>
            
            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition-all hover:bg-zinc-900 active:scale-95 flex items-center gap-1 cursor-pointer text-xs"
            >
              <span>To Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
