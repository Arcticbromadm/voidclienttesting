import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, HelpCircle, ShieldAlert } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rippleTriggerRef = useRef<number>(0);

  const faqs: FaqItem[] = [
    {
      question: "Is this product safe to use?",
      answer: "Void Client comes with a low-level anticheat bypass, but no cheat product can honestly promise zero risk. The presentation is premium; the operational risk remains real."
    },
    {
      question: "How long do updates take?",
      answer: "The site already expects quick turnaround and short downtime. This redesign keeps that messaging intact while moving it into a more polished landing flow."
    },
    {
      question: "Can I get banned while using Void Client?",
      answer: "Yes. Fast updates and bypass work reduce risk, but they do not remove it. Manual bans, detections and game-side changes are always possible."
    },
    {
      question: "Will my existing account work?",
      answer: "Yes. Your current account, login credentials, and all purchased features work exactly the same as before."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, our team is active 24/7. Join our community Discord or open a direct ticket for automated activation support, general gameplay assistance, and troubleshooting."
    },
    {
      question: "Which operating systems are supported?",
      answer: "Void Client is optimized specifically for 64-bit Windows pipelines (Windows 10 and Windows 11 are fully supported). Virtual machines are disabled for security reasons."
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let lastWidth = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const width = parent.clientWidth;
      const height = 950; 
      const dpr = window.devicePixelRatio || 1;
      
      lastWidth = width;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (Math.abs(width - lastWidth) > 3) {
          resizeCanvas();
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      time += 0.01;
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const drawOrganicHexagon = (
        cx: number,
        cy: number,
        baseRadius: number,
        color: string,
        timeMultiplier: number,
        intensity: number
      ) => {
        ctx.beginPath();
        const angleStep = (Math.PI * 2) / 6;

        for (let i = 0; i <= 6; i++) {
          const angle = i * angleStep;
          
          const offset = Math.sin(angle * 2 + time * timeMultiplier) * intensity * 28 +
                         Math.cos(angle * 3 - time * 0.7 * timeMultiplier) * intensity * 18;
          
          const r = baseRadius + offset;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1.0;
        ctx.stroke();
      };

      const x1 = width * 0.16 + Math.sin(time * 0.15) * 50;
      const y1 = height * 0.38 + Math.cos(time * 0.2) * 40;
      drawOrganicHexagon(x1, y1, 240, "rgba(255, 255, 255, 0.022)", 0.6, 0.8);

      const x2 = width * 0.82 + Math.cos(time * 0.12) * 60;
      const y2 = height * 0.54 + Math.sin(time * 0.16) * 50;
      drawOrganicHexagon(x2, y2, 290, "rgba(240, 240, 255, 0.018)", 0.5, 0.9);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section id="faq" className="w-full relative py-24 border-t border-zinc-900 bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full opacity-70" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-400 text-[11px] font-mono tracking-widest uppercase mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
            <span>common inquiries</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight leading-none"
          >
            Frequently Asked Questions
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-500 text-xs sm:text-sm font-sans mt-3 max-w-lg mx-auto"
          >
            Clear guidance regarding safety, updates, bans, accounts, and client operations.
          </motion.p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative rounded-2xl transition-all duration-300 ease-out select-none border ${
                  isOpen 
                    ? "border-zinc-600 bg-gradient-to-b from-[#181820]/95 via-[#0e0e13]/98 to-[#09090c] shadow-[inset_0_1.5px_3.5px_rgba(255,255,255,0.12),_0_12px_28px_rgba(0,0,0,0.85),_0_0_20px_rgba(255,255,255,0.015)]"
                    : "border-zinc-800/80 bg-gradient-to-b from-[#111116]/85 via-[#0c0c0f]/90 to-[#060608]/95 hover:-translate-y-1 hover:border-zinc-700/85 hover:shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.06),_0_16px_32px_rgba(0,0,0,0.9)] active:translate-y-0 active:shadow-inner"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-sans focus:outline-none"
                >
                  <span className={`text-[13px] sm:text-sm tracking-wide font-medium font-sans transition-colors duration-200 ${
                    isOpen ? "text-white font-semibold" : "text-zinc-200"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 p-2.5 rounded-full border transition-all duration-300 ${
                    isOpen 
                      ? "border-zinc-500 bg-zinc-800 text-white shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.35),_0_0_15px_rgba(255,255,255,0.15)] scale-110" 
                      : "border-zinc-800 bg-zinc-950/95 text-zinc-400 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.1),_0_4px_8px_rgba(0,0,0,0.6)]"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
 
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5.5 text-[11.5px] sm:text-[13px] text-zinc-400 leading-relaxed font-sans border-t border-zinc-900/60 pt-4 flex gap-3.5">
                        <ShieldAlert className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                        <p className="text-zinc-400">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
