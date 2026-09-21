import React, { useRef, useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Ensure motion is referenced for linters without jsx member expression visitor
void motion;
import { useAuth } from "../hooks/useAuth";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  Check,
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
  Lock,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   3D HERO PRODUCT SCENE (Interactive Three.js Canvas)
   Showcases layered floating holographic cards & geometric tokens
   representing tasks, collaboration nodes, and workflow geometry
═══════════════════════════════════════════════════════════════ */

function MouseSceneWrapper({ children }) {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.25,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.18,
        0.05
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function FloatingTaskCards3D() {
  const meshRef1 = useRef();
  const meshRef2 = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
    }
    if (meshRef1.current) {
      meshRef1.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = Math.cos(t * 0.6) * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Holographic Dashboard Slate */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={meshRef1} position={[0, 0.2, 0]}>
          <RoundedBox args={[3.8, 2.4, 0.12]} radius={0.12} smoothness={4}>
            <meshStandardMaterial
              color="#0d1424"
              emissive="#1e1b4b"
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.85}
            />
          </RoundedBox>

          {/* Accent Border Wire */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(3.82, 2.42, 0.13)]} />
            <lineBasicMaterial color="#6366f1" transparent opacity={0.4} />
          </lineSegments>

          {/* Status Capsule Indicator in 3D */}
          <mesh position={[1.2, 0.8, 0.1]}>
            <capsuleGeometry args={[0.09, 0.4, 8, 16]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating Auxiliary Metric Card - Left */}
      <Float speed={2.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <group ref={meshRef2} position={[-2.4, -0.7, 0.9]} rotation={[0.1, 0.2, -0.08]}>
          <RoundedBox args={[2.0, 1.4, 0.08]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color="#131b2e"
              emissive="#312e81"
              emissiveIntensity={0.5}
              metalness={0.7}
              roughness={0.25}
              transparent
              opacity={0.82}
            />
          </RoundedBox>
          <mesh position={[-0.6, 0.35, 0.06]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      {/* Floating Priority Pill - Right */}
      <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.7}>
        <group position={[2.3, 0.8, 0.8]} rotation={[-0.1, -0.2, 0.05]}>
          <RoundedBox args={[1.8, 1.1, 0.08]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color="#1a1c2e"
              emissive="#431407"
              emissiveIntensity={0.35}
              metalness={0.75}
              roughness={0.3}
              transparent
              opacity={0.8}
            />
          </RoundedBox>
          <mesh position={[0.5, 0.25, 0.06]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      {/* Celestial Ambient Particle Constellation */}
      <DreiSparkles
        count={50}
        scale={9}
        size={2.2}
        speed={0.35}
        opacity={0.65}
        color="#a5b4fc"
      />

      {/* Primary Orbital Ring Anchor */}
      <group ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.6, 0.015, 16, 100]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Secondary Counter-Rotating Orbital Ring */}
      <group rotation={[-Math.PI / 4, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[2.8, 0.012, 16, 80]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

function Hero3DCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} color="#818cf8" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-4, -3, 3]} intensity={1.2} color="#06b6d4" />
      <pointLight position={[3, 4, 2]} intensity={1.5} color="#8b5cf6" />
      <MouseSceneWrapper>
        <FloatingTaskCards3D />
      </MouseSceneWrapper>
    </Canvas>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STICKY GLASS NAVBAR
═══════════════════════════════════════════════════════════════ */

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

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-4">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-[#090e1cf0] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 py-3.5 px-6"
            : "bg-transparent py-4 px-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-px shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="w-full h-full bg-[#090e1c] rounded-[11px] flex items-center justify-center">
                <img
                  src="/TeamFlow_logo.png"
                  alt="TeamFlow Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                TeamFlow
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              </div>
              <div className="text-[10px] tracking-wider uppercase text-zinc-400 font-medium font-sans">
                Workspace OS
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("features")}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("preview")}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Interactive Demo
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("use-cases")}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Use Cases
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() =>
                  navigate(user?.role === "admin" ? "/admin" : "/employee")
                }
                className="btn-primary-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register-company")}
                  className="btn-primary-gradient px-4.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  Register Admin
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 p-4 rounded-2xl bg-[#0b101f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollTo("features")}
                className="text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-white/5 font-medium text-sm"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("preview")}
                className="text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-white/5 font-medium text-sm"
              >
                Interactive Demo
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-white/5 font-medium text-sm"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollTo("use-cases")}
                className="text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-white/5 font-medium text-sm"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollTo("faq")}
                className="text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-white/5 font-medium text-sm"
              >
                FAQ
              </button>
              <div className="h-px bg-white/10 my-2" />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(user?.role === "admin" ? "/admin" : "/employee");
                  }}
                  className="w-full btn-primary-gradient py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/register-company");
                    }}
                    className="w-full btn-primary-gradient py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    Register as Admin
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INTERACTIVE HOLOGRAPHIC HERO CONSOLE (3D Parallax & Live Tabs)
═══════════════════════════════════════════════════════════════ */

