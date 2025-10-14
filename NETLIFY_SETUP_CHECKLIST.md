# Netlify Setup Checklist - Fix 500 Login Error

## The Problem
You're getting a **500 Internal Server Error** on `/api/auth/login` because the database connection is not configured on Netlify.

## Solution: Step-by-Step Setup

### Step 1: Set Up Production Database

You need a PostgreSQL database that's accessible from the internet. Choose one:

#### Option A: Neon (Recommended - Free & Easy)
1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project called "invotrek"
4. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.region.neon.tech/neondb?sslmode=require
   ```

#### Option B: Supabase (Free with extras)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection pooling" string (better for serverless)

#### Option C: Railway (Paid but reliable)
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy connection string from variables

---

### Step 2: Configure Netlify Environment Variables

**CRITICAL**: You must add these environment variables in Netlify:

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (invotrek)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** and add each of these:

#### Required Variables:

```bash
# Database (MOST IMPORTANT)
DATABASE_URL=postgresql://user:pass@host:5432/database?sslmode=require

# Authentication
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://invotrek.netlify.app

# Email (your existing key)
RESEND_API_KEY=re_X22GgK6r_LV8dW6yS54e8Pz6bS6Ah3RDv

# AI (optional, for AI features)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

#### How to Generate NEXTAUTH_SECRET:

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use online generator:**
https://generate-secret.vercel.app/32

---

### Step 3: Run Database Migrations

After setting up the database, you need to run migrations to create tables:

```bash
# Set your production DATABASE_URL temporarily
$env:DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Create super admin user
npm run create:superadmin
```

Follow the prompts to create your admin account.

---

### Step 4: Redeploy on Netlify

After adding environment variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete
4. Check deployment logs for any errors

---

### Step 5: Verify Setup

1. Open your site: https://invotrek.netlify.app
2. Try to login with the super admin credentials you created
3. If login works ✅ - you're done!
4. If it still fails ❌ - check logs below

---

## Troubleshooting

### Still Getting 500 Error?

#### 1. Check Netlify Function Logs
1. Go to Netlify dashboard
2. Click **Functions** tab
3. Look for `/api/auth/login` function
4. Click to see error logs
5. Look for specific error message

#### 2. Common Issues:

**Error: "Can't reach database server"**
- Solution: Your database might be blocking Netlify's IP range
- Check database firewall settings
- For Neon: Should work by default (no IP restrictions)
- For Railway/other: Add Netlify IPs or allow all IPs (0.0.0.0/0)

**Error: "Invalid DATABASE_URL"**
- Solution: Check the connection string format
- Must include `?sslmode=require` for most cloud databases
- Example: `postgresql://user:pass@host:5432/db?sslmode=require`

**Error: "Prisma Client not generated"**
- Solution: This shouldn't happen with our `postinstall` hook
- Check build logs to ensure `prisma generate` ran successfully

**Error: "Environment variable not found"**
- Solution: Make sure you clicked "Save" after adding variables
- Redeploy after adding variables (existing deploys won't get them)

#### 3. Test Database Connection Locally

Before deploying, test your production database URL locally:

```bash
# Windows PowerShell
$env:DATABASE_URL="your-production-url"
npx prisma db pull
```

If this fails, your database URL is incorrect or unreachable.

---

## Quick Reference: Environment Variables

Copy this template and fill in your values:

```bash
# Required for login to work
DATABASE_URL=postgresql://username:password@host.region.provider.tech:5432/database?sslmode=require

# Required for authentication
NEXTAUTH_SECRET=your-32-character-random-string-here
NEXTAUTH_URL=https://invotrek.netlify.app

# Required for emails
RESEND_API_KEY=re_X22GgK6r_LV8dW6yS54e8Pz6bS6Ah3RDv

# Optional - for AI features
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## After Setup: Create Test Account

Once logged in as super admin, you can:

1. Create a business
2. Approve the business
3. Create regular admin users
4. Test the full workflow

---

## Need Help?

If you're still stuck:
1. Check Netlify function logs for the exact error
2. Verify DATABASE_URL works by connecting with a database client
3. Make sure all environment variables are set and saved
4. Try redeploying after setting variables

---

**Last Updated**: 2025-10-14
**Status**: Critical setup for production deployment
