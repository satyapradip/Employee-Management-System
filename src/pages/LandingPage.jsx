import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Stars, Torus } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   MOUSE PARALLAX HOOK — shared across Three.js scene components
═══════════════════════════════════════════════════════════════ */
function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return mouse;
}

/* ═══════════════════════════════════════════════════════════════
   CENTRAL ENERGY ORB — large glowing icosahedron with distort
═══════════════════════════════════════════════════════════════ */
function CentralOrb() {
  const outerRef = useRef();
  const wireRef  = useRef();
  const coreRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.12;
      outerRef.current.rotation.x = t * 0.07;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y  = -t * 0.08;
      wireRef.current.rotation.z  =  t * 0.05;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y  =  t * 0.25;
    }
  });

  return (
    <group>
      {/* Soft inner core — pure glow */}
      <mesh ref={coreRef} scale={0.7}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#6d28d9"
          emissiveIntensity={3.5}
          transparent
          opacity={0.55}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>

      {/* Primary distorted sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.55, 4]} />
        <MeshDistortMaterial
          color="#4338ca"
          emissive="#7c3aed"
          emissiveIntensity={1.8}
          distort={0.42}
          speed={2.2}
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Wireframe geodesic shell */}
      <mesh ref={wireRef} scale={1.28}>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Outer haze glow sphere */}
      <mesh scale={1.55}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORBITAL ENERGY RINGS
