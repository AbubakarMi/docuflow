# Database Setup Guide

## Understanding Local vs Production Databases

### Why You Need Separate Databases:

**Local Database (localhost:5432)**
- Runs on YOUR computer
- Only accessible when your computer is ON
- Cannot be accessed by Netlify (cloud service)
- Good for: Development and testing

**Production Database (Neon/Cloud)**
- Runs in the cloud 24/7
- Accessible from anywhere on the internet
- Can be accessed by Netlify
- Good for: Live production application

## Your Current Setup:

### Local Development Database:
```bash
DATABASE_URL="postgresql://postgres:root@localhost:5432/invotrek?schema=public&connection_limit=20&pool_timeout=20"
```

### Production Database (Neon):
```bash
DATABASE_URL="postgresql://neondb_owner:npg_J6cVtr7RlnTF@ep-gentle-mud-ad1hyb32-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## Step-by-Step Setup:

### Step 1: Set Up Neon Database (You Already Have It!)

You already have your Neon database. Now let's set it up:

```bash
# 1. Set the Neon database URL temporarily
$env:DATABASE_URL="postgresql://neondb_owner:npg_J6cVtr7RlnTF@ep-gentle-mud-ad1hyb32-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# 2. Run migrations to create tables
npx prisma migrate deploy

# 3. Create super admin user
npm run create:superadmin
```

### Step 2: Configure Netlify Environment Variables

1. Go to: https://app.netlify.com
2. Select your InvoTrek site
3. Go to: **Site settings** → **Environment variables**
4. Add these variables:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_J6cVtr7RlnTF@ep-gentle-mud-ad1hyb32-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_SECRET=<generate-with-command-below>

NEXTAUTH_URL=https://invotrek.netlify.app

RESEND_API_KEY=re_X22GgK6r_LV8dW6yS54e8Pz6bS6Ah3RDv
```

**Generate NEXTAUTH_SECRET:**
```powershell
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Step 3: Redeploy on Netlify

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete

### Step 4: Test Your Production Site

1. Visit: https://invotrek.netlify.app
2. Login with your super admin credentials
3. Everything should work! ✅

## Using Both Databases:

### For Local Development:
Keep your `.env` file with local database:
```bash
DATABASE_URL="postgresql://postgres:root@localhost:5432/invotrek?schema=public"
```

### For Production:
Netlify will use the environment variables you set in the dashboard.

## Managing Data:

### To Copy Data from Local to Production:

```bash
# 1. Export from local database
pg_dump -h localhost -U postgres invotrek > backup.sql

# 2. Import to Neon
psql 'postgresql://neondb_owner:npg_J6cVtr7RlnTF@ep-gentle-mud-ad1hyb32-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require' < backup.sql
```

### To Access Neon Database Directly:

```bash
# Connect with psql
psql 'postgresql://neondb_owner:npg_J6cVtr7RlnTF@ep-gentle-mud-ad1hyb32-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'

# Or use Prisma Studio
$env:DATABASE_URL="postgresql://neondb_owner:npg_J6cVtr7RlnTF@ep-gentle-mud-ad1hyb32-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
npx prisma studio
```

## Troubleshooting:

### "Can't reach database server"
- Check if your Neon database is active
- Verify the connection string is correct
- Ensure `?sslmode=require` is at the end

### "Too many connections"
- Neon free tier has connection limits
- Use connection pooling URL (the one you have uses `-pooler`)
- Close unused connections

### "Database doesn't have tables"
- Run: `npx prisma migrate deploy` with Neon DATABASE_URL

## Best Practices:

1. **Never commit production DATABASE_URL to Git**
2. **Keep local and production separate**
3. **Use Prisma Studio to manage production data**
4. **Backup production database regularly**

---

**Important**: Your local PostgreSQL database is ONLY for development. Always use the cloud database (Neon) for production/Netlify deployment.
