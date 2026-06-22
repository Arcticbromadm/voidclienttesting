import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import FloatingNavbar from "./components/FloatingNavbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FaqSection from "./components/FaqSection";
import FooterSection from "./components/FooterSection";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import { useInertiaScroll } from "./hooks/useInertiaScroll";

export default function App() {
  const [view, setView] = useState<"landing" | "auth" | "dashboard">("landing");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useInertiaScroll(view === "landing");

  useEffect(() => {
    const activeSession = localStorage.getItem("voidclient_logged_in");
    if (activeSession) {
      setCurrentUser(activeSession);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem("voidclient_logged_in", username);
    setCurrentUser(username);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("voidclient_logged_in");
    setCurrentUser(null);
    setView("landing");
  };

  const handleOpenAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setView("auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-void-black text-white min-h-screen relative font-sans antialiased overflow-x-hidden">
      <FloatingNavbar 
        currentUser={currentUser}
        onLoginClick={handleOpenAuth}
        onDashboardClick={() => setView("dashboard")}
      />

      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <main>
              <HeroSection />
              <Features />
              <Pricing />
              <FaqSection />
            </main>
            
            <FooterSection />
          </motion.div>
        )}

        {view === "auth" && (
          <motion.div
            key="auth-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <AuthPage 
              initialMode={authMode}
              onBack={() => setView("landing")}
              onLoginSuccess={handleLoginSuccess}
            />
          </motion.div>
        )}

        {view === "dashboard" && (
          <motion.div
            key="dashboard-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard 
              username={currentUser || "operative"}
              onLogout={handleLogout}
            />
            
            <FooterSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
