# 📖 Day 1 Study Guide

**Your First Deep Dive into the Codebase**

---

## 🎯 Today's Mission

You're going to **deeply understand** two critical files:

1. `server/src/controllers/authController.js` (Backend)
2. `src/components/Admin/hooks/useTaskManager.js` (Frontend)

**Time needed:** 2-3 hours
**Goal:** Understand every line, not just read it

---

## 📝 Step-by-Step Learning Process

### Part 1: Backend Authentication (60 minutes)

#### Step 1: Read the Commented Code (20 min)

Open: `server/src/controllers/authController.js`

I've added **detailed comments** to the `login` function. Read each comment carefully.

**Your Task:**

- [ ] Read through the login function line by line
- [ ] Highlight concepts you don't understand
- [ ] Write down 3 questions

**Example questions to ask yourself:**

- What is asyncHandler and why do we use it?
- Why do we say "Invalid credentials" instead of "User not found"?
- What's the difference between .findOne() and .findById()?

#### Step 2: Research Unknown Concepts (20 min)

Pick 3 things you don't understand and Google them:

1. **JWT (JSON Web Tokens)**
   - Search: "What is JWT and how does it work"
   - Watch: "JWT in 5 minutes" on YouTube
   - Read: https://jwt.io/introduction

2. **Bcrypt Password Hashing**
   - Search: "How does bcrypt work"
   - Understand: Why we hash passwords, never store plain text

3. **Mongoose .select()**
   - Search: "Mongoose select method"
   - Understand: Why password is excluded by default

#### Step 3: Explain Out Loud (20 min)

Open voice recorder on your phone or laptop.

**Record yourself explaining:**
"When a user logs in, first we get the email and password from the request body..."

Keep talking until you explain the entire login flow (all 10 steps).

**If you get stuck:** That's what you need to study more!

---

### Part 2: Frontend Custom Hook (60 minutes)

#### Step 1: Read the Commented Code (20 min)

Open: `src/components/Admin/hooks/useTaskManager.js`

I've added comments explaining useState, useCallback, and the fetch logic.

**Your Task:**

- [ ] Read the commented sections
- [ ] Compare useCallback to regular function
- [ ] Understand why we transform backend data

**Questions to explore:**

- What is useState and when does it re-render components?
- Why use useCallback instead of regular function?
- What does the dependency array [showToast] mean?

#### Step 2: Experiment with the Code (20 min)

**Mini Experiments:**

**Experiment 1: Remove useCallback**

```javascript
// Try this (temporarily):
const fetchTasks = async () => {  // Removed useCallback
  try {
    // ... same code
  }
};
```

**Question:** Does it still work? Why/why not?

**Experiment 2: Change initial state**

```javascript
const [tasks, setTasks] = useState(["test task"]); // Instead of []
```

**Question:** What happens in the UI?

**Experiment 3: Add console.log**

```javascript
const fetchTasks = useCallback(async () => {
  console.log("🔍 Fetching tasks...");
  // ... rest of code
}, [showToast]);
```

**Question:** When do you see this log? Only once? Multiple times?

#### Step 3: Draw the Data Flow (20 min)

On paper or whiteboard, draw:

```
Component Mounts
     ↓
useEffect runs
     ↓
fetchTasks() called
     ↓
API call to backend
     ↓
Backend queries database
     ↓
Returns tasks JSON
     ↓
Transform data (backend → frontend format)
     ↓
setTasks() → Update state
     ↓
Component re-renders with new tasks
```

**Can you draw this from memory?** Try it!

---

## 🧪 Hands-On Practice (30 minutes)

### Challenge 1: Add a Console Log

Add a console.log to see what data comes from the backend.

**Where:** In `fetchTasks` function
**What to log:** `console.log("Backend response:", response);`

Run the app, open browser console, login as admin.
**What do you see?** Examine the data structure.

### Challenge 2: Explain to a Friend

Call a friend or record yourself explaining:

- "In my project, when admin dashboard loads, it fetches tasks using..."

If you can't explain it, you don't understand it yet!

### Challenge 3: Find Similar Patterns

Search for other uses of useCallback in the project:

```bash
grep -r "useCallback" src/
```

**How many do you find?** Do they all have dependency arrays?

---

## 📚 Concepts You Should Understand By End of Day

### Backend Concepts:

- [x] What asyncHandler does and why we use it
- [x] Why we normalize email (.toLowerCase(), .trim())
- [x] What .select("+password") means
- [x] How bcrypt.compare() works (conceptually)
- [x] What JWT is and how it's used for authentication
- [x] Why we say "Invalid credentials" not "User not found"

### Frontend Concepts:

- [x] What useState does and when it re-renders
- [x] Difference between useState and regular variables
- [x] What useCallback does and when to use it
- [x] What the dependency array means
- [x] Why we transform backend data to frontend format
- [x] How try-catch-finally works in async functions

---

## ✅ End of Day Checklist

- [ ] Read both files with comments
- [ ] Researched 3+ unknown concepts
- [ ] Recorded myself explaining login flow
- [ ] Tried at least 1 code experiment
- [ ] Drew the data flow diagram
- [ ] Updated LEARNING_JOURNAL.md with today's learnings
- [ ] Listed 3 things I still don't understand (to research tomorrow)

---

## 📝 Homework for Tomorrow

### Research Topics:

1. **useEffect** - When does it run? Dependency array?
2. **useMemo** - Different from useCallback how?
3. **Mongoose populate()** - How does it work?

### Code to Study Tomorrow:

- `server/src/models/User.js` - The User model
- `src/context/AuthProvider.jsx` - How context works

---

## 💡 Tips for Success

### While Reading Code:

✅ **DO:**

- Read comments out loud
- Ask "why" for every line
- Google unfamiliar terms immediately
- Take breaks every 30 minutes

❌ **DON'T:**

- Just skim through
- Assume you understand without testing
- Skip experimenting with code
- Move on if confused (research first!)

### When Stuck:

1. Google the concept
2. Read official docs (React.dev, Mongoose docs)
3. Watch a 5-minute YouTube tutorial
4. Try it in code
5. Still stuck? Ask me, but show what you tried!

---

## 🎯 Success Metric

**By tonight, can you:**

- Explain the login flow to someone (without looking at code)?
- Explain why we use useCallback (in your own words)?
- Draw the data flow from component to database and back?

**If YES:** You're learning properly! ✅
**If NO:** Spend more time on the sections above tomorrow.

---

## 🗣️ Interview Practice

Imagine interviewer asks: **"Walk me through how your login system works"**

**Your answer should include:**

1. User enters email/password in Login.jsx
2. onClick calls handleLogin function
3. Function calls api.auth.login() from services/api.js
4. API makes POST request to /api/auth/login
5. Backend authController.login function executes
6. Validates input → Finds user → Checks password → Generates JWT
7. Returns user + token to frontend
8. Frontend stores token in localStorage
9. AuthProvider updates user state
10. App.jsx shows AdminDashboard or EmployeeDashboard based on role

**Can you explain this without reading?** Practice!

---

**Time to start:** Right now! ⏰
**Expected completion:** 2-3 hours
**Next review:** Tomorrow, reflect on what you learned

Remember: **Understanding > Memorizing**

You don't need to memorize syntax. You need to understand the concepts!
