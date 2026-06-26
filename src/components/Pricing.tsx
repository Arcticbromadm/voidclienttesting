import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Check, Info, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { PRICING_PLANS_DATA } from "../data";
import { PricingPlan } from "../types";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15,
    },
  },
};

interface PricingCardProps {
  plan: PricingPlan;
  key?: string | number;
}

function PricingCard({ 
  plan 
}: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const isRec = plan.isPopular;
  const isLifetime = plan.isLifetime;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: rotate.x === 0 && rotate.y === 0 ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, background-color 0.3s" : "border-color 0.3s, background-color 0.3s",
      }}
      className={`relative rounded-2xl flex flex-col justify-between overflow-hidden min-h-[480px] ${
        isRec
          ? "bg-[#08080a] border border-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-10"
          : "bg-[#060608]/90 border border-zinc-900/90 backdrop-blur-sm hover:border-zinc-800 hover:bg-[#0b0b0f]"
      }`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {isRec && (
          <div className="absolute top-0 right-0 bg-[#e4e4e7] text-black font-semibold text-[10px] tracking-wider px-3.5 py-1.5 rounded-bl-xl flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-black" />
            <span>Recommended</span>
          </div>
        )}

        {isLifetime && (
          <div className="absolute top-0 right-0 bg-zinc-950 border-b border-l border-zinc-900 text-zinc-550 font-mono text-[9px] tracking-wider px-3 py-1.5 rounded-bl-xl">
            Exclusive
          </div>
        )}

        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <p className="font-mono text-xs text-zinc-500 tracking-wider font-semibold uppercase">
                {plan.name}
              </p>
              
              <div className="flex items-baseline gap-1 mt-2.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {plan.price}
                </span>
                <span className="text-xs font-mono text-zinc-450">
                  / {plan.id === "lifetime" ? "forever" : plan.duration}
                </span>
              </div>

              {isLifetime && (
                <div className="mt-3 text-[11px] font-sans text-zinc-500 flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span>Enjoy stress-free, never-expiring licenses!</span>
                </div>
              )}
            </div>

            <p className="font-sans text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
              {plan.tagline}
            </p>
          </div>

          <div className="border-t border-zinc-900/60 pt-6 mt-4">
            <p className="font-mono text-[10px] text-zinc-500 tracking-wider mb-4 uppercase">
              Tiers standard inclusions
            </p>
            <ul className="space-y-3 font-mono text-xs text-zinc-300">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-zinc-900/60 bg-black/40">
        <button
          className={`group relative flex items-center justify-center gap-1.5 w-full py-3.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-[0.98] text-center ${
            isRec
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-[#0d0d11]/80 border border-zinc-855 hover:border-zinc-700 hover:bg-zinc-950 text-white"
          }`}
          title="Checkout system integration required"
        >
          <span>Buy plan</span>
          <div className="flex items-center w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-out">
            <ArrowRight className={`w-3.5 h-3.5 shrink-0 ml-0.5 ${isRec ? 'text-black' : 'text-white'}`} />
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-zinc-950 bg-black relative">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />

      <div className="w-full max-w-[1320px] mx-auto px-4">
        <div className="text-center mb-16 flex flex-col items-center">
         
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-4">
            Choose your plan
          </h2>
          <p className="font-sans text-zinc-400 text-sm max-w-xl leading-relaxed">
            From simple options to premium bypass layers. With our software, you are always the best in the game. Secure, Stable and Undetected.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {PRICING_PLANS_DATA.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
            />
          ))}
        </motion.div>

        <div className="mt-12 text-center text-[10px] font-mono text-zinc-650 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
          <span>All licenses are instantly dispatched to Discord tickets or emailed directly on payment clearance.</span>
        </div>
      </div>
    </section>
  );
}
