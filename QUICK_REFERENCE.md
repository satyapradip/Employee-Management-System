# ⚡ Quick Reference Card

**Keep This Open While Coding**

---

## 🗂️ Project Structure (What Goes Where)

```
Backend (server/):
├── models/         → Database schemas (User, Task)
├── controllers/    → Business logic (what happens when API is called)
├── routes/         → URL endpoints (define API paths)
├── middleware/     → Code that runs between request & controller
├── validators/     → Input validation rules
└── utils/          → Helper functions (errors, responses)

Frontend (src/):
├── components/     → UI pieces (buttons, forms, dashboards)
├── context/        → Global state (auth, toast)
├── hooks/          → Reusable logic (useAuth, useTaskManager)
├── services/       → API calls (backend communication)
└── constants/      → Fixed values (categories, statuses)
```

---

## 🔑 Key Concepts (One-Line Explanations)

### Backend:

- **Controller:** Functions that handle API requests
- **Model:** Database structure definition (schema + methods)
- **Middleware:** Code that runs before controller (auth, validation)
- **asyncHandler:** Wrapper that catches errors in async functions
- **JWT:** Token that proves user is logged in
- **bcrypt:** Library that hashes passwords securely

### Frontend:

- **useState:** Store data that changes and triggers re-render
- **useEffect:** Run code when component mounts or data changes
- **useCallback:** Prevent function from being recreated every render
- **useMemo:** Prevent calculation from running every render
- **Context:** Share data across components without prop drilling
- **Custom Hook:** Reusable logic extracted into a function

---

## 🔄 Data Flow (How Things Connect)

### User Login Flow:

```
1. Login.jsx → User types email/password
2. handleLogin() → Calls api.auth.login()
3. services/api.js → Makes POST to /api/auth/login
4. Backend authRoutes.js → Routes to authController.login
5. authController.login → Validates, checks password, generates JWT
6. Returns → { user, token } to frontend
7. AuthProvider → Stores token in localStorage, updates state
8. App.jsx → Shows dashboard based on user role
```

### Task Creation Flow:

```
1. CreateTaskTab → Admin fills form
2. handleSubmit() → Calls api.tasks.create(taskData)
3. services/api.js → POST to /api/tasks
4. Backend taskRoutes.js → Routes to taskController.create
5. taskController.create → Validates, saves to DB
6. Returns → New task to frontend
7. useTaskManager → Adds to tasks array, refreshes list
8. TasksTab → Shows new task in UI
```

---

## 🐛 Common Debugging Steps

### Backend Error:

1. Check terminal for error message
2. Look at stack trace (which file, which line)
3. Add console.log before error line
4. Check if data format is correct
5. Verify database connection

### Frontend Error:

1. Open browser DevTools console (F12)
2. Read error message and stack trace
3. Check Network tab for failed API calls
4. Add console.log to see data values
5. Check if component is receiving correct props

### Connection Error:

1. Backend running? (`npm run dev` in server/)
2. Frontend running? (`npm run dev` in root)
3. Correct ports? (Backend: 5000, Frontend: 5173)
4. CORS enabled? (Check server/src/app.js)
5. Correct API URL? (Check .env VITE_API_URL)

---

## 📝 Code Patterns to Remember

### Backend API Response:

```javascript
// Success
return ApiResponse.success({ data: result }, "Operation successful").send(res);

// Error
throw ApiError.badRequest("Invalid input");
```

### Frontend API Call:

```javascript
try {
  const response = await api.tasks.getAll();
  if (response.success) {
    // Handle success
  }
} catch (error) {
  // Handle error
  showToast(error.message, "error");
}
```

### React State Update:

```javascript
// Array: Add item
setTasks([...tasks, newTask]);

// Array: Update item
setTasks(
  tasks.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)),
);

// Array: Remove item
setTasks(tasks.filter((t) => t.id !== taskId));
```

---

## 🔒 Security Checklist

- [ ] Never store passwords in plain text (use bcrypt)
- [ ] Never send passwords in API responses (use .select('+password') only when needed)
- [ ] Always validate user input (use validators)
- [ ] Check authentication before protected routes (use protect middleware)
- [ ] Check authorization for actions (verify user owns resource)
- [ ] Sanitize data before saving to DB
- [ ] Use HTTPS in production
- [ ] Don't expose sensitive errors to frontend

---

## 🎯 When You Get Stuck

### Ask Yourself:

1. What am I trying to do?
2. What is happening instead?
3. What have I tried so far?
4. Where exactly is it failing? (add console.logs!)

### Then:

1. Google the error message
2. Read error stack trace carefully
3. Check relevant documentation
4. Try similar code that works, compare differences
5. Ask AI with context (what you tried, what failed, what you think)

---

## 💡 Learning Tips

### When Reading Code:

- Don't just read → Explain out loud
- Add comments to understand better
- Change values, see what breaks
- Ask "why" for every pattern

### When Writing Code:

- Start simple, add complexity gradually
- Test after every small change
- Keep functions small (one responsibility)
- Name variables clearly (no "x", "temp", "data")

### When Debugging:

- console.log is your friend
- Binary search: Comment out half, see if error persists
- Read error messages completely
- Take breaks when frustrated (fresh eyes help!)

---

## 📚 Quick Links

### Documentation:

- **React:** https://react.dev
- **Express:** https://expressjs.com
- **Mongoose:** https://mongoosejs.com
- **JWT:** https://jwt.io

### Your Learning Files:

- **START_HERE.md** → Overview & motivation
- **DAY_1_STUDY_GUIDE.md** → Today's study plan
- **LEARNING_JOURNAL.md** → Your daily notes
- **TODO.md** → Features to implement

---

## ⚡ Keyboard Shortcuts (VS Code)

- `Ctrl + P` → Quick file open
- `Ctrl + Shift + F` → Search in all files
- `Ctrl + /` → Comment/uncomment
- `F12` → Go to definition
- `Shift + Alt + F` → Format document
- `Ctrl + ` ` → Toggle terminal

---

**Print this page and keep it visible while coding!**
