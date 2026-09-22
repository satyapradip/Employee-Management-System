import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  Check,
  Zap,
  Shield,
  Users,
  BarChart3,
  Layers,
  ListTodo,
  PlayCircle,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Mail,
  MessageSquare,
  Cpu,
  TrendingUp,
  Bot,
  ExternalLink,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   1. NAVIGATION BAR (Reference 2 Inspired)
   Compact, elegant, centered nav links, news pill, and CTAs
═══════════════════════════════════════════════════════════════ */
function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardRoute = user?.role === "admin" ? "/admin" : "/employee";

  return (
    <header className="sticky top-0 z-40 bg-[#F5F6F7]/90 backdrop-blur-md border-b border-[#E1E5E9]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#101827] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-sm tracking-tight">TF</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-[#15191E] tracking-tight">
                TeamFlow
              </span>
              <span className="text-[10px] text-[#5E6875] font-semibold tracking-wider uppercase -mt-0.5">
                Workforce OS
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#5E6875]">
          <a
            href="#product"
            className="hover:text-[#15191E] transition-colors"
          >
            Product
          </a>
          <a
            href="#simulator"
            className="hover:text-[#15191E] transition-colors"
          >
            Live Demo
          </a>
          <a
            href="#workflow"
            className="hover:text-[#15191E] transition-colors"
          >
            Workflow
          </a>
          <a
            href="#use-cases"
            className="hover:text-[#15191E] transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#faq"
            className="hover:text-[#15191E] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right: News pill + Primary Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Subtle News Pill (as seen in Reference 2) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E1E5E9] text-xs font-medium text-[#5E6875]">
            <span className="text-[11px] font-bold text-[#E76F51] uppercase">NEW</span>
            <span className="text-zinc-300">|</span>
            <span className="text-xs">v2.4 Task AI Deployed</span>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => navigate(dashboardRoute)}
              className="px-4 py-2 text-xs font-semibold bg-[#101827] text-white hover:bg-[#1E293B] rounded-full transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-3.5 py-2 text-xs font-semibold text-[#15191E] hover:text-[#4F46E5] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register-company")}
                className="px-4 py-2 text-xs font-semibold btn-coral rounded-full transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Book Demo / Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#E1E5E9] text-[#15191E] hover:bg-white transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E1E5E9] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <a
            href="#product"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#5E6875] hover:text-[#15191E] py-1.5"
          >
            Product
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#5E6875] hover:text-[#15191E] py-1.5"
          >
            Live Demo
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#5E6875] hover:text-[#15191E] py-1.5"
          >
            Workflow
          </a>
          <a
            href="#use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#5E6875] hover:text-[#15191E] py-1.5"
          >
            Use Cases
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#5E6875] hover:text-[#15191E] py-1.5"
          >
            FAQ
          </a>

          <div className="pt-3 border-t border-[#E1E5E9] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full py-2.5 text-center text-xs font-semibold border border-[#E1E5E9] rounded-xl text-[#15191E]"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/register-company");
              }}
              className="w-full py-2.5 text-center text-xs font-semibold btn-coral rounded-xl text-white"
            >
              Register Workspace
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO SECTION (Faithful to Reference Image 2)
   - Left: Coral pill, bold editorial title, short copy, coral CTA
   - Floating widget: TaskBot / Copilot card with ghost layers
   - Right: Minimalist geometric arc track with floating nodes + key stats
