# Next.js Forum Starter Kit (Foru.ms x v0)

**Track:** 🎨 Bring Your Own Head (Front-end Focus)

## 💡 What it is
This is a **blazing fast, premium forum template** built for the Foru.ms ecosystem. It demonstrates how to build a high-performance, visually stunning frontend on top of a headless forum data structure. 

We solve the problem of "generic, slow forum UIs" by providing a modern, React Server Components-powered starter kit that feels like a native app.

## 🚀 How to Use
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Run Locally**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.
3. **Deploy**:
   Push to GitHub and import into Vercel for zero-config deployment.

## 🛠 Tech Stack & Excellence
- **Framework**: Next.js 14 (App Router) for SEO and speed.
- **Styling**: Tailwind CSS with a custom design system (Zinc palette).
- **Icons**: Lucide React for consistent visual language.
- **Type Safety**: Full TypeScript integration matching Foru.ms schema.

## 🔌 Foru.ms Integration
This project leverages the **Foru.ms data structure** (Users → Threads → Posts).
- **Mock Data Layer**: currently implemented in `lib/data.ts`.
- **Ready for Real API**: The data fetching functions (`getThreads`, `getThreadById`) are async and isolated, making it trivial to swap the mock data for real `fetch('https://api.foru.ms/...')` calls without changing a single UI component.

## ✨ Features
- **Premium Aesthetics**: Clean typography, hover states, and responsive layout.
- **Thread Feed**: Optimized list view with engagement stats.
- **Thread Details**: Full conversation view with nested post structure.
- **Instant Navigation**: Uses Next.js `<Link>` prefetching for instant page loads.
