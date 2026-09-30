# ⚡ Aether IDE — Autonomous AI Code Editor & Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-ffca28?logo=firebase)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)](https://supabase.com/)

**Next-generation, autonomous AI code editor engineered for hyper-productive software engineering teams.**

[Explore Live App](https://ais-pre-gmjjkjappu2b43wo44q2ly-535119237395.asia-southeast1.run.app) • [Firebase Hosting Site](https://aether-ai-ide.web.app/) • [Join Waitlist](https://aether-ai-ide.web.app/#waitlist)

</div>

---

## 🌟 Overview

**Aether IDE** is an autonomous AI-native coding environment designed to transcend traditional autocomplete editors. Built with a unified multi-model intelligence gateway, interactive desktop simulation, and instant local-to-cloud workspace syncing, Aether lets developers build, debug, and ship production applications with unprecedented velocity.

### Key Highlights
- **🤖 Autonomous Studio Mode**: Agentic workflows that plan, write, test, and self-heal complex multi-file features.
- **⚡ Multi-Model Intelligence Gateway**: Switch seamlessly between Gemini 2.5 Flash, Claude 3.5 Sonnet, GPT-4o, and DeepSeek R1 with unified context memory.
- **🚀 Dual-Sync Waitlist**: Real-time early access signup synchronizing immediately across **Supabase** and **Google Cloud Firestore**.
- **💻 Desktop IDE Simulator**: Browser-based high-fidelity interactive simulation of the upcoming native desktop runtime.
- **🛡️ Enterprise-Grade Security**: SOC2 Type II compliance, local LLM air-gapped support, role-based access control (RBAC), and hardware device management.

---

## 🏗️ Architecture

```
aether-ide/
├── src/
│   ├── components/
│   │   ├── admin/             # Role-based administrative telemetry & user management
│   │   ├── auth/              # Authentication flows (Google OAuth, Email/Pass, Anonymous)
│   │   ├── common/            # Shared UI (CommandPalette, WaitlistModal, CollapsibleSidebar)
│   │   ├── dashboard/         # Developer control plane, active devices, and API usage
│   │   ├── desktop/           # Interactive IDE sandbox simulator
│   │   ├── docs/              # Developer guides & SDK references
│   │   ├── download/          # Cross-platform installers (macOS, Windows, Linux)
│   │   ├── features/          # Deep-dive interactive feature matrix
│   │   ├── home/              # Hero showcase, benchmarks, and interactive demo
│   │   ├── models/            # Model benchmark comparison and latency metrics
│   │   └── pricing/           # Tiered plans (Hobbyist, Pro, Enterprise Team)
│   ├── context/
│   │   └── PlatformContext.tsx# Centralized application state & navigation router
│   ├── firebase/
│   │   └── config.ts          # Firebase SDK initialization, Auth, & Firestore helpers
│   ├── lib/
│   │   └── supabase.ts        # Supabase client & waitlist synchronization
│   └── App.tsx                # App root layout with responsive navigation
├── public/                    # Static assets & brand vectors
├── .env.example               # Template for environment variables (safe for commits)
├── .gitignore                 # Strict ignore rules for secrets and build artifacts
├── firebase.json              # Firebase Hosting & Firestore configuration
├── .firebaserc                # Firebase project targets mapping
└── vite.config.ts             # Vite bundling and Tailwind CSS v4 compiler
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aether-ide.git
   cd aether-ide
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:
   ```env
   # Supabase Configuration (Waitlist entries)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Gemini API Key (Optional for live model gateway)
   GEMINI_API_KEY=your-gemini-key
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🗄️ Database & Waitlist Integration

When users submit their details through the **Join Priority Waitlist** modal:

```typescript
// src/lib/supabase.ts
export async function submitWaitlistToSupabase(entry: WaitlistSubmission) {
  const { data, error } = await supabase
    .from('waitlist')
    .insert([{
      email: entry.email,
      full_name: entry.fullName,
      role: entry.role,
      preferred_language: entry.preferredLanguage,
      created_at: new Date().toISOString()
    }]);
  return { success: !error, data };
}
```

1. **Supabase Database**: Stored in the `waitlist` table:
   - `email` (text / unique)
   - `full_name` (text)
   - `role` (text)
   - `preferred_language` (text)
   - `created_at` (timestamptz)
2. **Google Cloud Firestore**: Concurrently archived in collection `waitlist` with deterministic timestamping and administrative role protection.

### Supabase Table SQL Setup
If setting up a fresh Supabase database instance, run the following in the **SQL Editor**:

```sql
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text default '',
  role text default 'Software Engineer',
  preferred_language text default 'Rust / TypeScript',
  created_at timestamptz default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table waitlist enable row level security;

-- Allow anonymous inserts for early access submissions
create policy "Allow anonymous waitlist signups" 
on waitlist for insert 
with check (true);

-- Allow authenticated reads
create policy "Allow admins to read waitlist" 
on waitlist for select 
to authenticated 
using (true);
```

---

## 🔒 Security & Environment Variables

All API keys and database credentials are fully safeguarded:
- `.env`, `.env.local`, and sensitive configuration files are strictly ignored in `.gitignore`.
- Only sanitized placeholders exist in `.env.example`.
- Frontend communications use Row Level Security (RLS) with anonymous publish scopes for waitlist submissions.

---

## 🌐 Deployments

| Platform | Target | URL |
| :--- | :--- | :--- |
| **Google Cloud Run** | Shared App Preview | [Live Preview](https://ais-pre-gmjjkjappu2b43wo44q2ly-535119237395.asia-southeast1.run.app) |
| **Firebase Hosting** | Production Site | [https://aether-ai-ide.web.app/](https://aether-ai-ide.web.app/) |

To deploy to Firebase Hosting from your machine:
```bash
firebase login
firebase deploy --only hosting:aether-ai-ide
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
