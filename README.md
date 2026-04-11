# 🚀 AI-Assisted Job Application Tracker

A full-stack web application to track job applications using a Kanban board, parse job descriptions using AI, and generate tailored resume bullet points.

---

## ✨ Features

* 🔐 Authentication (JWT-based)
* 📊 Kanban board (Applied → Rejected flow)
* 🤖 AI Job Description parsing
* 📝 AI Resume bullet suggestions (streaming)
* 🧩 Drag & Drop status updates
* ✏️ Edit & Delete applications
* ⚡ Optimistic UI updates

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** PostgreSQL (Docker)
* **ORM:** Prisma
* **Auth:** JWT
* **AI:** Mistral API
* **Other:** React Markdown, shadcn/ui

---

## Live Link : https://ai-assisted-job-application-tracker-hazel.vercel.app

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/saifalikhan9/AI-Assisted-Job-Application-Tracker
cd intern-task
```

---

### 2️⃣ Install Dependencies

```bash
pnpm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/intern_task"
JWT_SECRET="your_jwt_secret"
MISTRAL_API_KEY="your_mistral_api_key"
```

👉 Also check `.env.sample` for reference.

---

### 4️⃣ Start Database (Docker)

```bash
pnpm run db:start
```

---

### 5️⃣ Run Prisma Migrations

```bash
npx prisma migrate dev
```

---

### 6️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

### 7️⃣ Seed the Database

```bash
pnpm run seed
```

👉 This creates:

* Demo user
* Sample job applications

---

### 8️⃣ Start the Development Server

```bash
pnpm run dev
```

---

## 🔐 Demo Credentials

```plaintext
Email: test@example.com
Password: password123
```

---

## 🧪 How to Test

1. Open: http://localhost:3000
2. Login using demo credentials
3. Explore the dashboard:

   * Drag cards across columns
   * Add new application (paste JD → AI parses it)
   * Generate resume suggestions
   * Edit / Delete cards

---

## 📦 Useful Commands

```bash
pnpm run dev        # Start dev server
pnpm run db:start   # Start Docker DB
pnpm run db:stop    # Stop DB
pnpm run seed       # Seed database
pnpm run db:reset   # Reset DB + reseed
```

---

## 🧠 Key Decisions

* Used **server-side auth checks** for security
* Implemented **optimistic UI updates** for better UX
* Used **streaming AI responses** for real-time suggestions
* Structured code into **reusable components**

---

## 🚀 Future Improvements

* Search & filter applications
* Dashboard analytics
* Follow-up reminders
* Dark mode
* Export to CSV

---

## 📄 License

This project is for assessment purposes.