function InteractiveHeroConsole() {
  const [activeTab, setActiveTab] = useState("task"); // 'task' | 'velocity' | 'security'
  const [taskStatus, setTaskStatus] = useState("in_progress"); // 'in_progress' | 'completed'
  const [progress, setProgress] = useState(68);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleToggleTask = () => {
    if (taskStatus === "in_progress") {
      setTaskStatus("completed");
      setProgress(100);
    } else {
      setTaskStatus("in_progress");
      setProgress(68);
    }
  };

  return (
    <div
      className="relative w-full max-w-lg mx-auto select-none"
      style={{ perspective: 1200 }}
    >
      {/* Floating Spatial Satellite 1: Velocity Trend (Top-Right) */}
      <div className="absolute -top-5 -right-2 sm:-right-6 glass-panel px-4 py-2.5 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 flex items-center gap-3 animate-float z-30 pointer-events-none">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Sprint Velocity
          </div>
          <div className="text-xs font-display font-extrabold text-white flex items-center gap-1">
            +38.4%{" "}
            <span className="text-[10px] text-emerald-400 font-medium">
              acceleration
            </span>
          </div>
        </div>
      </div>

      {/* Floating Spatial Satellite 2: Security & RBAC (Bottom-Left) */}
      <div className="absolute -bottom-5 -left-2 sm:-left-6 glass-panel px-4 py-2.5 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/40 flex items-center gap-3 animate-float-delayed z-30 pointer-events-none">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Hardened RBAC
          </div>
          <div className="text-xs font-display font-extrabold text-white">
            Zero Data Leakage
          </div>
        </div>
      </div>

      {/* Main Console Deck with 3D Parallax Tilt */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative rounded-3xl p-5 sm:p-6 glass-panel border border-white/15 shadow-2xl shadow-black/80 overflow-hidden group cursor-default backdrop-blur-2xl"
      >
        {/* Dynamic Specular Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(500px circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 70%)`,
          }}
        />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
          {/* Mac-style traffic lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40" />
            <span className="ml-2 text-xs font-medium text-zinc-400 hidden sm:inline">
              TeamFlow Workspace
            </span>
          </div>

          {/* Live Ping Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync · 12ms
          </div>
        </div>

        {/* Interactive View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 mb-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("task")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "task"
                ? "bg-indigo-600 text-white shadow-md font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            Deliverable
          </button>
          <button
            onClick={() => setActiveTab("velocity")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "velocity"
                ? "bg-indigo-600 text-white shadow-md font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Velocity
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            RBAC Guard
          </button>
        </div>

        {/* TAB CONTENT: Task Deliverable */}
        {activeTab === "task" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Sprint Deliverable #42
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                  taskStatus === "completed"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {taskStatus === "completed" ? "✓ Completed" : "In Progress"}
              </span>
            </div>

            <div>
              <h4 className="font-display font-bold text-white text-base sm:text-lg tracking-tight">
                Ship OAuth 2.0 Multi-Tenant SSO
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Connect enterprise IdPs, enforce SAML 2.0 claims, and isolate company workspace tokens.
              </p>
            </div>

            {/* Live Progress Bar with Animation */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 font-medium">Sprint Completion</span>
                <span className="font-bold text-white font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    taskStatus === "completed"
                      ? "bg-linear-to-r from-emerald-500 to-teal-400"
                      : "bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Assignee & Due Date Row */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-[11px] shadow">
                    JD
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#090e1c]" />
                </div>
                <div>
                  <div className="font-semibold text-white leading-none">John Developer</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Staff Engineer</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Due Tomorrow, 5 PM</span>
              </div>
            </div>

            {/* Interactive Hero Action Button */}
            <div className="pt-1.5">
              {taskStatus === "in_progress" ? (
                <button
                  onClick={handleToggleTask}
                  className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Mark Deliverable Complete (68% → 100%)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Deliverable verified & deployed!</span>
                  </div>
                  <button
                    onClick={handleToggleTask}
                    title="Reset Preview"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Velocity Analytics */}
        {activeTab === "velocity" && (
          <div className="space-y-3.5 py-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Sprint Throughput</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +24% vs Target
              </span>
            </div>
            <div className="font-display font-extrabold text-2xl text-white">
              34 Tasks Completed
            </div>

            {/* Mini SVG Velocity Sparkline */}
            <div className="h-16 w-full flex items-end gap-1.5 pt-2">
              {[40, 55, 35, 65, 80, 75, 95].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-linear-to-t from-indigo-600/40 to-cyan-400 transition-all duration-500"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
              <span>Avg Cycle Time: <strong className="text-white">1.8 days</strong></span>
              <span>Zero Overdue Items</span>
            </div>
          </div>
        )}

        {/* TAB CONTENT: RBAC Security Guard */}
        {activeTab === "security" && (
          <div className="space-y-3 py-1">
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Admin Privileges</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Full Authority
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Employee Privileges</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                Task Scoped
              </span>
            </div>

            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-tenant isolation verified with JWT signatures</span>
            </div>
          </div>
        )}

        {/* Bottom Micro Activity Feed */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="truncate">Sarah K. assigned 3 tasks to Engineering</span>
          </div>
          <span className="text-zinc-500 whitespace-nowrap ml-2">2m ago</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — High Impact with Integrated 3D Product Canvas
═══════════════════════════════════════════════════════════════ */

function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative min-h-[94vh] flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Aurora Mesh Glow Layer */}
      <div className="aurora-mesh" />

      {/* Ambient Radial Lighting Glows */}
      <div className="glow-ambient-indigo -top-30 left-1/2 -translate-x-1/2" />
      <div className="glow-ambient-cyan top-40 -right-25" />

      {/* Subtle Spatial Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left Column: Value Proposition & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 text-center lg:text-left"
        >
          {/* Live Status Chip */}
          <div
            onClick={() => {
              const demo = document.getElementById("demo");
              if (demo) demo.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-linear-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-medium mb-6 backdrop-blur-xl shadow-lg shadow-indigo-500/10 group cursor-pointer hover:border-indigo-400/60 transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white">TeamFlow 2.0</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300 group-hover:text-white transition-colors">
              The Deterministic Workspace OS
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.06] mb-6">
            Orchestrate your team with{" "}
            <span className="text-gradient-accent animate-shimmer inline-block">
              effortless momentum.
            </span>
          </h1>

          {/* Subtext Description */}
          <p className="text-zinc-300 text-lg sm:text-xl font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
            Eliminate chaotic Slack threads, lost Jira tickets, and meeting fatigue.
            TeamFlow gives admins deterministic delegation authority while keeping
            employees focused on delivering peak sprint velocity.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
            {isAuthenticated ? (
              <button
                onClick={() =>
                  navigate(user?.role === "admin" ? "/admin" : "/employee")
                }
                className="w-full sm:w-auto btn-primary-gradient px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-indigo-600/30 group hover:shadow-indigo-500/50"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register-company")}
                  className="w-full sm:w-auto btn-primary-gradient px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-indigo-600/30 group hover:shadow-indigo-500/50"
                >
                  <span>Register Workspace Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const demo = document.getElementById("demo");
                    if (demo) demo.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto btn-secondary-ghost px-7 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                    ▶
                  </span>
                  <span>Interactive Sandbox</span>
                </button>
              </>
            )}
          </div>

          {/* Social Proof & Rating Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 pb-6 text-xs text-zinc-400">
            <div className="flex -space-x-2">
              {["JD", "SK", "AL", "MR", "TC"].map((initials, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 border-2 border-[#090e1c] flex items-center justify-center text-[10px] font-bold text-white shadow"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <span className="font-semibold text-white">4.9/5</span>
              <span>from 2,500+ fast-scaling engineering teams</span>
            </div>
          </div>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
            <div>
              <div className="font-display font-extrabold text-2xl text-white">100%</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Role Segregation</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-white">0s</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Setup Delay</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-white">Real-Time</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Audit Trail</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Product Canvas & Interactive Holographic Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative flex items-center justify-center min-h-125 sm:min-h-135"
        >
          {/* 3D Three.js Starfield & Hologram in Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Suspense fallback={null}>
              <Hero3DCanvas />
            </Suspense>
          </div>

          {/* Interactive Console Deck (Foreground) */}
          <div className="relative z-10 w-full pointer-events-auto">
            <InteractiveHeroConsole />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST INDICATORS / CREDIBILITY SECTION
═══════════════════════════════════════════════════════════════ */

function TrustBar() {
  const metrics = [
    { label: "Active Team Members", value: "10,000+", icon: Users },
    { label: "Task Lifecycle Uptime", value: "99.98%", icon: Shield },
    { label: "Velocity Acceleration", value: "4.2x", icon: Zap },
    { label: "Audit Log Integrity", value: "100%", icon: CheckCircle2 },
  ];

  return (
    <section className="relative py-12 border-y border-white/5 bg-[#080d1a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INTERACTIVE LIVE PRODUCT DEMO SECTION
   Lets visitors switch between Admin & Employee viewpoints
═══════════════════════════════════════════════════════════════ */

function InteractiveDemoSection() {
  const [activePerspective, setActivePerspective] = useState("admin");
  const [taskState, setTaskState] = useState("new"); // "new", "active", "completed"

  return (
    <section id="preview" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
          Interactive Product Showcase
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
          Experience TeamFlow from both sides of the desk.
        </h2>
        <p className="text-zinc-300 text-base sm:text-lg">
          Switch roles below to explore how admins assign and oversee tasks, and how employees accept and resolve them with zero friction.
        </p>

        {/* Role Perspective Switcher */}
        <div className="inline-flex p-1.5 rounded-xl bg-zinc-900/90 border border-white/10 mt-8 shadow-xl">
          <button
            onClick={() => setActivePerspective("admin")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activePerspective === "admin"
                ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin Command Center
          </button>
          <button
            onClick={() => setActivePerspective("employee")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activePerspective === "employee"
                ? "bg-linear-to-r from-cyan-600 to-cyan-700 text-white shadow-md shadow-cyan-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Employee Workspace
          </button>
        </div>
      </div>

      {/* Simulated Interactive Window */}
      <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto">
        {/* Mock Window Title Bar */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 text-xs text-zinc-400 font-mono">
              teamflow.app/{activePerspective}
            </span>
          </div>
          <div className="text-xs text-indigo-300 font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            {activePerspective === "admin" ? "Admin Mode: Delegate & Inspect" : "Employee Mode: Focus & Execute"}
          </div>
        </div>

        {/* Demo Content Body */}
        <div className="p-6 sm:p-8 bg-[#0a0f1d]">
          {activePerspective === "admin" ? (
            /* Admin Interactive Demo View */
            <div className="space-y-6">
              {/* Quick Admin KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-400 font-medium">Total Active Tasks</div>
                  <div className="font-display text-2xl font-bold text-white mt-1">24</div>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-400 font-medium">In Progress</div>
                  <div className="font-display text-2xl font-bold text-amber-400 mt-1">8</div>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-400 font-medium">Completed Today</div>
                  <div className="font-display text-2xl font-bold text-emerald-400 mt-1">15</div>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-400 font-medium">Team Members</div>
                  <div className="font-display text-2xl font-bold text-cyan-400 mt-1">12</div>
                </div>
              </div>

              {/* Task Dispatcher Simulation */}
              <div className="bg-zinc-900/40 p-5 rounded-xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-display font-semibold text-white text-base">
                      Task Assignment Console
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Admins create tasks with priority, deadline, and direct employee assignment.
                    </p>
                  </div>
                  <button className="btn-primary-gradient px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start">
                    <Sparkles className="w-3.5 h-3.5" />
                    + New Task
                  </button>
                </div>

                {/* Simulated Task Row */}
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-lg bg-zinc-800/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          Refactor Redis Session Cache Store
                        </div>
                        <div className="text-xs text-zinc-400">
                          Assigned to: <span className="text-zinc-200">Alex Rivera</span> · Category: Backend
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300 rounded border border-amber-500/20">
                        In Progress
                      </span>
                      <span className="text-xs text-zinc-400">Due Oct 24</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-800/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          Update API Documentation for Webhook Endpoints
                        </div>
                        <div className="text-xs text-zinc-400">
                          Assigned to: <span className="text-zinc-200">Maria Chen</span> · Category: Docs
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/20">
                        Completed
                      </span>
                      <span className="text-xs text-zinc-400">Oct 21</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Employee Interactive Demo View */
            <div className="space-y-6">
              {/* Employee Welcome Banner */}
              <div className="p-4 rounded-xl bg-linear-to-r from-indigo-900/30 to-cyan-900/30 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-cyan-300">Welcome Back, Alex Rivera 👋</div>
                  <h4 className="font-display font-semibold text-white text-lg mt-0.5">
                    You have 1 priority task requiring your action.
                  </h4>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-zinc-400">Today&apos;s Focus</div>
                  <div className="text-sm font-semibold text-white">Backend Reliability</div>
                </div>
              </div>

              {/* Interactive Task Card Simulator */}
              <div className="bg-zinc-900/70 p-6 rounded-xl border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Assigned to You
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-2.5">
                      Configure Production Rate Limiting &amp; CDN Edge Caching
                    </h3>
                    <p className="text-sm text-zinc-300 mt-1 max-w-xl">
                      Protect upstream API services from burst traffic by tuning Redis sliding-window limiters.
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        taskState === "new"
                          ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                          : taskState === "active"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {taskState === "new"
                        ? "New Task"
                        : taskState === "active"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                </div>

                {/* Interactive Action Control */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-zinc-400">
                    Interactive Trial: Click buttons to test task workflow lifecycle.
                  </div>
                  <div className="flex items-center gap-3">
                    {taskState === "new" && (
                      <button
                        onClick={() => setTaskState("active")}
                        className="btn-primary-gradient px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept Task
                      </button>
                    )}
                    {taskState === "active" && (
                      <>
                        <button
                          onClick={() => setTaskState("completed")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Completed
                        </button>
                        <button
                          onClick={() => setTaskState("new")}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg text-xs cursor-pointer"
                        >
                          Reset
                        </button>
                      </>
                    )}
                    {taskState === "completed" && (
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Task Completed Successfully!
                        </span>
                        <button
                          onClick={() => setTaskState("new")}
                          className="text-xs text-zinc-400 underline hover:text-white cursor-pointer ml-2"
                        >
                          Replay Lifecycle
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURES SECTION — Asymmetric Bento Grid
═══════════════════════════════════════════════════════════════ */

function FeaturesSection() {
  const bentoFeatures = [
    {
      icon: Shield,
      title: "Hardened Role-Based Access Control",
      description:
        "Strict boundaries separate Admin and Employee workspaces. Admins govern team composition and task delegation, while employees receive distraction-free dashboards.",
      badge: "Security",
      className: "md:col-span-8",
      accent: "from-indigo-500/20 to-purple-500/5",
    },
    {
      icon: BarChart3,
      title: "Real-Time Velocity Analytics",
      description:
        "Visualize team distribution, completion ratios, and category workloads with integrated Recharts analytics.",
      badge: "Insights",
      className: "md:col-span-4",
      accent: "from-cyan-500/20 to-blue-500/5",
    },
    {
      icon: ListTodo,
      title: "Deterministic Task Lifecycle",
      description:
        "Clear status progression (New → In Progress → Completed or Failed) eliminates ambiguity. Employees accept with one click and admins inspect live progress.",
      badge: "Workflow",
      className: "md:col-span-4",
      accent: "from-emerald-500/20 to-teal-500/5",
    },
    {
      icon: Users,
      title: "Instant Team Provisioning",
      description:
        "Create, toggle, and manage team member access on the fly. Automated password hashing and tokenized JWT authentication ensure enterprise compliance.",
      badge: "Directory",
      className: "md:col-span-4",
      accent: "from-amber-500/20 to-orange-500/5",
    },
    {
      icon: Zap,
      title: "Zero Setup Overhead",
      description:
        "Register your organization and start delegating in under two minutes. No complex configuration, no bloated consultants required.",
      badge: "Speed",
      className: "md:col-span-4",
      accent: "from-violet-500/20 to-pink-500/5",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
          Core Capabilities
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
          Everything modern teams need to move with velocity.
        </h2>
        <p className="text-zinc-300 text-base sm:text-lg">
          Designed from first principles to eliminate administrative friction and give every team member immediate clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {bentoFeatures.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`glass-card rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between ${f.className}`}
            >
              {/* Subtle Gradient Glow */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${f.accent} pointer-events-none opacity-40`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2.5">
                  {f.title}
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-white/5 flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Learn more <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — 4 Simple Steps with Connected Indicators
═══════════════════════════════════════════════════════════════ */

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Register Workspace",
      description: "Admin creates the company workspace with enterprise credentials in 60 seconds.",
      icon: Shield,
    },
    {
      step: "02",
      title: "Provision Team",
      description: "Add engineers, designers, and staff with auto-generated secure credentials.",
      icon: Users,
    },
    {
      step: "03",
      title: "Dispatch Tasks",
      description: "Assign tasks with categories, priorities, due dates, and explicit deliverables.",
      icon: ListTodo,
    },
    {
      step: "04",
      title: "Execute & Deliver",
      description: "Employees accept tasks, progress through execution, and report completion live.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
          Operational Flow
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
          From zero to full visibility in 4 streamlined steps.
        </h2>
        <p className="text-zinc-300 text-base sm:text-lg">
          No training manuals or multi-week onboarding cycles. TeamFlow is intuitive from minute one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-card p-6 rounded-2xl relative flex flex-col justify-between border border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-display font-extrabold text-2xl text-zinc-500/40">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   USE CASES / AUDIENCE BENEFITS
═══════════════════════════════════════════════════════════════ */

function UseCasesSection() {
  const useCases = [
    {
      role: "Engineering & Technical Leads",
      tagline: "Unblock sprints with clear assignees and due dates",
      points: [
        "Eliminate ambiguous task ownership with 1:1 assignee binding",
        "Track high-priority bug fixes and production deployments",
        "Inspect employee task load before assigning additional work",
      ],
      icon: Zap,
    },
    {
      role: "Operations & HR Managers",
      tagline: "Complete oversight of distributed team activity",
      points: [
        "Manage team member accounts and active states in one directory",
        "Instant audit log of all completed, pending, and failed tasks",
        "Maintain organizational security with strictly gated admin roles",
      ],
      icon: Shield,
    },
    {
      role: "Fast-Growing Startups",
      tagline: "Move fast without drowning in enterprise tool bloat",
      points: [
        "Zero configuration required: set up company in seconds",
        "Lightweight interface that doesn't slow down engineering velocity",
        "Role-tailored dashboards so everyone knows what to do today",
      ],
      icon: Layers,
    },
  ];

  return (
    <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
          Tailored Workflows
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
          Built for teams who measure results in output.
        </h2>
        <p className="text-zinc-300 text-base sm:text-lg">
          Whether you are leading a 10-person startup squad or a cross-functional department.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-7 rounded-2xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-1.5">
                  {uc.role}
                </h3>
                <p className="text-xs text-indigo-300 font-medium mb-6">
                  {uc.tagline}
                </p>
                <ul className="space-y-3">
                  {uc.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ ACCORDION SECTION
═══════════════════════════════════════════════════════════════ */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How do Admin and Employee roles differ in TeamFlow?",
      a: "Admins have complete control over workspace creation, employee provisioning, task authoring, and analytics dashboards. Employees have dedicated, distraction-free dashboards showing tasks assigned to them, with capabilities to accept, complete, or flag blocked tasks.",
    },
    {
      q: "Can employees view other employees' tasks or analytics?",
      a: "No. TeamFlow implements strict role-based access control (RBAC). Employees only see tasks delegated specifically to their account, safeguarding team privacy and keeping workers focused on their immediate deliverables.",
    },
    {
      q: "How does an admin onboard employees?",
      a: "Admins navigate to the 'Employees' tab within their dashboard, click 'Add Employee', and enter the team member's name, email, and password. The employee can immediately log in and begin receiving task assignments.",
    },
    {
      q: "What happens when a task is marked as failed or blocked?",
      a: "If an employee marks a task as failed, they are prompted to submit an explanation or reason for the blocker. This updates the task status in the admin's live view, allowing managers to unblock dependencies immediately.",
    },
    {
      q: "Is there any setup fee or credit card required to start?",
      a: "No. You can register your company workspace immediately without a credit card and start managing team tasks instantly.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/5">
      <div className="text-center mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
          Common Questions
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
          Frequently asked questions.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base">
          Everything you need to know about TeamFlow permissions and features.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-xl border border-white/10 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-display font-semibold text-base text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-indigo-400" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FINAL CALL TO ACTION & FOOTER
═══════════════════════════════════════════════════════════════ */

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center border border-indigo-500/30 bg-linear-to-br from-indigo-950/70 via-[#0b1226] to-[#070c18] shadow-2xl shadow-indigo-950/60">
        {/* Glow ambient inside banner */}
        <div className="absolute inset-0 bg-radial-at-c from-indigo-600/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Get Started in Seconds
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Ready to upgrade your team&apos;s execution?
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg mb-8 leading-relaxed">
            Register your company workspace now. Create accounts for your team and watch productivity accelerate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register-company")}
              className="btn-primary-gradient px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-xl shadow-indigo-600/30"
            >
              Register Workspace Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary-ghost px-7 py-4 rounded-xl font-semibold text-base cursor-pointer"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full py-14 border-t border-white/10 bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/5">
          {/* Col 1: Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 cursor-pointer select-none mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                <img
                  src="/TeamFlow_logo.png"
                  alt="TeamFlow"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <span className="font-display font-bold text-lg text-white">
                TeamFlow
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-4">
              Modern Employee Management System designed for high-velocity teams, clear accountability, and real-time task tracking.
            </p>
            <div className="text-xs text-zinc-400">
              © {new Date().getFullYear()} TeamFlow Inc. All rights reserved.
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-3 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-3 uppercase tracking-wider">
              Portals
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Admin &amp; Employee Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/register-company")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Register Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Password Recovery
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div>Engineered with React 19, Three.js &amp; Tailwind CSS</div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-zinc-200 cursor-pointer transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <InteractiveDemoSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
