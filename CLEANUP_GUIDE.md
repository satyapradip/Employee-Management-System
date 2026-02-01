# 🧹 Immediate Cleanup Guide

**Quick Reference for Deleting Unused Files**

---

## Files to Delete (Safe to Remove)

### Option 1: Delete via Command Line

**PowerShell (Windows):**

```powershell
# Navigate to project root
cd e:\Employee_Management_System

# Delete unused component files
Remove-Item src\components\TaskList\AcceptTask.jsx
Remove-Item src\components\TaskList\CompleteTask.jsx
Remove-Item src\components\TaskList\NewTask.jsx
Remove-Item src\components\TaskList\FailedTask.jsx

# Delete unused context and hook
Remove-Item src\context\TaskProvider.jsx
Remove-Item src\hooks\useTask.js

# Delete mock data
Remove-Item src\components\Admin\data\sampleTasks.js

# Delete empty directory
Remove-Item src\pages -Force

# Verify deletion
Write-Host "✅ Cleanup complete!"
```

**Git Bash / Linux / Mac:**

```bash
# Navigate to project root
cd /e/Employee_Management_System

# Delete unused files
rm src/components/TaskList/AcceptTask.jsx
rm src/components/TaskList/CompleteTask.jsx
rm src/components/TaskList/NewTask.jsx
rm src/components/TaskList/FailedTask.jsx
rm src/context/TaskProvider.jsx
rm src/hooks/useTask.js
rm src/components/Admin/data/sampleTasks.js
rm -rf src/pages

echo "✅ Cleanup complete!"
```

---

### Option 2: Delete via VS Code

1. Open VS Code Explorer (Ctrl+Shift+E)
2. Navigate to and delete these files:
   - ❌ `src/components/TaskList/AcceptTask.jsx`
   - ❌ `src/components/TaskList/CompleteTask.jsx`
   - ❌ `src/components/TaskList/NewTask.jsx`
   - ❌ `src/components/TaskList/FailedTask.jsx`
   - ❌ `src/context/TaskProvider.jsx`
   - ❌ `src/hooks/useTask.js`
   - ❌ `src/components/Admin/data/sampleTasks.js`
   - ❌ `src/pages/` (entire folder)

---

## Why These Files Are Safe to Delete

### 1. Empty Components

**AcceptTask.jsx, CompleteTask.jsx, NewTask.jsx, FailedTask.jsx**

- All contain only boilerplate code
- No functionality implemented
- All features are in `TaskList.jsx` instead
- Not imported anywhere

### 2. Unused Context

**TaskProvider.jsx & useTask.js**

- Not used in the app (checked with grep)
- Admin uses `useTaskManager` hook
- Employee dashboard fetches tasks directly via API
- No imports found in any component

### 3. Mock Data

**sampleTasks.js**

- Was used for development
- Now replaced by real API data
- Not imported in current code

### 4. Empty Directory

**pages/**

- Empty folder, no files
- All page components in `components/` folder

---

## After Cleanup - Clean Up Imports

If VS Code shows any import errors after deletion, they would be in:

- `src/main.jsx` (unlikely)
- `src/App.jsx` (unlikely)

**Search for broken imports:**

```bash
# Search for imports of deleted files
grep -r "AcceptTask\|CompleteTask\|NewTask\|FailedTask\|TaskProvider\|useTask" src/
```

If any imports are found, simply remove those import lines.

---

## Verify Cleanup

**Run these checks:**

1. **Check app still runs:**

   ```bash
   npm run dev
   ```

2. **Check for errors in console:**
   - Open browser developer tools
   - Should see no import errors

3. **Test features:**
   - Login as admin ✅
   - Create task ✅
   - View tasks ✅
   - Login as employee ✅
   - View assigned tasks ✅

---

## File Count Before/After

**Before Cleanup:**

- Components: 41 files
- Context: 5 files
- Hooks: 4 files

**After Cleanup:**

- Components: 37 files (-4)
- Context: 4 files (-1)
- Hooks: 3 files (-1)
- **Total Removed:** 6 files + 1 directory

---

## Commit Changes

```bash
git status
git add -A
git commit -m "chore: remove unused files and empty directories

- Removed empty task components (AcceptTask, CompleteTask, NewTask, FailedTask)
- Removed unused TaskProvider and useTask hook
- Removed mock sampleTasks data
- Removed empty pages directory

All functionality preserved in TaskList.jsx and useTaskManager hook."
```

---

## Next Step After Cleanup

Once cleanup is done, proceed to:
**TODO.md → PHASE 2: Critical Fixes**

Priority: Connect employee task actions (accept/complete/fail)

---

**Estimated Time:** 5-10 minutes  
**Risk Level:** None (files not used)  
**Testing Required:** Basic smoke test
