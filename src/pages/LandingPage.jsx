import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/* ─── Animated Background (CSS/Framer Motion — no WebGL) ─── */
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -20, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/2 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[100px]"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6 + Math.random() * 8,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 rounded-full bg-indigo-400/40"
        />
      ))}
    </div>
  );
}

// logo
function TaskFlowLogo() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      {/* Logo with rounded background */}
      <motion.div
        className="p-1 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/2 shadow-lg backdrop-blur-sm"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/TeamFlow_logo.png"
          alt="TeamFlow Logo"
          className="h-10 w-10 object-cover rounded-3xl"
        />
      </motion.div>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col"
      >
        <motion.span
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          whileHover={{
            backgroundImage:
              "linear-gradient(to right, rgb(129, 140, 248), rgb(192, 132, 252), rgb(244, 114, 182))",
            scale: 1.02,
          }}
        >
          𝚃𝚎𝚊𝚖𝙵𝚕𝚘𝚠
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[10px] text-zinc-500 tracking-wider uppercase"
        >
          Manage & Flow
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Transparent Navbar ─── */

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="fixed top-4 z-50 w-full flex justify-center pointer-events-none px-2"
      >
        {/* Floating Glass Container */}
        <div
          className={`
            pointer-events-auto
            flex items-center justify-between
            w-full max-w-6xl
            px-4 md:px-6 py-3
            rounded-full
            transition-all duration-300
            ${
              scrolled
                ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-xl"
                : "bg-black/30 backdrop-blur-xl border border-white/10"
            }
          `}
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-lg font-semibold tracking-tight cursor-pointer"
          >
            <TaskFlowLogo />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-white transition cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-white transition cursor-pointer"
            >
              About
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() =>
                  navigate(user?.role === "admin" ? "/admin" : "/employee")
                }
                className="px-4 md:px-5 py-2 text-sm rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 md:px-4 py-2 text-sm rounded-full text-zinc-300 hover:text-white transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register-company")}
                  className="hidden sm:block px-4 md:px-5 py-2 text-sm rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 left-4 right-4 z-40 md:hidden pointer-events-auto"
        >
          <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("features")}
                className="px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="px-4 py-3 text-left text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                About
              </button>
              <div className="h-px bg-white/10 my-2" />
              <button
                onClick={() => {
                  navigate("/register-company");
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 text-left bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative min-h-screen pt-24 md:pt-32 pb-16 flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/60 via-transparent to-[#09090b]/80 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 mb-6 md:mb-8 bg-white/[0.05] border border-white/[0.08] rounded-full text-xs text-zinc-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Role-based access for admins & employees
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4 md:mb-6 px-2">
            <span className="text-white">Manage your team</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              with confidence
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-zinc-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
          >
            The all-in-one platform for employee management, task tracking, and
            team analytics. Built for modern teams that move fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center px-4"
          >
            {isAuthenticated ? (
              <button
                onClick={() =>
                  navigate(user?.role === "admin" ? "/admin" : "/employee")
                }
                className="group px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-sm md:text-[15px] text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.97] cursor-pointer w-full sm:w-auto"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register-company")}
                  className="group px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-sm md:text-[15px] text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.97] cursor-pointer w-full sm:w-auto"
                >
                  Register as Admin
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 md:px-8 py-3 md:py-3.5 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.15] rounded-xl font-semibold text-sm md:text-[15px] text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer w-full sm:w-auto"
                >
                  Sign in
                </button>
              </>
            )}
          </motion.div>

          {/* Role highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-10 px-4"
          >
            <div className="flex items-center gap-3 px-4 md:px-5 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl w-full sm:w-auto max-w-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Admin</div>
                <div className="text-xs text-zinc-500">
                  Manage employees & tasks
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 md:px-5 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl w-full sm:w-auto max-w-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Employee</div>
                <div className="text-xs text-zinc-500">
                  View & complete your tasks
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 border border-zinc-700 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 bg-zinc-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Features Section ─── */
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Role-Based Access",
      description:
        "Admin and employee roles with secure permissions. Admins manage teams; employees focus on tasks.",
      color: "from-indigo-500/20 to-indigo-500/0",
      iconColor: "text-indigo-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Live Analytics",
      description:
        "Real-time dashboards with employee performance and task completion metrics.",
      color: "from-purple-500/20 to-purple-500/0",
      iconColor: "text-purple-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Smart Notifications",
      description:
        "Automated email alerts for assignments, completions, and deadlines.",
      color: "from-pink-500/20 to-pink-500/0",
      iconColor: "text-pink-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: "Task Management",
      description:
        "Create, assign, and track tasks with priorities, categories, and due dates.",
      color: "from-emerald-500/20 to-emerald-500/0",
      iconColor: "text-emerald-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Lightning Fast",
      description:
        "Built with React and Node.js for instant response times and smooth UX.",
      color: "from-amber-500/20 to-amber-500/0",
      iconColor: "text-amber-400",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      title: "Modern Interface",
      description:
        "Clean, intuitive UI with smooth animations and a beautiful dark theme.",
      color: "from-cyan-500/20 to-cyan-500/0",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-28 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-indigo-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-2 md:mb-3">
            Features
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 md:mb-4 px-2">
            Everything you need to manage your team
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-[15px] px-4">
            Powerful tools designed for modern teams that want to move fast and
            stay organized.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative p-5 md:p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-300"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-3 md:mb-4 ${feature.iconColor}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-1.5 md:mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works Section ─── */
function HowItWorksSection() {
  const navigate = useNavigate();

  const steps = [
    {
      step: "01",
      title: "Admin registers",
      description:
        "Create your account with your company name. You become the admin of your workspace.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
    },
    {
      step: "02",
      title: "Add employees",
      description:
        "Add your team members from the admin dashboard. They get login credentials automatically.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      step: "03",
      title: "Assign tasks",
      description:
        "Create and assign tasks to employees with priorities and deadlines. Track everything live.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      step: "04",
      title: "Employees deliver",
      description:
        "Employees log in to view, accept, and complete their assigned tasks from their dashboard.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-28 px-4 md:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-indigo-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-2 md:mb-3">
            How it works
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 md:mb-4 px-2">
            Get started in 4 simple steps
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-[15px] px-4">
            From registration to task completion — here's how TeamFlow works for
            your team.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-5 md:p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400">
                  {s.icon}
                </div>
                <div>
                  <span className="text-xs font-mono text-indigo-400/60">
                    Step {s.step}
                  </span>
                  <h3 className="text-base md:text-lg font-semibold text-white mt-0.5 mb-1 md:mb-1.5 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12 px-4"
        >
          <button
            onClick={() => navigate("/register-company")}
            className="px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-sm md:text-[15px] text-white hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.97] transition-all duration-200 cursor-pointer w-full sm:w-auto"
          >
            Register as Admin — It's free
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA / About Section ─── */
function CTASection() {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-16 md:py-28 px-4 md:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 md:mb-4 px-2">
          Ready to transform your team management?
        </h2>
        <p className="text-zinc-500 text-sm md:text-[15px] mb-6 md:mb-8 max-w-xl mx-auto px-4">
          Sign up as an admin to create your workspace, add employees, and start
          assigning tasks — all in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
          <button
            onClick={() => navigate("/register-company")}
            className="px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-sm md:text-[15px] text-white hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.97] transition-all duration-200 cursor-pointer w-full sm:w-auto"
          >
            Get started for free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 md:px-8 py-3 md:py-3.5 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] rounded-xl font-semibold text-sm md:text-[15px] text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer w-full sm:w-auto"
          >
            Sign in to your account
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const navigate = useNavigate();

  const handleFooterLink = (link) => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
    // You can add actual routes here if needed
    console.log(`Navigate to ${link}`);
  };

  return (
    <footer className="py-8 md:py-10 px-4 md:px-6 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="p-1.5 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/5">
            <img
              src="/TeamFlow_logo.png"
              alt="TeamFlow"
              className="h-7 w-7 object-cover rounded-3xl"
            />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            𝚃𝚎𝚊𝚖𝙵𝚕𝚘𝚠
          </span>
        </div>
        <span className="text-zinc-600 text-xs text-center">
          &copy; {new Date().getFullYear()} TeamFlow. All rights reserved.
        </span>
        <div className="flex gap-4 md:gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <button
              key={link}
              onClick={() => handleFooterLink(link)}
              className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
