# Netlify Deployment Guide for InvoTrek

## Overview
This guide explains how to deploy InvoTrek to Netlify with proper Prisma database configuration.

## Recent Fixes Applied

### 1. Prisma Client Build-Time Error Fix
**Problem**: Build was failing with:
```
Error [PrismaClientConstructorValidationError]: Invalid value undefined for datasource "db" provided to PrismaClient constructor.
```

**Solution**: Updated [src/lib/db.ts](src/lib/db.ts) to handle missing `DATABASE_URL` during build time with a fallback configuration.

### 2. Build Script Updates
Added the following to [package.json](package.json):
- `prisma generate` before build
- `postinstall` hook to generate Prisma client after dependencies install

## Environment Variables Setup

### Required Environment Variables on Netlify

You **MUST** configure these environment variables in your Netlify dashboard:

1. Go to: **Site settings → Environment variables**
2. Add the following variables:

#### Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
```
**Important**: Use your production PostgreSQL database URL (e.g., from Neon, Supabase, Railway, or AWS RDS)

#### Authentication
```
NEXTAUTH_SECRET=your-very-secure-random-string-here
NEXTAUTH_URL=https://your-app-name.netlify.app
```

#### Email Service (Resend)
```
RESEND_API_KEY=re_your_actual_resend_api_key
```

#### AI Features (Optional)
```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### How to Generate NEXTAUTH_SECRET
Run this command locally:
```bash
openssl rand -base64 32
```
Or use an online generator: https://generate-secret.vercel.app/32

## Database Provider Options

Since Netlify is a serverless platform, you need an external PostgreSQL database:

### Recommended Providers:

1. **Neon** (Recommended - Serverless PostgreSQL)
   - Free tier: 0.5GB storage
   - Automatically pauses when inactive
   - Website: https://neon.tech
   - Get connection string from dashboard

2. **Supabase**
   - Free tier: 500MB database
   - Includes auth & storage
   - Website: https://supabase.com
   - Use the "Connection pooling" URL for better serverless performance

3. **Railway**
   - $5/month starter plan
   - Good for production
   - Website: https://railway.app

4. **AWS RDS** or **Google Cloud SQL**
   - Enterprise-grade
   - Pay-as-you-go pricing

## Netlify Build Settings

### Build Configuration
In your Netlify site settings, configure:

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Functions directory:**
```
netlify/functions
```

### netlify.toml (Optional)
Create a `netlify.toml` file in your project root for additional configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Deployment Steps

### First-Time Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "fix: Configure Prisma for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect Next.js settings

3. **Set Environment Variables**
   - Before deploying, add all required environment variables (see above)
   - Go to Site settings → Environment variables → Add variables

4. **Run Database Migrations**
   After the first successful deployment, run migrations:
   ```bash
   # Locally with production DATABASE_URL
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

5. **Create Super Admin User**
   ```bash
   # Locally with production DATABASE_URL
   DATABASE_URL="your-production-url" npm run create:superadmin
   ```

### Subsequent Deployments

Every push to your main branch will trigger automatic deployment.

## Troubleshooting

### Build Still Failing?

1. **Check Build Logs**
   - Go to Netlify dashboard → Deploys → Click failed deploy
   - Look for specific error messages

2. **Verify Environment Variables**
   - Ensure `DATABASE_URL` is set correctly
   - No trailing spaces in values
   - Use connection pooling URL if available

3. **Database Connection Issues**
   - Ensure your database allows connections from Netlify IPs
   - Check if database is running and accessible
   - Test connection string locally first

4. **Prisma Generate Errors**
   If you see Prisma client errors, try:
   ```bash
   # Locally
   npx prisma generate
   npm run build
   ```

### Common Issues

**Issue**: "Can't reach database server"
**Solution**: Your database might be blocking Netlify's IP range. Check firewall settings.

**Issue**: "prisma generate failed"
**Solution**: Ensure `prisma` is in `dependencies` (not `devDependencies`) in package.json

**Issue**: Environment variables not working
**Solution**:
- Redeploy after adding variables (they don't apply to existing builds)
- Check for typos in variable names
- Ensure no quotes around values in Netlify UI

## Testing Locally Before Deploy

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the project
npm run build

# Start production server
npm start
```

If the local build succeeds, the Netlify build should also succeed (assuming environment variables are set correctly).

## Post-Deployment Checklist

- [ ] Database is accessible and migrations are applied
- [ ] Super admin user is created
- [ ] All environment variables are set in Netlify
- [ ] Site loads without errors
- [ ] Can log in with super admin credentials
- [ ] Database operations work (create invoice, customer, etc.)
- [ ] Email notifications work (if configured)

## Support

If you continue to experience issues:
1. Check Netlify build logs for specific errors
2. Verify all environment variables are correct
3. Test database connection separately
4. Review the Netlify Next.js plugin documentation: https://docs.netlify.com/integrations/frameworks/next-js/

---

**Last Updated**: 2025-10-14
**Fixes Applied**: Prisma client build-time error handling
