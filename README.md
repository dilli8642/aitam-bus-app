# AITAM Smart Bus Entry & Exit Management System

A modern, production-ready Progressive Web Application (PWA) for digitally tracking bus entry and exit at AITAM College using QR code scanning.

## 🎯 Features

### Core Functionality
- **QR-Based Bus Scanning** - Scan unique QR codes on each bus windshield to log entry/exit
- **Real-time Dashboard** - View today's bus movements, entry/exit counts, and current location status
- **Entry/Exit Logging** - Automatic timestamp capture with duplicate detection
- **Digital Bus Master** - 50 pre-configured sample buses with registration, driver, and route info
- **QR Code Generator** - Download individual QR codes or bulk ZIP packages for printing
- **Activity Logs** - View today's complete bus movement history with search and sort
- **Historical Records** - Search and filter past records by date, bus, driver, or registration
- **CSV Export** - Download bus movement data for any date in standard CSV format
- **Offline Support** - Local storage caching for uninterrupted operation without connectivity
- **Dark Mode** - Professional dark mode toggle for comfortable viewing

### Technical Features
- **PWA Ready** - Installable on mobile devices, works offline with service workers
- **Mobile-Optimized** - Fully responsive design for Android phones and tablets
- **Local-First Database** - SQLite for fast, offline-capable data persistence
- **Type-Safe** - Full TypeScript implementation with compile-time error checking
- **Session Management** - Secure login with localStorage-based session storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to the project
cd c:\AITAM\aitam-bus-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Login Credentials
- **Username:** `admin`
- **Password:** `admin123`


## 📋 Project Structure

```
aitam-bus-app/
├── app/                        # Next.js app directory
│   ├── api/                    # Server-side API routes
│   │   ├── buses/
│   │   ├── logs/
│   │   ├── dashboard/
│   │   └── export/csv/
│   ├── login/
│   ├── dashboard/
│   ├── scan/
│   ├── bus-master/
│   ├── qr-generator/
│   ├── today-logs/
│   ├── history/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── manifest.ts
│   └── globals.css
├── components/
│   ├── app-shell.tsx
│   └── qr-scanner.tsx
├── lib/
│   ├── db.ts
│   ├── bus-utils.ts
│   ├── sample-data.ts
│   ├── client-storage.ts
│   └── bus-utils.test.ts
├── types/
│   └── next-pwa.d.ts
└── package.json
```

## 🔧 Technology Stack

| Component | Tech |
|-----------|------|
| Framework | Next.js 16.2.10 with React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| QR Scanning | html5-qrcode |
| QR Generation | qrcode |
| Database | SQLite (better-sqlite3) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Testing | Vitest |
| PWA | next-pwa |

## 🧪 Testing

```bash
npm test
```

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Click Deploy

**Note:** For production data persistence, migrate from SQLite to Supabase, MySQL, or MongoDB.

## 🔐 Security

**Development Only:**
- Default credentials: admin / admin123

**Production Steps:**
1. Change default credentials
2. Implement password hashing (bcrypt)
3. Use HTTPS only
4. Add CSRF protection
5. Implement rate limiting

## 📱 Install as PWA

**Android:**
1. Open the app in Chrome
2. Tap menu (⋮) → "Add to Home screen"
3. App installs as standalone

## 📊 Sample Data

Pre-configured:
- 50 buses (BUS001-BUS050)
- Drivers, routes, and capacity info
- All marked Active

---

**Version:** 1.0.0 | **Status:** Production Ready ✅

