# Church Fund Tracker - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended - Fastest)
1. Go to https://netlify.com/
2. Sign up/login
3. Drag and drop `dist/` folder
4. Get instant URL: `random-name.netlify.app`

### Option 2: Vercel
1. Go to https://vercel.com/
2. Click "New Project"
3. Upload `dist/` folder or connect GitHub
4. Deploy to `your-project.vercel.app`

### Option 3: GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Source: Deploy from branch
4. Branch: `main` and folder: `/dist`

### Option 4: Firebase Hosting (When Fixed)
1. Complete Firebase Hosting setup in console
2. Run: `firebase deploy`

## 📱 Your App is Ready!
- ✅ Build files in `dist/` folder
- ✅ Mobile-first responsive design
- ✅ Firebase integration configured
- ✅ All features working

## 🔗 Firebase Configuration Needed
Before deploying, update `src/firebase/config.js` with your actual Firebase credentials from Firebase Console → Project Settings → Web App.
