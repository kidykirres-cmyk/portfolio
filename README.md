# Gokul K — Portfolio Frontend (React + Vite + Tailwind + Framer Motion)

Professional developer portfolio for **Gokul K — PHP Laravel Developer** (Sathyamangalam / Coimbatore). Built as per spec: Laravel 10+ REST API backend + React frontend with modern UI/UX, animations, dark/light mode, and admin CRUD.

## Tech Stack

- **React 18** + **React Router 6** (SPA, page transition animations via Framer Motion)
- **Vite 5** + **@vitejs/plugin-react**
- **Tailwind CSS 3.4** (darkMode: `class`, responsive, hover effects)
- **Framer Motion 11** (fade-in, slide-up, card hover zoom, page transitions)
- **Axios** for API calls
- **React Helmet Async** for SEO meta tags
- **React Icons** for icons
- **Google Analytics** via `VITE_GA_ID` (optional)

## Pages / Sections (Home)

- **Navbar** (`src/components/Navbar.jsx`) — sticky glass header, theme toggle, resume download, mobile drawer
- **Hero** (`src/components/Hero.jsx`) — name, typing animation for roles (`PHP Laravel Developer` …), CTA buttons, availability badge, stats
- **About** (`src/components/About.jsx`) — bio from resume, photo placeholder, animated progress bars
- **Resume** (`src/components/Resume.jsx`) — education & work timeline with scroll animations (KG Genius Labs, MCA, B.Sc, certs)
- **Projects** (`src/components/Projects.jsx`) — dynamic from `GET /api/projects`, cards with hover zoom/shadow/overlay, skeletons while loading
- **Skills** (`src/components/Skills.jsx`) — icon grids with hover effects
- **Contact** (`src/components/Contact.jsx`) — form → `POST /api/contact` (Laravel Mail), success/error states
- **Footer** (`src/components/Footer.jsx`) — social links (GitHub, LinkedIn, Netlify, Email)

## Extra Features Implemented (Task 6)

1. **Filter projects by category/tech stack** — `Projects.jsx` has category chips (`All, ERP, Billing, E-Commerce, Backend API`) and tech chips (`PHP, Laravel, MySQL, REST API…`). Query params: `GET /api/projects?category=ERP&tech=Laravel`
2. **Search functionality** — debounced search input → `?search=Bakery`, searches title/description/category on backend (ProjectController@index)
3. **Download Resume PDF** — button in Navbar, Hero, mobile drawer, Resume section, Footer → `/public/resume.pdf` (also copied to Laravel `public/resume.pdf`). Served statically, `download` attribute.
4. **SEO meta tags (React Helmet)** — `Home.jsx` and `ProjectDetail.jsx` set `<title>`, `<meta description>`, Open Graph, canonical, JSON-LD Person schema. `index.html` has base SEO tags.
5. **Google Analytics** — `src/utils/analytics.js` + `index.html` placeholder. Set `VITE_GA_ID=G-XXXXXXX` in `.env` to enable. Tracks page views on route change.

## Admin Panel

- **Login** (`src/pages/AdminLogin.jsx`) — `POST /api/login` (Sanctum), stores `portfolio_token` in localStorage, default `gokulgokul4457@gmail.com / Admin@123`
- **Dashboard** (`src/pages/AdminDashboard.jsx`) — Protected (redirects to `/admin/login` if not authed). CRUD table + create/edit form with image upload (multipart → `storage/projects`), delete with confirm. Uses `POST/PUT/DELETE /api/projects` with Bearer token.
- **Protected routes** — frontend checks `AuthContext` (`src/contexts/AuthContext.jsx`), backend uses `auth:sanctum` middleware.

## Tailwind Styling Suggestions

- **Theme**: `bg-[#fcfcff]` light / `bg-[#0a0a0f]` dark, primary `indigo-600`, card `bg-white` / `dark:bg-[#111117]`, border `slate-200` / `white/10`
- **Glass**: `backdrop-blur-xl` + `bg-white/70` / `dark:bg-[#111117]/70` for navbar & cards
- **Buttons**: `btn-primary` (indigo, shadow, hover lift), `btn-outline` (border, hover bg)
- **Cards**: `rounded-2xl`, `border`, `hover:shadow-xl`, `hover:-translate-y-1`, image `group-hover:scale-[1.03]`
- **Animations**: `framer-motion` `initial={{opacity:0,y:12}} whileInView` for scroll fade/slide, `whileHover` for lift, `AnimatePresence` for route transitions & mobile menu

## API Integration

`src/api.js`:

```js
VITE_API_URL=http://localhost:8000/api
fetchProjects({category, tech, search}) // GET /projects
fetchProject(id) // GET /projects/{id}
createProject(FormData) // POST /projects (image multipart)
updateProject(id, FormData) // POST /projects/{id} + _method=PUT
deleteProject(id) // DELETE /projects/{id}
login({email,password}) // POST /login
sendContact({name,email,subject,message}) // POST /contact
```

## Setup

```bash
cd "E:\open code\portfolio-frontend"
npm install
cp .env.example .env # set VITE_API_URL=http://localhost:8000/api
npm run dev # http://localhost:5173
npm run build # production
npm run preview
```

Backend must be running: `php artisan serve --host=127.0.0.1 --port=8000` from `gbs_portfolio_laravel`.

## Folder Structure

```
portfolio-frontend/
├── index.html (SEO + GA placeholder)
├── vite.config.js (proxy /api → localhost:8000)
├── tailwind.config.js + postcss.config.js
├── public/resume.pdf
├── src/
│   ├── main.jsx (HelmetProvider, ThemeProvider, AuthProvider, BrowserRouter)
│   ├── App.jsx (AnimatePresence routes)
│   ├── index.css (Tailwind base + components)
│   ├── api.js (axios client)
│   ├── contexts/ThemeContext.jsx (dark/light toggle, localStorage)
│   ├── contexts/AuthContext.jsx (Sanctum token, me, login/logout)
│   ├── hooks/useProjects.js
│   ├── utils/analytics.js (GA init + page view tracking)
│   ├── components/Navbar.jsx, Hero.jsx, About.jsx, Resume.jsx, Projects.jsx, ProjectCard.jsx, Skills.jsx, Contact.jsx, Footer.jsx
│   └── pages/Home.jsx, ProjectDetail.jsx, AdminLogin.jsx, AdminDashboard.jsx
```

## SEO & Analytics

- Helmet sets per-page titles/descriptions; `Home` includes JSON-LD for Google rich results
- `VITE_GA_ID` — replace `G-XXXXXXX` in `.env` and `index.html` comment with your Measurement ID; `analytics.js` injects `gtag` and tracks `page_path` on navigation

## Notes

- CORS: Laravel `config/cors.php` allows `FRONTEND_URL=http://localhost:5173`
- Image upload: backend stores to `storage/app/public/projects`, serves via `public/storage` symlink; React shows `image_url` (storage URL or external Unsplash fallback)
- Resume PDF: accessible at `http://localhost:5173/resume.pdf` and `http://localhost:8000/resume.pdf`
