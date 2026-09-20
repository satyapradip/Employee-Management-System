import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

/**
 * Knowledge Base & Response Generator for FlowAI Senior Dev Copilot
 */
const generateAIResponse = (userPrompt, pathname, user) => {
  const q = userPrompt.toLowerCase().trim();
  const role = user?.role || "guest";
  const userName = user?.name || "there";

  // 1. Task Generation request
  if (
    q.includes("create task") ||
    q.includes("generate task") ||
    q.includes("draft task") ||
    q.includes("new task") ||
    q.includes("task template")
  ) {
    let title = "Implement Resilient Rate-Limiting & Security Headers";
    let category = "Security";
    let priority = "High";
    let dueDate = "Next Sprint (5 days)";

    if (q.includes("database") || q.includes("postgres") || q.includes("migration") || q.includes("sql")) {
      title = "Execute Zero-Downtime PostgreSQL Schema Migration";
      category = "Database";
      priority = "High";
    } else if (q.includes("frontend") || q.includes("ui") || q.includes("design") || q.includes("react")) {
      title = "Refactor Component Hierarchy & Implement Glassmorphic Tokens";
      category = "Frontend";
      priority = "Medium";
    } else if (q.includes("auth") || q.includes("sso") || q.includes("oauth") || q.includes("jwt")) {
      title = "Harden Multi-Tenant SAML/OIDC SSO & Refresh Token Rotation";
      category = "Security";
      priority = "High";
    }

    return {
      type: "task_draft",
      text: `Here is a production-ready deliverable draft with acceptance criteria tailored for engineering velocity:`,
      task: {
        title,
        category,
        priority,
        dueDate,
        description: `Implement hardened architectural standards for ${title.toLowerCase()}. Ensure strict regression testing, telemetry logging, and zero impact on current active sessions.`,
        acceptanceCriteria: [
          "End-to-end integration tests pass with >90% code coverage.",
          "Role-Based Access Control (RBAC) validations enforced on all endpoints.",
          "Audit telemetry logging integrated with structured JSON output.",
          "Peer review approved by at least one Senior Engineer.",
        ],
      },
      action: role === "admin" ? { label: "Open Task Creator", path: "/admin" } : null,
    };
  }

  // 2. Role & Security Questions
  if (
    q.includes("role") ||
    q.includes("permission") ||
    q.includes("security") ||
    q.includes("admin vs") ||
    q.includes("rbac")
  ) {
    return {
      type: "text",
      text: `### 🛡️ TeamFlow Role-Based Access Control (RBAC) Architecture\n\nTeamFlow enforces **strict role segregation** at both the routing layer and JWT authentication boundaries:\n\n* **Admin Role**:\n  - Has full company-wide authority to provision/deactivate team members.\n  - Can delegate tasks with specific priorities, categories, and due dates.\n  - Accesses aggregate productivity analytics, status breakdown charts, and team velocity metrics.\n\n* **Employee Role**:\n  - Focused on execution with zero administrative distraction.\n  - Receives automated **Next Best Action** recommendations.\n  - Can accept deliverables (\`new\` → \`active\`), mark deliverables completed, or document failure blockers for review.\n\nAll JWT claims are validated server-side to guarantee multi-tenant tenant isolation.`,
      action: !user ? { label: "Go to Sign In", path: "/login" } : null,
    };
  }

  // 3. Velocity / Throughput / Bottlenecks
  if (
    q.includes("velocity") ||
    q.includes("analytics") ||
    q.includes("throughput") ||
    q.includes("metric") ||
    q.includes("speed")
  ) {
    return {
      type: "text",
      text: `### 📊 Sprint Velocity & Throughput Strategy\n\nTo maximize team momentum in TeamFlow, consider these senior engineering practices:\n\n1. **Batch Delegate by Category**: Group deliverables (e.g., *Frontend*, *Backend*, *Database*) to minimize context switching for developers.\n2. **Enforce Small Batch Sizes**: Break deliverables into 1-to-2 day tasks rather than multi-week epics for faster verification.\n3. **Monitor the 'Failed / Blocked' Queue**: Tasks flagged as failed provide early warnings of external dependencies or missing specs.\n4. **Review Aggregate Completion Rates**: Aim for an 85–90% on-time sprint completion rate to avoid team burnout while maintaining velocity.`,
      action: role === "admin" ? { label: "View Analytics Tab", path: "/admin" } : null,
    };
  }

  // 4. Employee Guidance ("What should I do next?")
  if (
    q.includes("what should i do") ||
    q.includes("next task") ||
    q.includes("my task") ||
    q.includes("blocker") ||
    q.includes("help me")
  ) {
    if (role === "employee") {
      return {
        type: "text",
        text: `Hey **${userName}**! In your Employee Workspace:\n\n1. Check your **Next Best Action** banner at the top of your dashboard—it highlights your most urgent deliverable.\n2. If you have tasks in the **'New'** queue, click **Accept Task** to transition them into **In Progress**.\n3. Keep your focus on one active task at a time to optimize flow state.\n4. Once verified, click **Complete Task** to submit your work, or use **Failed** to log any blockers or missing credentials for the admin.`,
        action: { label: "Open Deliverable Queue", path: "/employee" },
      };
    } else {
      return {
        type: "text",
        text: `As an Admin, your primary focus should be **clear task delegation** and **unblocking your team**.\n\n* Check your **Tasks** tab to see any deliverables currently flagged as *Failed* or *In Progress*.\n* Head to **Create Task** to assign priority deliverables for the upcoming sprint.\n* Use the **Employees** tab to verify active roster counts.`,
        action: { label: "Open Admin Center", path: "/admin" },
      };
    }
  }

  // 5. Navigation & Setup Questions
  if (
    q.includes("setup") ||
    q.includes("register") ||
    q.includes("company") ||
    q.includes("invite") ||
    q.includes("how to start")
  ) {
    return {
      type: "text",
      text: `### 🚀 TeamFlow Onboarding Roadmap\n\n1. **Create Company Workspace**: Register your organization via \`/register-company\` with company name, admin credentials, and master password.\n2. **Provision Employees**: In your Admin Dashboard, open the **Employees** tab and add your team members.\n3. **Assign Deliverables**: Jump to the **Create Task** tab, select an assignee, set due date and priority, and dispatch!\n4. **Monitor in Real Time**: Watch live stats update as your engineers accept and deliver tasks.`,
      action: !user
        ? { label: "Register Organization", path: "/register-company" }
        : { label: "Go to Employees Tab", path: "/admin" },
    };
  }

  // Default fallback
  return {
    type: "text",
    text: `I'm **FlowAI**, your Senior Dev & Architecture Copilot in TeamFlow.\n\nI can help you with:\n* **Drafting detailed engineering tasks** with acceptance criteria\n* **Analyzing sprint throughput** and velocity bottlenecks\n* **Explaining role-based permissions (RBAC)** and security boundaries\n* **Guiding team members** on deliverable execution and blocker reporting\n\nTry asking: *"Generate a high priority backend task"*, *"How do roles work?"*, or *"How to increase team velocity?"*`,
    action: null,
  };
};