═══════════════════════════════════════════════════════════════ */
function EnergyRings() {
  const rings = [
    { args: [2.6, 0.012, 128], tilt: [Math.PI / 5, 0, 0],  speed:  0.22, color: "#818cf8", opacity: 0.55 },
    { args: [3.1, 0.008, 128], tilt: [Math.PI / 2.5, Math.PI / 6, 0], speed: -0.14, color: "#34d399", opacity: 0.40 },
    { args: [3.6, 0.006, 128], tilt: [Math.PI / 3.5, Math.PI / 4, 0], speed:  0.10, color: "#a78bfa", opacity: 0.30 },
    { args: [2.2, 0.015, 128], tilt: [-Math.PI / 6, Math.PI / 3, 0], speed: -0.30, color: "#67e8f9", opacity: 0.50 },
  ];

  return (
    <>
      {rings.map((r, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const ref = useRef();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useFrame(({ clock }) => {
          if (ref.current) ref.current.rotation.z = clock.elapsedTime * r.speed;
        });
        return (
          <group key={i} rotation={r.tilt}>
            <Torus ref={ref} args={r.args}>
              <meshStandardMaterial
                color={r.color}
                emissive={r.color}
                emissiveIntensity={2.5}
                transparent
                opacity={r.opacity}
                roughness={0}
                metalness={1}
              />
            </Torus>
          </group>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEURAL NETWORK PARTICLE FIELD — pre-calculated, static topology
═══════════════════════════════════════════════════════════════ */
function NeuralNetwork() {
  const networkRef = useRef();

  // Build particles in a spherical shell (radius 2.8–5.0)
  const { dotPositions, linePositions } = useMemo(() => {
    const COUNT = 140;
    const THRESHOLD = 1.8;

    const pts = [];
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2.8 + Math.random() * 2.2;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    // Dot positions
    const dotArr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      dotArr[i * 3]     = p.x;
      dotArr[i * 3 + 1] = p.y;
      dotArr[i * 3 + 2] = p.z;
    });

    // Line segments between nearby pairs
    const lineArr = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < THRESHOLD) {
          lineArr.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }

    return {
      dotPositions:  dotArr,
      linePositions: new Float32Array(lineArr),
    };
  }, []);

  useFrame(({ clock }) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = clock.elapsedTime * 0.04;
      networkRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.025) * 0.08;
    }
  });

  return (
    <group ref={networkRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.18} />
      </lineSegments>

      {/* Node dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dotPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#a5b4fc"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING ACCENT POLYHEDRA
═══════════════════════════════════════════════════════════════ */
function AccentShapes() {
  const shapes = useMemo(() => [
    { pos: [ 4.2,  1.8, -1.2], color: "#67e8f9", size: 0.18, speed: 0.7 },
    { pos: [-4.5, -1.5,  0.8], color: "#a78bfa", size: 0.22, speed: 0.5 },
    { pos: [ 3.8, -3.0,  1.5], color: "#34d399", size: 0.15, speed: 0.9 },
    { pos: [-3.2,  3.2, -0.8], color: "#fbbf24", size: 0.12, speed: 1.1 },
    { pos: [ 1.2,  4.5,  1.0], color: "#f472b6", size: 0.16, speed: 0.8 },
    { pos: [-1.5, -4.2, -1.0], color: "#818cf8", size: 0.2,  speed: 0.6 },
  ], []);

  return (
    <>
      {shapes.map((s, i) => (
        <Float key={i} speed={s.speed} floatIntensity={1.5} rotationIntensity={0.6}>
          <mesh position={s.pos}>
            <octahedronGeometry args={[s.size, 0]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={2.0}
              roughness={0.1}
              metalness={0.5}
              wireframe={i % 2 === 0}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED POINT LIGHTS — orbit around the core
═══════════════════════════════════════════════════════════════ */
function OrbitingLights() {
  const light1 = useRef();
  const light2 = useRef();
  const light3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const R = 4;
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.5) * R;
      light1.current.position.z = Math.cos(t * 0.5) * R;
      light1.current.position.y = Math.sin(t * 0.3) * 2;
    }
    if (light2.current) {
      light2.current.position.x = Math.sin(t * 0.4 + Math.PI) * R;
      light2.current.position.z = Math.cos(t * 0.4 + Math.PI) * R;
      light2.current.position.y = Math.cos(t * 0.35) * 2;
    }
    if (light3.current) {
      light3.current.position.x = Math.cos(t * 0.3) * R * 0.7;
      light3.current.position.y = Math.sin(t * 0.45) * R;
      light3.current.position.z = Math.cos(t * 0.45) * R * 0.7;
    }
  });

  return (
    <>
      <pointLight ref={light1} color="#818cf8" intensity={6} distance={12} />
      <pointLight ref={light2} color="#34d399" intensity={4} distance={12} />
      <pointLight ref={light3} color="#f472b6" intensity={3} distance={10} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOUSE-REACTIVE SCENE WRAPPER
═══════════════════════════════════════════════════════════════ */
function MouseScene({ children }) {
  const groupRef = useRef();
  const mouse = useMouseParallax();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.18,
        0.035
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.18,
        0.035
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════════════
   BREATHING RING PULSE — large atmospheric ring
═══════════════════════════════════════════════════════════════ */
function PulseRing() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const s = 1 + Math.sin(t * 0.8) * 0.06;
    if (ref.current) {
      ref.current.scale.set(s, s, s);
      ref.current.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.04;
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[5.5, 0.04, 16, 128]} />
      <meshBasicMaterial color="#818cf8" transparent opacity={0.08} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL THREE.JS SCENE
═══════════════════════════════════════════════════════════════ */
function AntigravityScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 52 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.35} color="#1e1b4b" />
      <pointLight position={[0, 0, 6]}  color="#c7d2fe" intensity={1.2} />
      <OrbitingLights />

      {/* Background star field */}
      <Stars
        radius={22}
        depth={60}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Mouse-reactive wrapper */}
      <MouseScene>
        <NeuralNetwork />
        <EnergyRings />
        <CentralOrb />
        <AccentShapes />
        <PulseRing />
      </MouseScene>
    </Canvas>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
function Navbar() {
  const navigate   = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const navLinks = [
    { id: "features",     label: "Features"      },
    { id: "how-it-works", label: "How it works"  },
    { id: "about",        label: "About"         },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl pointer-events-none"
      >
        <div
          className="pointer-events-auto flex justify-between items-center h-16 px-6 md:px-8 rounded-full border transition-all duration-500"
          style={{
            background:  scrolled ? "rgba(11,19,38,0.88)" : "rgba(11,19,38,0.35)",
            backdropFilter: "blur(24px)",
            borderColor: scrolled ? "rgba(129,140,248,0.18)" : "rgba(255,255,255,0.08)",
            boxShadow:   scrolled
              ? "0 8px 32px -8px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "none",
          }}
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}
            >
              <span
                className="material-symbols-outlined text-white text-xl leading-none"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
              >
                groups
              </span>
            </div>
            <div>
              <div className="font-bold tracking-tight leading-none" style={{ fontFamily: "Hanken Grotesk", fontSize: 20, color: "#e0e7ff" }}>
                TeamFlow
              </div>
              <div className="text-[9px] tracking-[0.12em] uppercase mt-0.5 hidden md:block" style={{ fontFamily: "Geist", color: "rgba(199,210,254,0.4)" }}>
                Manage &amp; Flow
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium" style={{ color: "rgba(199,210,254,0.65)" }}>
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 transition-colors cursor-pointer"
              style={{ color: "rgba(199,210,254,0.65)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate(user?.role === "admin" ? "/admin" : "/employee")}
                className="px-5 py-2 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.45)",
                }}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:block text-sm font-medium transition-colors duration-200 cursor-pointer"
                  style={{ color: "rgba(199,210,254,0.65)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(199,210,254,0.65)"; }}
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register-company")}
                  className="px-5 py-2 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.45)",
                  }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,   scale: 1      }}
          exit={{    opacity: 0, y: -12, scale: 0.96   }}
          transition={{ duration: 0.2 }}
          className="fixed top-[88px] left-4 right-4 z-40 md:hidden rounded-2xl overflow-hidden"
          style={{
            background: "rgba(11,19,38,0.96)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(99,102,241,0.2)",
            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-4 py-3 text-left rounded-xl text-sm font-medium transition-all cursor-pointer"
                style={{ color: "rgba(199,210,254,0.75)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(199,210,254,0.75)"; }}
              >
                {label}
              </button>
            ))}
            <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <button
              onClick={() => { navigate("/login"); setMobileOpen(false); }}
              className="px-4 py-3 text-left text-sm font-medium rounded-xl transition-all cursor-pointer"
              style={{ color: "rgba(199,210,254,0.75)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(199,210,254,0.75)"; }}
            >
              Sign in
            </button>
            <button
              onClick={() => { navigate("/register-company"); setMobileOpen(false); }}
              className="px-4 py-3 text-center text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Get Started →
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative w-full" style={{ minHeight: "100vh", overflow: "hidden" }}>

      {/* ── Full-viewport Three.js canvas ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <AntigravityScene />
        </Suspense>
      </div>

      {/* ── Layered depth gradients ── */}
      {/* Vignette around edges */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(11,19,38,0.75) 100%)",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: 220,
          background: "linear-gradient(to bottom, transparent, #0b1326)",
        }}
      />
      {/* Top fade behind navbar */}
      <div
        className="absolute top-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: 120,
          background: "linear-gradient(to bottom, rgba(11,19,38,0.6), transparent)",
        }}
      />

      {/* ── Hero content ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-5 md:px-8 pt-28 pb-20"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1,  y:   0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full relative overflow-hidden cursor-default"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
            border: "1px solid rgba(99,102,241,0.35)",
            boxShadow: "0 0 30px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ["-100%", "300%"] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear", repeatDelay: 1 }}
            className="absolute inset-y-0 w-1/3 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
          />
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#34d399" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#34d399" }} />
          </span>
          <span className="text-xs font-medium relative" style={{ color: "rgba(199,210,254,0.9)", fontFamily: "Inter" }}>
            Role-based access &nbsp;·&nbsp; Admins &amp; Employees
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold relative"
            style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc", fontFamily: "Geist", letterSpacing: "0.08em" }}
          >
            LIVE
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1,  y:  0 }}
          transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl tracking-tight mb-6"
          style={{
            fontFamily: "Hanken Grotesk",
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            color: "#fff",
            textShadow: "0 0 100px rgba(99,102,241,0.35)",
          }}
        >
          Manage your team
          <br className="hidden md:block" />
          <span
            style={{
              background: "linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 30%, #67e8f9 65%, #6ee7b7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            with confidence.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1,  y:  0 }}
          transition={{ delay: 0.46, duration: 0.8 }}
          className="max-w-2xl mb-10 leading-relaxed"
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(16px, 2.2vw, 19px)",
            color: "rgba(199,210,254,0.72)",
          }}
        >
          The all-in-one platform for{" "}
          <span style={{ color: "#e0e7ff", fontWeight: 500 }}>employee management</span>,{" "}
          <span style={{ color: "#e0e7ff", fontWeight: 500 }}>task tracking</span>, and{" "}
          <span style={{ color: "#a5b4fc", fontWeight: 500 }}>team analytics</span>.
          {" "}Built for modern teams that move fast.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1,  y:  0 }}
          transition={{ delay: 0.58, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mb-14"
        >
          {isAuthenticated ? (
            <button
              onClick={() => navigate(user?.role === "admin" ? "/admin" : "/employee")}
              className="group flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
                backgroundSize: "200% 200%",
                boxShadow: "0 0 40px rgba(99,102,241,0.45), 0 4px 24px rgba(139,92,246,0.35)",
                fontFamily: "Inter",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,0.65), 0 8px 32px rgba(139,92,246,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.45), 0 4px 24px rgba(139,92,246,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Go to Dashboard
              <span className="material-symbols-outlined text-base leading-none group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/register-company")}
                className="group flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
                  boxShadow: "0 0 40px rgba(99,102,241,0.45), 0 4px 24px rgba(139,92,246,0.35)",
                  fontFamily: "Inter",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,0.65), 0 8px 32px rgba(139,92,246,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.45), 0 4px 24px rgba(139,92,246,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Register as Admin
                <span className="material-symbols-outlined text-base leading-none group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 px-9 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  backdropFilter: "blur(12px)",
                  fontFamily: "Inter",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Sign in
              </button>
            </>
          )}
        </motion.div>

        {/* Role chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: "shield_person", label: "Admin Portal",    sub: "Full control",       color: "#a5b4fc", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.25)",  glow: "rgba(99,102,241,0.5)" },
            { icon: "person",        label: "Employee Access", sub: "Tasks & progress",   color: "#67e8f9", bg: "rgba(6,182,212,0.10)",   border: "rgba(6,182,212,0.22)",   glow: "rgba(6,182,212,0.5)"  },
            { icon: "monitoring",    label: "Live Analytics",  sub: "Real-time insights", color: "#6ee7b7", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.22)",  glow: "rgba(52,211,153,0.5)" },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl cursor-default transition-all duration-300"
              style={{
                background: chip.bg,
                border: `1px solid ${chip.border}`,
                backdropFilter: "blur(16px)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${chip.glow}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${chip.color}22` }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, color: chip.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {chip.icon}
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold" style={{ color: "#e0e7ff", fontFamily: "Hanken Grotesk" }}>
                  {chip.label}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(199,210,254,0.45)", fontFamily: "Inter" }}>
                  {chip.sub}
                </div>
              </div>
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: chip.color, boxShadow: `0 0 8px ${chip.color}` }}
              />
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(165,180,252,0.35)", fontFamily: "Geist" }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full flex items-start justify-center p-1.5"
            style={{ border: "1px solid rgba(99,102,241,0.35)" }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ background: "linear-gradient(to bottom, #818cf8, #67e8f9)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURES SECTION
═══════════════════════════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    { icon: "admin_panel_settings", color: "#a5b4fc", title: "Role-Based Access",      description: "Admin and employee roles with secure permissions. Admins manage teams; employees focus on tasks."   },
    { icon: "monitoring",           color: "#c4b5fd", title: "Live Analytics",          description: "Real-time dashboards with employee performance and task completion metrics."                            },
    { icon: "notifications_active", color: "#67e8f9", title: "Smart Notifications",     description: "Automated email alerts for assignments, completions, and deadlines."                                   },
    { icon: "task_alt",             color: "#a5b4fc", title: "Task Management",         description: "Create, assign, and track tasks with priorities, categories, and due dates."                           },
    { icon: "bolt",                 color: "#fbbf24", title: "Lightning Fast",           description: "Built with React and Node.js for instant response times and smooth UX."                               },
    { icon: "dashboard_customize",  color: "#6ee7b7", title: "Modern Interface",        description: "Clean, intuitive UI with smooth animations and a beautiful dark theme."                               },
  ];

  return (
    <section id="features" className="py-28 md:py-40 px-5 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <span className="block mb-4 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "Geist", color: "#818cf8", letterSpacing: "0.12em" }}>
          Features
        </span>
        <h2 className="max-w-2xl mx-auto mb-4" style={{ fontFamily: "Hanken Grotesk", fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 700, lineHeight: 1.2, color: "#e0e7ff" }}>
          Everything you need to manage your team
        </h2>
        <p className="max-w-2xl mx-auto" style={{ fontFamily: "Inter", fontSize: 17, color: "rgba(199,210,254,0.65)", lineHeight: 1.7 }}>
          Powerful tools designed for modern teams that want to move fast and stay organized.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.6 }}
            className="group p-7 rounded-2xl transition-all duration-400 hover:-translate-y-1.5 cursor-default"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${f.color}40`; e.currentTarget.style.boxShadow = `0 8px 32px ${f.color}18`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
              style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: f.color, fontVariationSettings: "'FILL' 1" }}>
                {f.icon}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "Hanken Grotesk", color: "#e0e7ff" }}>
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "Inter", color: "rgba(199,210,254,0.55)" }}>
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  const navigate = useNavigate();
  const steps = [
    { icon: "person_add",  color: "#a5b4fc", step: "01", title: "Admin registers",    description: "Create your account with your company name. You become the admin of your workspace."                         },
    { icon: "group_add",   color: "#c4b5fd", step: "02", title: "Add employees",      description: "Add your team members from the admin dashboard. They get login credentials automatically."                    },
    { icon: "assignment",  color: "#a5b4fc", step: "03", title: "Assign tasks",       description: "Create and assign tasks to employees with priorities and deadlines. Track everything live."                    },
    { icon: "check_circle",color: "#6ee7b7", step: "04", title: "Employees deliver",  description: "Employees log in to view, accept, and complete their assigned tasks from their dashboard."                    },
  ];

  return (
    <section id="how-it-works" className="py-28 md:py-40 px-5 md:px-8 max-w-7xl mx-auto relative">
      <div className="absolute pointer-events-none inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.05), transparent)" }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <span className="block mb-4 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "Geist", color: "#818cf8", letterSpacing: "0.12em" }}>
          How It Works
        </span>
        <h2 className="max-w-2xl mx-auto mb-4" style={{ fontFamily: "Hanken Grotesk", fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 700, lineHeight: 1.2, color: "#e0e7ff" }}>
          Get started in 4 simple steps
        </h2>
        <p className="max-w-2xl mx-auto" style={{ fontFamily: "Inter", fontSize: 17, color: "rgba(199,210,254,0.65)", lineHeight: 1.7 }}>
          From registration to task completion — here&apos;s how TeamFlow works for your team.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-16 relative z-10">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="flex gap-5 p-6 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${s.color}35`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <div
              className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color, fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ fontFamily: "Geist", color: s.color, letterSpacing: "0.12em" }}>
                Step {s.step}
              </span>
              <h3 className="font-semibold text-lg mb-1.5" style={{ fontFamily: "Hanken Grotesk", color: "#e0e7ff" }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "Inter", color: "rgba(199,210,254,0.55)" }}>
                {s.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center relative z-10"
      >
        <button
          onClick={() => navigate("/register-company")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 0 40px rgba(99,102,241,0.4)",
            fontFamily: "Inter",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "none"; }}
        >
          Register as Admin — It&apos;s free
        </button>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTA SECTION
═══════════════════════════════════════════════════════════════ */
function CTASection() {
  const navigate = useNavigate();
  return (
    <section id="about" className="py-28 md:py-40 px-5 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-20 text-center"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(99,102,241,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 80px rgba(99,102,241,0.08)",
        }}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12), transparent 70%)" }} />
        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), transparent)" }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none" style={{ background: "linear-gradient(315deg, rgba(6,182,212,0.12), transparent)" }} />

        <div className="relative z-10">
          <h2 className="mb-5" style={{ fontFamily: "Hanken Grotesk", fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 700, lineHeight: 1.2, color: "#e0e7ff" }}>
            Ready to transform your team management?
          </h2>
          <p className="max-w-2xl mx-auto mb-10" style={{ fontFamily: "Inter", fontSize: 17, color: "rgba(199,210,254,0.62)", lineHeight: 1.7 }}>
            Sign up as an admin to create your workspace, add employees, and start assigning tasks — all in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register-company")}
              className="px-8 py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 40px rgba(99,102,241,0.4)", fontFamily: "Inter" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "none"; }}
            >
              Get started for free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-2xl text-white font-semibold text-base cursor-pointer transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", fontFamily: "Inter" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "none"; }}
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="w-full py-16 border-t" style={{ background: "#060e20", borderColor: "rgba(99,102,241,0.1)" }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-5 md:px-8 max-w-7xl mx-auto">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <span className="material-symbols-outlined text-white leading-none" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Hanken Grotesk", color: "#a5b4fc" }}>TeamFlow</span>
          </div>
          <p className="text-sm" style={{ fontFamily: "Inter", color: "rgba(199,210,254,0.4)" }}>
            © {new Date().getFullYear()} TeamFlow Inc. All rights reserved.
          </p>
        </div>
        <div className="col-span-1 md:col-span-3 flex justify-start md:justify-end gap-6 md:gap-8 items-center flex-wrap">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((link) => (
            <button
              key={link}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm cursor-pointer transition-colors duration-200"
              style={{ fontFamily: "Inter", color: "rgba(199,210,254,0.4)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#a5b4fc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(199,210,254,0.4)"; }}
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#e0e7ff", overflowX: "hidden" }}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
