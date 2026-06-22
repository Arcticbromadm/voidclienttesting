import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      time += 0.0035;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseTargetRef.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseTargetRef.current.y - mouseRef.current.y) * 0.04;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

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

        for (let x = 0; x <= width; x += 3) {
          let dY = 0;
          
          if (waveType === 0) {
            dY += Math.sin(x * 0.001 * frequencyScale + time * 1.0 * speedScale) * amplitude;
            dY += Math.cos(x * 0.002 * frequencyScale - time * 0.7 * speedScale) * (amplitude * 0.5);
            dY += Math.sin(x * 0.0004 + time * 0.3) * (amplitude * 0.2);
          } else if (waveType === 1) {
            dY += Math.sin(x * 0.0014 * frequencyScale + time * 0.8 * speedScale) * amplitude;
            dY += Math.cos(x * 0.0028 * frequencyScale - time * 1.1 * speedScale) * (amplitude * 0.4);
            dY += Math.sin(x * 0.0007 + time * 0.25) * (amplitude * 0.3);
          } else if (waveType === 2) {
            dY += Math.cos(x * 0.0012 * frequencyScale + time * 0.5 * speedScale) * amplitude;
            dY += Math.sin(x * 0.0023 * frequencyScale - time * 0.8 * speedScale) * (amplitude * 0.45);
          } else {
            dY += Math.sin(x * 0.0018 * frequencyScale + time * 1.2 * speedScale) * amplitude;
            dY += Math.cos(x * 0.0013 * frequencyScale - time * 0.4 * speedScale) * (amplitude * 0.4);
          }

          const distToMouse = Math.abs(x - mouseX);
          if (distToMouse < 400) {
            const factor = Math.cos((distToMouse / 400) * (Math.PI / 2));
            const dyMouse = (mouseY - baseY) * 0.22 * factor;
            dY += dyMouse;
          }

          ctx.lineTo(x, baseY + dY);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - amplitude * 2, 0, height);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.5, colorEnd);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.fill();
      };

      drawWave(height * 0.74, 110, "rgba(22, 22, 26, 0.45)", "rgba(9, 9, 11, 0)", 0.65, 0.8, 0);
      drawWave(height * 0.64, 85, "rgba(38, 38, 44, 0.25)", "rgba(10, 10, 12, 0)", -0.45, 1.1, 1);
      drawWave(height * 0.54, 100, "rgba(75, 75, 82, 0.075)", "rgba(12, 12, 15, 0)", 0.35, 0.9, 2);
      drawWave(height * 0.44, 65, "rgba(230, 230, 235, 0.038)", "rgba(9, 9, 11, 0)", -0.5, 1.3, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden px-4 text-center bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-black to-black -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90"
      />

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mb-8"
        >
          <img 
            src="https://voidclient.lol/logo.png" 
            alt="voidclient Logo" 
            className="w-24 h-24 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
        >
          Secure. Stable. <span className="text-zinc-550 font-light font-sans tracking-wide">Undetected.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-10"
        >
          Everything you need.
          With our software, you are always the best in the game. Secure, Stable and Undetected.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-16 justify-center items-center"
        >
          <button
            onClick={() => scrollToSection("pricing")}
            className="group relative flex items-center justify-center gap-2 px-9 py-4 bg-white text-black font-semibold text-sm rounded-full hover:bg-zinc-150 active:scale-[0.96] transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(255,255,255,0.06)] w-full sm:w-60"
          >
            <span>Choose a plan</span>
            <div className="flex items-center w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap shrink-0">
              <ArrowRight className="w-4 h-4 text-black shrink-0 ml-1.5" />
            </div>
          </button>
          
          <button
            onClick={() => scrollToSection("features")}
            className="group relative flex items-center justify-center gap-2 px-9 py-4 border border-zinc-800 bg-zinc-950/40 text-zinc-300 font-semibold text-sm rounded-full hover:text-white hover:border-zinc-550 hover:bg-zinc-900/30 active:scale-[0.96] transition-all duration-300 cursor-pointer w-full sm:w-60"
          >
            <span>Explore features</span>
            <div className="flex items-center w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap shrink-0">
              <ArrowRight className="w-4 h-4 text-white shrink-0 ml-1.5" />
            </div>
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        onClick={() => scrollToSection("features")}
        className="mt-20 flex flex-col items-center gap-3.5 cursor-pointer group relative z-10"
      >
        <span className="font-sans text-xs font-medium tracking-wide text-zinc-550 transition-colors duration-300 group-hover:text-zinc-300">
          Scroll to explore
        </span>
        <div className="w-[1.5px] h-11 bg-gradient-to-b from-zinc-900 to-transparent group-hover:from-zinc-750 transition-all duration-300" />
      </motion.div>
    </section>
  );
}
