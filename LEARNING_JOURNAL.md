# 📚 My Learning Journal

**Goal:** Become a strong full-stack developer who truly understands their code

---

## Week 1: Understanding Existing Code

### Day 1: Backend Authentication (authController.js)

**Date:** February 2, 2026

**What I'm learning today:**

- How user registration works
- How JWT authentication works
- How password hashing works
- Error handling patterns

**Key Concepts to Understand:**

#### 1. asyncHandler Wrapper

```javascript
export const register = asyncHandler(async (req, res) => {
  // Why asyncHandler?
  // - Automatically catches errors in async functions
  // - No need for try-catch in every function
  // - Passes errors to error handling middleware
});
```

**Question to myself:** What happens if I don't use asyncHandler?
**Answer:** I'd need try-catch blocks everywhere, code becomes messy

#### 2. Email Normalization

```javascript
const normalizedEmail = email.toLowerCase().trim();
```

**Why this matters:**

- Users might type "User@Email.com" vs "user@email.com"
- Both should be treated as same user
- .trim() removes extra spaces

#### 3. Password Comparison

```javascript
const isMatch = await user.comparePassword(password);
```

**What's happening:**

- User types plain password: "mypassword123"
- Database has hashed version: "$2a$10$xyz..."
- comparePassword uses bcrypt to check if they match
- Never store plain passwords!

**What I don't understand yet:**

- [ ] How exactly does bcrypt.compare work internally?
- [ ] What is JWT and how is it different from sessions?
- [ ] What does .select('+password') mean?

**Tomorrow I will:**

- Research JWT vs Sessions
- Understand the User model and bcrypt
- Explain login flow out loud

---

### Day 2: [Your next learning day]

**Date:**

**What I learned:**

**Challenges I faced:**

**How I solved them:**

---

## Questions to Research

### High Priority (This Week):

- [ ] What is JWT and how does it work?
- [ ] How does bcrypt hash passwords?
- [ ] What are Mongoose schemas?
- [ ] What is middleware in Express?

### Medium Priority (Next Week):

- [ ] What is useEffect in React?
- [ ] When to use useState vs useRef?
- [ ] What is React Context?
- [ ] What is event bubbling?

### Low Priority (Later):

- [ ] What is Docker?
- [ ] What is CI/CD?
- [ ] How to optimize database queries?

---

## Code I Understood Today

### authController.js - login function

**Flow:**

1. Get email & password from request body
2. Normalize email (lowercase, trim)
3. Find user in database
4. Check if user exists → if not, error
5. Check if user is active → if not, error
6. Compare password with hashed version → if wrong, error
7. Update lastLogin timestamp
8. Generate JWT token
9. Send user + token back to frontend

**Why this approach is good:**

- Security: Never reveal if email exists or password wrong (both say "invalid credentials")
- Tracking: lastLogin helps know user activity
- Stateless: JWT means server doesn't need to remember sessions

---

## My Code Experiments

### Experiment 1: Testing without asyncHandler

**Hypothesis:** Code will break without proper error handling

**What I tried:**

```javascript
// Removed asyncHandler to see what happens
export const testFunction = async (req, res) => {
  const user = await User.findOne({ email: "test" });
  // If error happens here, what will happen?
};
```

**Result:**

**What I learned:**

---

## Interview Prep Notes

### Can I explain: User Authentication Flow?

**Practice explanation:**
"When a user logs in, first we normalize their email to handle case-sensitivity. Then we query the database for that user. If found, we use bcrypt to compare the plain password they typed with the hashed password in our database. If it matches, we generate a JWT token using their user ID and role, and send it back to the frontend. The frontend stores this token and sends it with every subsequent request in the Authorization header."

**Can I draw this on a whiteboard?** [ ] Not yet [ ] Yes!

---

## Resources I Used Today

1. **JWT Explained** - https://jwt.io/introduction
2. **Bcrypt Guide** - [Link]
3. **Mongoose Docs** - [Link]

---

## Daily Progress Tracker

| Day | File Studied      | Understood? | Can Explain? | Built Something? |
| --- | ----------------- | ----------- | ------------ | ---------------- |
| 1   | authController.js | 70%         | 🟡 Partially | ❌               |
| 2   |                   |             |              |                  |
| 3   |                   |             |              |                  |

---

## Weekly Goals

### Week 1 Goals:

- [ ] Understand all auth-related code
- [ ] Understand User model completely
- [ ] Can explain authentication flow
- [ ] Add comments to 5 files

### Week 2 Goals:

- [ ] Implement employee management UI myself
- [ ] Understand React hooks deeply
- [ ] Can explain frontend data flow

---

## Wins & Struggles

### 🎉 Wins This Week:

- Understood how asyncHandler works!
- Fixed modal spacebar bug and understood event bubbling

### 😓 Struggles This Week:

- JWT still confusing, need to research more
- Don't fully understand Mongoose select() method

---

**Next Learning Session:** Tomorrow at [your preferred time]
**Focus:** User model and password hashing
