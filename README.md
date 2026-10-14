# ITMaintenance 🖥️

**Manage IT assets. Track maintenance. Simplify IT operations.**

ITMaintenance is a web application for IT asset management built with React and TypeScript. It helps organizations manage their IT equipment, track asset assignments, handle maintenance operations, and manage equipment-related complaints through a centralized dashboard.

The application integrates Supabase for authentication and PostgreSQL data storage, with role-based access control for administrators, technicians, and employees.

[![CI](https://github.com/asmaguenaien/itmaintenance/actions/workflows/ci.yml/badge.svg)](https://github.com/asmaguenaien/itmaintenance/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **Live Demo:** [Add your Vercel URL here](https://your-project.vercel.app)

> **Note:** The interface is in French.

## ✨ Features

- **Dashboard** — Get an overview of equipment, maintenance reports, and complaints.
- **Equipment Management** — View and manage IT assets, including their names, types, brands, models, serial numbers, and statuses.
- **Asset Assignment** — Manage equipment assignments to users.
- **Maintenance Tracking** — Create and track maintenance reports associated with IT equipment.
- **Complaint Management** — Submit equipment-related complaints and track their status and responses.
- **Inventory Management** — Browse and search the equipment inventory.
- **Authentication** — Register, sign in, reset passwords, and manage user sessions.
- **Role-Based Access Control** — Distinguish between administrators, technicians, and employees.
- **Database Security** — Use Supabase Row Level Security (RLS) policies to control access to stored data.
- **Responsive Interface** — Navigate the application through a modern interface built with reusable UI components.

## 🛠️ Tech Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Radix UI, Lucide React |
| **Routing** | React Router |
| **Backend** | Supabase (PostgreSQL, Authentication, Row Level Security) |
| **Quality** | Vitest, ESLint, GitHub Actions |
| **Deployment** | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A Supabase project

### Installation

```bash
git clone https://github.com/asmaguenaien/itmaintenance.git
cd itmaintenance
npm install
```

### Environment Configuration

Create a `.env` file in the project root (you can copy `.env.example`) and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Then apply the database migration available in `supabase/migrations/` (for example by pasting it into the Supabase SQL Editor) to create the required tables, roles, triggers, and Row Level Security policies.

In your Supabase project, go to **Authentication → URL Configuration** and add `http://localhost:8080` (and your deployed URL) to the allowed redirect URLs, so that email confirmation and password reset links work.

> **Security note:** Never commit private credentials, service-role keys, or real user passwords to a public repository. Only the public `anon` / publishable key belongs in this project.

### Run the Application

```bash
npm run dev
```

Open http://localhost:8080 to access the application.

### Create an Administrator

New accounts are created with the employee role. Register a first account, confirm the email, then promote it in the Supabase SQL Editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@example.com';
```

Use `'technician'` instead of `'admin'` to create technician accounts.

### Production Build

```bash
npm run build
npm run preview
```

### Quality Checks

```bash
npm run lint
npm test
```

### Deploying to Vercel

Add the same `VITE_SUPABASE_*` variables in your Vercel project under **Settings → Environment Variables** before deploying, and redeploy after changing them. Add the Vercel URL to the redirect URLs in Supabase.

## 🗺️ Project Roadmap

- [ ] Add an administrator screen to manage user roles.
- [ ] Add advanced inventory filtering and reporting.
- [ ] Improve equipment assignment history and tracking.
- [ ] Add maintenance notifications and reminders.
- [ ] Introduce equipment lifecycle and warranty tracking.
- [ ] Add exportable inventory and maintenance reports.
- [ ] Add automated tests for authentication and core workflows.
- [ ] Improve accessibility and user experience.

## 📸 Screenshots

Screenshots of the dashboard, equipment inventory, maintenance management, and complaints interface will be added here.

## 👩‍💻 Author

**Asma Guenaien**
Software Development | Web Technologies

- GitHub: [@asmaguenaien](https://github.com/asmaguenaien)

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
