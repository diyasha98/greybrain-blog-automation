# 📘 GreyBrain Blog Automation System

An end-to-end AI-powered Blog & Newsletter Automation Platform built with:

- **Node.js + Express**
- **PostgreSQL + Prisma ORM**
- **Groq / OpenRouter / Together AI**
- **HTML + Bootstrap Admin Dashboard**
- **Make.com / Zapier workflow ready**

This system automatically generates topics, creates AI-powered blog posts, supports manual topic entry, and allows approval → publish → newsletter scheduling inside a simple dashboard.

---

## 🚀 Features

### 🔹 Topic Management
- Generate topics using AI (configurable themes & keywords)
- Add custom topics manually
- Automatically mark topics as Available → Used → Archived

### 🔹 Blog Generation
- Generate full blog posts (1000–1500 words) using AI
- Clean HTML output (h1, h2, p, ul)
- Save as Pending for review
- Approve / Reject / Publish

### 🔹 Blog Dashboard
- Built-in admin interface (`dashboard.html`)
- Hardcoded basic login
- View, edit, preview, copy, approve, reject posts
- Full HTML editor with live preview

### 🔹 API Ready for Frontend Integration
- Public API for Published posts
- Easily fetch posts into company websites
- Supports CMS integrations & automation platforms

---

## 🏗️ Architecture
```
/src
 ├── controllers      → API logic (topics / blogs)
 ├── services         → AIService (Groq / OpenRouter / Together)
 ├── public           → Frontend: login + dashboard
 ├── utils            → ApiResponse, catchAsync
 ├── db.ts            → Prisma client
 ├── server.ts        → Express app entry
 └── config
      └── envConfig.ts
```

Database is managed via **Prisma** with the following main models:
- `Topic`
- `BlogPost`
- `Newsletter`

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd repo-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env`
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# At least one provider is required
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=
TOGETHER_API_KEY=
```

### 4. Set up Prisma schema
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the server
```bash
npm run dev
```

**Server runs at:**  
`http://localhost:4000`

**Dashboard:**  
`http://localhost:4000/dashboard.html`

**Login (default hardcoded):**
- username: `greybrain-blog-admin`
- password: `Kj9#mP2$vL`

---

## ⚙️ API Endpoints

### 🟦 Topic Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Fetch available topics |
| POST | `/api/topics` | Add custom topic |
| GET | `/api/topics/generate` | Generate AI topics |
| PUT | `/api/topics/:id/used` | Mark topic as used |
| PUT | `/api/topics/:id/archive` | Archive a topic |

### 🟩 Blog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Fetch pending + approved + published |
| GET | `/api/blogs/:id` | Fetch a single post |
| POST | `/api/blogs/generate?topicId=<id>` | Generate a blog using topic |
| GET | `/api/blogs/approve/:id` | Approve |
| GET | `/api/blogs/publish/:id` | Publish |
| GET | `/api/blogs/reject/:id` | Reject |
| POST | `/api/blogs/update/:id` | Update content |

---

## 🧠 AI Configuration

AI provider is selected using `config.json`:
```json
{
  "ai_providers": {
    "primary": "groq",
    "fallback": "openrouter"
  },
  "personal_info": {
    "company": "GreyBrain"
  },
  "content_strategy": {
    "primary_keywords": ["healthcare AI", "clinical workflows", "automation"],
    "topics": {
      "main_themes": [
        "AI in Diagnostics",
        "Clinical Workflow Automation",
        "Patient Engagement",
        "Healthcare Predictive Models"
      ]
    }
  }
}
```

**Supports 3 AI providers:**
- Groq
- OpenRouter
- Together AI

---

## 🖥️ Admin Dashboard

The admin dashboard includes:

### Topic Management
- ✔ Generate topics
- ✔ Add manual topics
- ✔ View available topics
- ✔ Create blog from topic

### Blog Management
- ✔ View pending, approved
- ✔ Approve / Reject / Publish
- ✔ Edit blog content
- ✔ Live preview
- ✔ Copy clean HTML for website

**No external frameworks** — pure HTML + Bootstrap.

---

## 🌐 How to Fetch Blogs on a Website

To fetch published blogs on a frontend:
```javascript
fetch('http://localhost:4000/api/blogs')
  .then(r => r.json())
  .then(data => console.log(data.data.published));
```

To fetch one:
```javascript
fetch('http://localhost:4000/api/blogs/<id>')
  .then(r => r.json())
  .then(post => console.log(post.data));
```

A full integration guide is provided separately.

---

## 🧪 Local Testing Checklist

- [ ] Generate topics
- [ ] Create blog from topic
- [ ] Approve → Publish
- [ ] Verify `/api/blogs` returns published
- [ ] View & edit in dashboard
- [ ] Test frontend integration

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript |
| `npm start` | Start compiled server |
| `npx prisma studio` | View DB in browser |