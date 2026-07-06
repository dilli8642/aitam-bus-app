# Deployment Guide - AITAM Smart Bus Entry & Exit Management System

## Quick Summary

The application is **production-ready** and can be deployed to Vercel (recommended) or Render in minutes.

---

## Option 1: Deploy to Vercel (Recommended for Next.js)

Vercel is the official hosting platform for Next.js and provides the best performance.

### Step 1: Push to GitHub

First, push your code to GitHub:

```bash
# Navigate to project directory
cd c:\AITAM\aitam-bus-app

# Add GitHub remote (replace YOUR_USERNAME and YOUR_REPO with your GitHub details)
git remote add origin https://github.com/YOUR_USERNAME/aitam-bus-app.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to **https://vercel.com**
2. Click **"New Project"** (or sign up if you don't have an account)
3. Click **"Import Git Repository"**
4. Select your `aitam-bus-app` repository from GitHub
5. Accept default settings (Framework preset: "Next.js", Build command auto-detected)
6. Click **"Deploy"**

**That's it!** Your app will be live in 2-3 minutes at:
```
https://aitam-bus-app.vercel.app
```

### Important Notes for Vercel:

- **SQLite Database**: Works out-of-the-box on Vercel, but data is ephemeral (resets on redeploy)
- **For Production**: Migrate database to Supabase PostgreSQL or MySQL for persistent data
- **Environment Variables**: Add any sensitive data in Vercel project settings
- **Automatic Deployments**: Push to `main` branch → Automatic deployment

---

## Option 2: Deploy to Render

Render provides managed hosting with persistent databases.

### Step 1: Push to GitHub
(Same as Option 1 - push to GitHub first)

### Step 2: Deploy on Render

1. Go to **https://render.com**
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing Git repository"**
4. Connect your GitHub account if prompted
5. Select `aitam-bus-app` repository
6. Configure:
   - **Name**: `aitam-bus-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or Starter for production)
7. Click **"Create Web Service"**

**Your app will be live at:**
```
https://aitam-bus-app.onrender.com
```

### Important Notes for Render:

- **SQLite**: Works, but not ideal for Render. For persistent data, upgrade to PostgreSQL
- **Startup Time**: First request takes 30-60 seconds (free tier spins down)
- **Persistent Storage**: Use Render's PostgreSQL add-on for production database

---

## Environment Variables

No environment variables required for basic deployment.

For production, add these to your deployment platform:

```env
NODE_ENV=production
```

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at the live URL
- [ ] Login page displays (default: admin / admin123)
- [ ] Dashboard shows today's date correctly
- [ ] QR Scanner page loads
- [ ] CSV export works
- [ ] Dark mode toggle works

---

## Production Database Setup (Optional)

SQLite on serverless platforms has limitations. For production, migrate to:

### **Option A: Supabase (PostgreSQL)**

1. Create account at **https://supabase.com**
2. Create new project (PostgreSQL)
3. Get connection string
4. Update `lib/db.ts` to use `pg` (PostgreSQL driver)
5. Deploy new version

### **Option B: MySQL via PlanetScale**

1. Create account at **https://planetscale.com**
2. Create new MySQL database
3. Get connection string
4. Update `lib/db.ts` to use MySQL driver
5. Deploy new version

---

## Troubleshooting

### App shows "failed to load"
- Wait 30-60 seconds for cold start (especially on free tier)
- Clear browser cache and reload
- Check browser console for errors (F12)

### Date formatting errors
- Already fixed with `suppressHydrationWarning`
- Should not appear in production build

### Database empty after deploy
- SQLite data is ephemeral on serverless
- Redeploy clears database
- Use persistent database (Supabase/PlanetScale) for production

### Camera/QR Scanner not working
- Requires HTTPS (automatic on Vercel/Render)
- Browser must have permission to access camera
- Test on Android device with Chrome browser

---

## Getting Your Live Link

After deployment completes:

1. **Vercel**: Check Vercel dashboard → Project → Deployments tab
   - Live URL will be: `https://[project-name].vercel.app`

2. **Render**: Check Render dashboard → Web Service
   - Live URL will be: `https://[service-name].onrender.com`

---

## Support

For issues:
- Check deployment platform logs (Vercel/Render dashboard)
- Verify all required npm packages installed locally first: `npm install`
- Run locally first: `npm run dev` to verify app works before deploying

---

**Your AITAM Smart Bus System is ready for the world! 🚀**
