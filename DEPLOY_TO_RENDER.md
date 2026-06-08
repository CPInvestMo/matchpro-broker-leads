# Deploy MatchPro Broker Leads to Render (FREE)

## Option 1: Deploy from Git (Recommended)

### Step 1: Create GitHub Repository
```bash
cd /tmp/matchpro-broker-leads
git init
git add .
git commit -m "Initial commit: MatchPro Broker Leads System"
git remote add origin https://github.com/YOUR_USERNAME/matchpro-broker-leads.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Paste your GitHub repo URL
5. Click "Connect"
6. Fill in:
   - **Name:** matchpro-broker-leads
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
7. Click "Create Web Service"

**Done!** Your app will be live in 2-3 minutes at:
```
https://matchpro-broker-leads-xxxxx.onrender.com
```

---

## Option 2: Manual Deployment (Without Git)

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub or email

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Select "Deploy an existing Git repository"
3. Paste this repo URL: (after you create it)
4. Or use "Paste a public Git repo URL"

### Step 3: Configure
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node 18.x

### Step 4: Deploy
- Click "Create Web Service"
- Wait 3-5 minutes for deployment

---

## Features

✅ Real estate leads for brokers
✅ Phone numbers visible & clickable
✅ Auto-updates every 12 hours
✅ Export to Excel
✅ Responsive design
✅ Zero billing (Render free tier)

---

## API Endpoints

- `GET /` - Dashboard
- `GET /api/leads` - All leads (JSON)
- `GET /api/leads/export` - Download Excel
- `GET /api/stats` - Statistics
- `GET /api/health` - Health check

---

## Auto-Update Schedule

- **Every 12 hours** at 00:00 and 12:00 UTC
- Automatically pulls latest leads
- Generates Excel reports
- Updates dashboard in real-time

---

**Questions?** Check the server logs in Render dashboard for any errors.
