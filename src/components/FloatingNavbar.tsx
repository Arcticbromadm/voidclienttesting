import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, Shield, Cpu, Zap, CreditCard, HelpCircle } from "lucide-react";

export default function FloatingNavbar({
  onLoginClick,
  onDashboardClick,
  currentUser
}: {
  onLoginClick?: (mode?: "login" | "register") => void;
  onDashboardClick?: () => void;
  currentUser?: string | null;
} = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const sections = ["home", "features", "pricing", "faq"];
      const current = sections.find((sect) => {
        const el = document.getElementById(sect);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "home", label: "Home", icon: Zap },
    { id: "features", label: "Features", icon: Shield },
    { id: "pricing", label: "Pricing", icon: CreditCard },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-300 ${
          scrolled
            ? "bg-black/90 border border-zinc-800 backdrop-blur-md py-3 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.8)] rounded-full"
            : "bg-transparent py-5 px-6 rounded-none border-b border-white/5"
        }`}
        id="main-nav"
      >
        <div className="flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("home");
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src="https://voidclient.lol/logo.png"
              alt="voidclient Logo"
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-bold text-lg tracking-wider text-white flex items-center gap-0">
              void<span className="text-zinc-400 font-light">client</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide font-sans cursor-pointer transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-black bg-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://discord.gg/getvoid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-800 bg-transparent hover:bg-zinc-900 hover:border-zinc-700 text-xs font-semibold rounded-full text-white transition-all duration-300 active:scale-95"
            >
              Join Discord
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </a>

            {currentUser ? (
              <button
                onClick={onDashboardClick}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-full transition-all duration-300 active:scale-95"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => onLoginClick?.("login")}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-full transition-all duration-300 active:scale-95"
              >
                Login
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:bg-zinc-900"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-[4%] right-[4%] z-40 p-6 bg-black border border-zinc-800 backdrop-blur-lg rounded-2xl flex flex-col gap-5 md:hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 px-3">
                Navigation
              </span>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? "text-black bg-white font-semibold"
                        : "text-zinc-350 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-zinc-800 my-1" />

            <div className="flex flex-col gap-2">
              <a
                href="https://discord.gg/getvoid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 border border-zinc-800 text-white hover:bg-zinc-900 text-xs font-bold rounded-xl transition-all mb-1"
              >
                Join Discord
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </a>

              {currentUser ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onDashboardClick?.();
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all"
                >
                  Dashboard panel
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick?.("login");
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
