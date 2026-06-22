import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Shield, Sparkles, Zap, Cpu, CheckCircle, HelpCircle } from "lucide-react";
import { FEATURES_DATA } from "../data";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16,
    },
  },
};

interface FeatureCardProps {
  feat: any;
  getIcon: any;
  key?: string | number;
}

function FeatureCard({ feat, getIcon }: FeatureCardProps) {
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
    
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * -12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={itemVariants}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: rotate.x === 0 && rotate.y === 0 ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, background-color 0.3s" : "border-color 0.3s, background-color 0.3s",
      }}
      className="relative group bg-[#070709] border border-zinc-900/90 p-8 rounded-2xl flex flex-col justify-between hover:border-zinc-800 hover:bg-[#0b0b0f]"
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <div className="mb-6">
          <div className="w-11 h-11 rounded-lg bg-zinc-900/40 border border-zinc-950 flex items-center justify-center">
            {getIcon(feat.id)}
          </div>
        </div>

        <h3 className="font-display text-lg font-bold text-white mb-2.5 transition-colors group-hover:text-zinc-200">
          {feat.title}
        </h3>
        <p className="font-sans text-zinc-400 text-sm leading-relaxed transition-colors group-hover:text-zinc-300">
          {feat.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const getIcon = (id: string) => {
    switch (id) {
      case "external-internal":
        return <Cpu className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
      case "aimbot":
        return <CheckCircle className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
      case "protections":
        return <Shield className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
      case "updates":
        return <Zap className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
      case "optimized":
        return <Sparkles className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
      case "fast-support":
        return <HelpCircle className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
      default:
        return <Shield className="w-5.5 h-5.5 text-zinc-300 transition-colors duration-300 group-hover:text-white" />;
    }
  };

  return (
    <section id="features" className="py-24 border-t border-zinc-950 bg-black relative">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080808] to-transparent pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-sans text-[10px] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
            Premium Engineering
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-4">
            A new standard of execution
          </h2>
          <p className="font-sans text-zinc-400 text-sm max-w-xl leading-relaxed">
            From universal external overlays to powerful anti-detection safeguards. 
            We build every component from the ground up to ensure performance without compromise.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES_DATA.map((feat) => (
            <FeatureCard key={feat.id} feat={feat} getIcon={getIcon} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