/**
 * Floating AI Assistant Component
 */
const AIAssistant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showNotification, setShowNotification] = useState(true);

  // Session storage backed message history
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("flowai_messages");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: "welcome",
        sender: "ai",
        text: `👋 Greetings! I'm **FlowAI**, your workspace copilot. How can I help optimize your team's velocity today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save messages to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem("flowai_messages", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Keyboard shortcut: Cmd/Ctrl + K to toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setIsMinimized(false);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Dismiss proactive notification after 8s
  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  // Contextual quick suggestions based on current pathname & role
  const quickSuggestions = useMemo(() => {
    const p = location.pathname;
    if (p.includes("/admin")) {
      return [
        "Draft High-Priority Backend Task",
        "How to optimize sprint velocity?",
        "Explain RBAC security boundaries",
      ];
    } else if (p.includes("/employee")) {
      return [
        "What should I work on next?",
        "How to report a task blocker?",
        "Explain sprint velocity metrics",
      ];
    } else {
      return [
        "How does role security work?",
        "Draft a sample engineering task",
        "Guide me through workspace setup",
      ];
    }
  }, [location.pathname]);

  const handleSendMessage = (textToSend = input) => {
    const prompt = textToSend.trim();
    if (!prompt || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI cognitive latency
    setTimeout(() => {
      const responseData = generateAIResponse(prompt, location.pathname, user);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        ...responseData,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleCopyTask = (task, index) => {
    const formatted = `TITLE: ${task.title}\nCATEGORY: ${task.category}\nPRIORITY: ${task.priority}\nDUE: ${task.dueDate}\n\nDESCRIPTION:\n${task.description}\n\nACCEPTANCE CRITERIA:\n${task.acceptanceCriteria.map((c) => `- ${c}`).join("\n")}`;
    navigator.clipboard.writeText(formatted);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleResetChat = () => {
    const initial = [
      {
        id: Date.now().toString(),
        sender: "ai",
        text: `Chat reset. I am ready with fresh context for **${location.pathname}**. What would you like to build or orchestrate?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(initial);
  };

  // Helper to format basic markdown-style bold and lists
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-display font-bold text-white text-sm mt-2 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 text-xs text-zinc-300 list-disc my-0.5">
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .slice(2)
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[11px]">$1</code>'),
              }}
            />
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-2 text-xs text-zinc-300 my-0.5">
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[11px]">$1</code>'),
              }}
            />
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="text-xs text-zinc-300 leading-relaxed my-0.5"
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
              .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[11px]">$1</code>'),
          }}
        />
      );
    });
  };

  const getContextBadge = () => {
    const p = location.pathname;
    if (p.includes("/admin")) return { label: "Admin Center", color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30" };
    if (p.includes("/employee")) return { label: "Employee Queue", color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30" };
    if (p.includes("/login") || p.includes("/signup")) return { label: "Auth Portal", color: "text-amber-400 bg-amber-500/15 border-amber-500/30" };
    return { label: "Landing Overview", color: "text-violet-400 bg-violet-500/15 border-violet-500/30" };
  };

  const currentBadge = getContextBadge();

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* ─── Proactive Thought Bubble (Dismissable Hint) ─── */}
      {!isOpen && showNotification && (
        <div className="hidden sm:flex items-center gap-3 absolute bottom-16 right-0 mb-2 glass-panel p-3.5 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/60 max-w-xs animate-toast-enter">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              FlowAI Senior Dev Copilot
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-zinc-300 leading-tight mt-0.5">
              Need help delegating tasks, reviewing code criteria, or navigating? Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono text-[9px]">
                ⌘K
              </kbd>
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-zinc-500 hover:text-white p-1 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Floating Circular Trigger Orb ─── */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setShowNotification(false);
          }}
          className="relative group p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer border border-white/20"
          aria-label="Open AI Assistant"
        >
          {/* Pulsing Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#070b14]" />
          </span>

          <Bot className="w-5 h-5 text-white" />
          <span className="text-xs font-bold font-display tracking-tight pr-1 hidden sm:inline">
            FlowAI
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-white/15 text-[10px] font-mono text-white/90">
            ⌘K
          </span>
        </button>
      )}

      {/* ─── Expanded AI Chat Modal ─── */}
      {isOpen && (
        <div
          className={`glass-panel border border-white/20 shadow-2xl shadow-black/80 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col ${
            isMinimized
              ? "w-80 h-14"
              : "w-[92vw] sm:w-[440px] h-[580px] max-h-[86vh]"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0c1224]/90 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#070b14]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-white text-xs sm:text-sm leading-none">
                    FlowAI Copilot
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentBadge.color}`}
                  >
                    {currentBadge.label}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">
                  Senior Dev & Workspace Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close (Esc)"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content (hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left scrollbar-none">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-lg ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                          : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm backdrop-blur-md"
                      }`}
                    >
                      {msg.sender === "ai" ? (
                        renderFormattedText(msg.text)
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Structured Task Draft Card */}
                      {msg.type === "task_draft" && msg.task && (
                        <div className="mt-3 p-3 rounded-xl bg-[#090d1a] border border-indigo-500/30 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-amber-400">
                              {msg.task.priority} Priority · {msg.task.category}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              Due: {msg.task.dueDate}
                            </span>
                          </div>

                          <div className="font-display font-bold text-white text-xs">
                            {msg.task.title}
                          </div>

                          <p className="text-[11px] text-zinc-300 leading-snug">
                            {msg.task.description}
                          </p>

                          {msg.task.acceptanceCriteria && (
                            <div className="pt-1.5 border-t border-white/10">
                              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                                Acceptance Criteria
                              </span>
                              <ul className="space-y-0.5">
                                {msg.task.acceptanceCriteria.map((c, i) => (
                                  <li
                                    key={i}
                                    className="text-[10px] text-zinc-300 flex items-start gap-1.5"
                                  >
                                    <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{c}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <button
                            onClick={() => handleCopyTask(msg.task, idx)}
                            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied Spec to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-zinc-300" />
                                <span>Copy Deliverable Spec</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Optional Context Action Link */}
                      {msg.action && (
                        <div className="mt-2.5 pt-2 border-t border-white/10">
                          <button
                            onClick={() => {
                              navigate(msg.action.path);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-zinc-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions Chips */}
              <div className="px-3 py-2 bg-[#090e1c]/80 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                {quickSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(suggestion)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-[10px] font-medium transition-colors cursor-pointer shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-[#0a0f20] border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask FlowAI or request a task spec..."
                    className="flex-1 glass-input px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 rounded-xl btn-primary-gradient text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer transition-transform active:scale-95 shrink-0"
                    aria-label="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-1.5 px-1">
                  <span>Context-aware for {user?.name ? `${user.name} (${user.role})` : "Guest"}</span>
                  <span>Esc to close</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