═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Subtle Gradient & Grid Accent */}
      <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-137.5 h-137.5 rounded-full arc-track-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy & CTAs (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Coral Pill Tag (exact match to Reference 2: "FROM INBOX TO INVOICE") */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FCE8E2] border border-[#F8D1C5]">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#E76F51]">
                FROM INBOX TO RESOLUTION
              </span>
            </div>

            {/* Bold Editorial Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0F172A] tracking-[-0.035em] leading-[1.06]">
              AI Workforce. <br />
              <span className="text-[#101827]">Built for Modern Teams.</span>
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed font-normal">
              Assign, orchestrate, and complete deliverables across sprints, employees, and teams
              so your leadership operates at peak velocity with zero bottlenecks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/register-company")}
                className="px-7 py-3.5 btn-coral rounded-xl text-sm font-bold shadow-md cursor-pointer flex items-center gap-2 group"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3.5 btn-secondary rounded-xl text-sm font-semibold cursor-pointer"
              >
                Enter Portal
              </button>
            </div>

            {/* Floating Product Widget Preview (Reference 2: SalesBot / TaskBot Widget with ghost layers) */}
            <div className="pt-8">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                YOUR AI TEAM
              </span>
              <div className="relative inline-block max-w-sm">
                {/* Ghost Card Behind */}
                <div className="absolute -top-3 -left-3 right-3 bottom-3 bg-white/70 border border-[#E1E5E9] rounded-2xl -z-10 shadow-xs rotate-[-1.5deg]" />

                {/* Primary Floating Widget Card */}
                <div className="bg-white border border-[#E1E5E9] rounded-2xl p-5 shadow-lg shadow-black/4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      WORKFLOW COPILOT
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed mb-3">
                    Assists leadership with automated task dispatch, employee velocity tracking, and blocker resolutions.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] font-semibold text-[#475569]">
                      DELEGATION
                    </span>
                    <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] font-semibold text-[#475569]">
                      ROUTING
                    </span>
                    <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] font-semibold text-[#475569]">
                      SPRINTS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Geometric Arc with Dedicated Floating Stats (6 Cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-105 lg:min-h-125">
            <div className="relative w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10">
              {/* Left: Sweeping Geometric Arc Track */}
              <div className="relative w-64 sm:w-76 h-64 sm:h-76 shrink-0 flex items-center justify-center">
                {/* Ambient soft glow */}
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500/10 via-slate-100 to-transparent blur-xl pointer-events-none" />

                {/* SVG Arc Geometry */}
                <svg
                  className="w-full h-full text-[#CBD2D9]/40"
                  viewBox="0 0 320 320"
                  fill="none"
                >
                  {/* Subtle outer dashed orbit */}
                  <circle
                    cx="160"
                    cy="160"
                    r="142"
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  {/* Thick background track */}
                  <circle
                    cx="160"
                    cy="160"
                    r="115"
                    stroke="#E2E8F0"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  {/* Active accent arc */}
                  <path
                    d="M 160 45 A 115 115 0 0 1 275 160"
                    stroke="#4F46E5"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="3 5"
                  />
                </svg>

                {/* Floating Node 1: Top along the track */}
                <div className="absolute top-1 left-1/3 -translate-x-1/2 bg-[#3730A3] text-white p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-indigo-950/20 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Floating Node 2: Left-center along the track */}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 bg-[#1E293B] text-white p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-black/20 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Floating Node 3: Bottom along the track */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-black/30 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#34D399]" />
                </div>

                {/* Floating Node 4: Top-Right accent */}
                <div className="absolute top-6 right-6 bg-[#E76F51] text-white p-2 sm:p-2.5 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                {/* Center Floating Core Hub */}
                <div className="absolute bg-white border border-[#E1E5E9] p-4 sm:p-5 rounded-2xl shadow-lg shadow-slate-900/5 text-center min-w-[130px]">
                  <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] block tracking-tight">TeamFlow</span>
                  <span className="text-[10px] text-[#64748B] font-medium block">Core Engine</span>
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-semibold text-emerald-600 border border-emerald-200">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>
              </div>

              {/* Right: Key Floating Metrics (Zero Overlap with Dedicated Breathing Room) */}
              <div className="flex flex-row sm:flex-col justify-around sm:justify-center gap-6 sm:gap-7 shrink-0 text-center sm:text-left w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#E2E8F0] sm:pl-8">
                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[#0F172A] tracking-[-0.035em]">
                    100%
                  </div>
                  <div className="text-xs font-semibold text-[#64748B] tracking-wide mt-0.5">
                    On-Time Delivery
                  </div>
                </div>

                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[#0F172A] tracking-[-0.035em]">
                    3.8x
                  </div>
                  <div className="text-xs font-semibold text-[#64748B] tracking-wide mt-0.5">
                    Sprint Velocity
                  </div>
                </div>

                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[#0F172A] tracking-[-0.035em]">
                    10x
                  </div>
                  <div className="text-xs font-semibold text-[#64748B] tracking-wide mt-0.5">
                    Task Visibility
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. PRODUCT CAPABILITIES & INTERACTIVE TASK SIMULATOR
   Allows visitors to test real deliverable filtering and review live task cards
═══════════════════════════════════════════════════════════════ */
const DEMO_TASKS = [
  {
    id: 1,
    title: "Implement OAuth 2.0 Auth Callback",
    category: "Security",
    priority: "High",
    assignedTo: "Sarah Jenkins",
    dueDate: "Tomorrow",
    status: "in-progress",
    description: "Finalize PKCE code exchange verification and secure session cookie storage.",
  },
  {
    id: 2,
    title: "Optimize PostgreSQL Indexing for Sprints",
    category: "Database",
    priority: "Medium",
    assignedTo: "David Chen",
    dueDate: "In 3 days",
    status: "new",
    description: "Add composite index on company_id and task_status to decrease telemetry query latency.",
  },
  {
    id: 3,
    title: "Deploy Automated CI/CD Release Pipeline",
    category: "DevOps",
    priority: "High",
    assignedTo: "Alex Rivera",
    dueDate: "Delivered",
    status: "completed",
    description: "Automated end-to-end linting, container build, and rolling production deployment.",
  },
  {
    id: 4,
    title: "Resolve Mobile Navigation Drawer Overflow",
    category: "Frontend",
    priority: "Low",
    assignedTo: "Elena Rostova",
    dueDate: "Yesterday",
    status: "failed",
    description: "Flagged blocker: iOS Safari safe area padding requires custom clamp constraint.",
  },
];

function InteractiveDemoSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTasks = DEMO_TASKS.filter((t) => {
    if (activeFilter === "all") return true;
    return t.status === activeFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="badge-success px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Completed</span>;
      case "in-progress":
        return <span className="badge-warning px-2.5 py-0.5 rounded-full text-[11px] font-semibold">In Progress</span>;
      case "failed":
        return <span className="badge-error px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Blocked</span>;
      default:
        return <span className="badge-indigo px-2.5 py-0.5 rounded-full text-[11px] font-semibold">New</span>;
    }
  };

  return (
    <section id="simulator" className="py-20 bg-white border-y border-[#E1E5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEF2FF] border border-[#E0E7FF] text-xs font-semibold text-[#3730A3] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            INTERACTIVE PREVIEW
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#15191E] tracking-tight">
            How Tasks Flow Through TeamFlow
          </h2>
          <p className="text-sm sm:text-base text-[#5E6875] mt-2">
            Try the interactive deliverable selector below to explore how priorities, categories, and statuses are structured.
          </p>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {["all", "new", "in-progress", "completed", "failed"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f
                  ? "bg-[#101827] text-white shadow-xs"
                  : "bg-[#F5F6F7] text-[#5E6875] hover:text-[#15191E] border border-[#E1E5E9]"
              }`}
            >
              {f === "all" ? "All Tasks" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="saas-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold text-[#87909B] uppercase tracking-wider">
                    {task.category}
                  </span>
                  {getStatusBadge(task.status)}
                </div>

                <h3 className="font-display font-bold text-base text-[#15191E] mb-1.5">
                  {task.title}
                </h3>
                <p className="text-xs text-[#5E6875] leading-relaxed mb-4">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E1E5E9] flex items-center justify-between text-xs text-[#5E6875]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#101827] text-white text-[9px] font-bold flex items-center justify-center">
                    {task.assignedTo.charAt(0)}
                  </div>
                  <span className="font-medium text-[#15191E]">{task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#87909B]" />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. PRODUCT CAPABILITIES & ARCHITECTURE FEATURES
═══════════════════════════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Granular Role Governance",
      description: "Strict isolation between Administrator controls (delegation, team management, metrics) and Employee execution portals.",
      color: "bg-[#EEF2FF] text-[#3730A3]",
    },
    {
      icon: ListTodo,
      title: "Sprint & Task Pipeline",
      description: "Manage priority-ranked deliverables with instant status transitions: new assignments, active execution, resolution, or blockers.",
      color: "bg-[#FCE8E2] text-[#E76F51]",
    },
    {
      icon: BarChart3,
      title: "Real-Time Telemetry & Charts",
      description: "Interactive visual analytics powered by Recharts: track completion ratios, category breakdown, and team sprint velocity.",
      color: "bg-[#E1F4F1] text-[#0F766E]",
    },
    {
      icon: Bot,
      title: "Integrated AI Workspace Copilot",
      description: "Live Gemini 3.6 Flash assistant directly embedded to draft specifications, solve architectural queries, and generate JSON deliverables.",
      color: "bg-[#F3E8FF] text-[#7E22CE]",
    },
    {
      icon: Users,
      title: "Staff & Credential Provisioning",
      description: "Easily add team members, reset security credentials, and toggle account activations with instant audit safety.",
      color: "bg-[#FEF3C7] text-[#B45309]",
    },
    {
      icon: Zap,
      title: "Rapid Execution Velocity",
      description: "Zero bloat, sub-100ms API responses, responsive layouts from phone to 4K monitor, and production-tested state management.",
      color: "bg-[#DCFCE7] text-[#15803D]",
    },
  ];

  return (
    <section id="product" className="py-20 bg-[#F5F6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E1E5E9] text-xs font-semibold text-[#15191E] mb-3">
            CAPABILITIES
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#15191E] tracking-tight">
            Engineered for High-Trust Enterprise Workflows
          </h2>
          <p className="text-sm sm:text-base text-[#5E6875] mt-2">
            Every feature is designed with intention to simplify administration and maximize individual execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="saas-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl ${feat.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#15191E] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6875] leading-relaxed">
                    {feat.description}
                  </p>
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
   5. WORKFLOW SECTION: 3-STEP JOURNEY
═══════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Register Your Workspace",
      desc: "Provision your company workspace in seconds. Automatically establishes encrypted administrative credentials and workspace isolation.",
    },
    {
      num: "02",
      title: "Provision Staff & Dispatch Tasks",
      desc: "Add team members, assign prioritized deliverables with due dates and tags, or use FlowAI to draft technical requirements.",
    },
    {
      num: "03",
      title: "Execute & Measure Throughput",
      desc: "Staff accept and mark deliverables in real time. Leadership monitors aggregated completion charts and sprint health telemetry.",
    },
  ];

  return (
    <section id="workflow" className="py-20 bg-white border-b border-[#E1E5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FCE8E2] border border-[#F8D1C5] text-xs font-semibold text-[#E76F51] mb-3">
            THE PROCESS
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#15191E] tracking-tight">
            Simple 3-Step Workspace Rollout
          </h2>
          <p className="text-sm sm:text-base text-[#5E6875] mt-2">
            No complex installations or weeks of training. Designed for instant productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#F8FAFC] border border-[#E1E5E9] rounded-2xl p-7 relative"
            >
              <div className="font-display font-black text-4xl text-[#CBD2D9] mb-4">
                {step.num}
              </div>
              <h3 className="font-display font-bold text-lg text-[#15191E] mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6875] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. USE CASES SECTION
═══════════════════════════════════════════════════════════════ */
function UseCasesSection() {
  const useCases = [
    {
      title: "Engineering & Dev Teams",
      desc: "Track critical releases, bug remediation, security patches, and database migrations with clear technical categories.",
    },
    {
      title: "Operations & Logistics",
      desc: "Assign time-sensitive inventory workflows, vendor onboarding, and dispatch tasks with automated status tracking.",
    },
    {
      title: "Product & Design Studios",
      desc: "Govern user experience sprints, stakeholder sign-offs, and multi-disciplinary deliverable queues without chaos.",
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-[#F5F6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E1E5E9] text-xs font-semibold text-[#15191E] mb-3">
            SOLUTIONS
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#15191E] tracking-tight">
            Built for Modern High-Growth Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc) => (
            <div key={uc.title} className="saas-card p-6 bg-white">
              <h3 className="font-display font-bold text-base text-[#15191E] mb-2">
                {uc.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6875] leading-relaxed">
                {uc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. ACCESSIBLE FAQ ACCORDION SECTION
═══════════════════════════════════════════════════════════════ */
function FAQSection() {
  const faqs = [
    {
      q: "How does role-based access control work?",
      a: "TeamFlow provides dedicated authentication portals for Administrators and Employees. Administrators manage tasks, provision staff, and view aggregated analytics. Employees only view and update tasks assigned to their personal queue.",
    },
    {
      q: "Can I manage employees across multiple departments?",
      a: "Yes. Tasks support customizable categories such as Frontend, Backend, Database, Security, DevOps, and Operations to seamlessly segment responsibilities.",
    },
    {
      q: "What task statuses are supported?",
      a: "Tasks follow a strict, auditable lifecycle: 'New' (awaiting review), 'In Progress' (accepted by employee), 'Completed' (successfully delivered), and 'Failed/Blocked' (with a documented reason for leadership review).",
    },
    {
      q: "How does the integrated FlowAI assistant help?",
      a: "FlowAI is a built-in copilot powered by Gemini that answers technical queries, drafts standardized JSON task specs with acceptance criteria, and provides advice on sprint velocity.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 bg-white border-t border-[#E1E5E9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F5F6F7] border border-[#E1E5E9] text-xs font-semibold text-[#15191E] mb-3">
            QUESTIONS &amp; ANSWERS
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#15191E] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="border border-[#E1E5E9] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-[#15191E]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#87909B] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#15191E]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5E6875] leading-relaxed bg-white border-t border-[#E1E5E9]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. FINAL CALL TO ACTION (Dark Navy contrast banner)
═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#101827] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
          Ready to Elevate Your Team’s Execution?
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto mb-8 leading-relaxed">
          Join modern teams using TeamFlow to delegate deliverables, track velocity, and maintain absolute operational clarity.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/register-company")}
            className="px-8 py-3.5 btn-coral rounded-xl text-sm font-bold shadow-lg cursor-pointer"
          >
            Register Workspace Now
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all cursor-pointer"
          >
            Sign In to Existing Portal
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. COMPREHENSIVE FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-[#E1E5E9] py-12 text-xs text-[#5E6875]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#101827] flex items-center justify-center text-white text-xs font-bold">
                TF
              </div>
              <span className="font-display font-bold text-sm text-[#15191E]">TeamFlow</span>
            </div>
            <p className="text-xs text-[#5E6875] leading-relaxed">
              Enterprise Employee Management System for high-velocity collaboration, delegation, and sprint telemetry.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-xs text-[#15191E] uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="#product" className="hover:text-[#15191E] transition-colors">Task Routing</a></li>
              <li><a href="#simulator" className="hover:text-[#15191E] transition-colors">Live Simulation</a></li>
              <li><a href="#workflow" className="hover:text-[#15191E] transition-colors">Workflow</a></li>
              <li><a href="#use-cases" className="hover:text-[#15191E] transition-colors">Solutions</a></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-semibold text-xs text-[#15191E] uppercase tracking-wider mb-3">
              Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="hover:text-[#15191E] transition-colors cursor-pointer text-left"
                >
                  Admin &amp; Employee Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/register-company")}
                  className="hover:text-[#15191E] transition-colors cursor-pointer text-left"
                >
                  Register Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="hover:text-[#15191E] transition-colors cursor-pointer text-left"
                >
                  Password Recovery
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Tech */}
          <div>
            <h4 className="font-semibold text-xs text-[#15191E] uppercase tracking-wider mb-3">
              Technology
            </h4>
            <p className="leading-relaxed">
              Engineered with React 19, Vite, Tailwind CSS 4, and Recharts. Built for enterprise reliability and speed.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E1E5E9] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#87909B]">
          <div>&copy; {new Date().getFullYear()} TeamFlow Technologies. All rights reserved.</div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[#15191E] transition-colors cursor-pointer"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE EXPORT
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#15191E]">
      <Navbar />
      <main>
        <HeroSection />
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
