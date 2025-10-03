# 🚀 HOOPS Trainer - Deployment Guide

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)
**Best for**: Next.js apps, automatic deployments, custom domains
**Cost**: Free tier available, custom domain support

#### Steps:
1. **Push to GitHub** (if not already done)
2. **Go to [vercel.com](https://vercel.com)**
3. **Sign up/Login** with GitHub
4. **Import your repository**
5. **Configure environment variables**:
   - `NEXTAUTH_URL`: Your domain (e.g., `https://hoops-trainer.com`)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
6. **Deploy!**

#### Custom Domain Setup:
1. **In Vercel dashboard** → Project Settings → Domains
2. **Add your domain** (e.g., `hoops-trainer.com`)
3. **Update DNS records** as instructed
4. **SSL certificate** will be automatically provisioned

---

### Option 2: Netlify
**Best for**: Static sites, easy setup, custom domains
**Cost**: Free tier available, custom domain support

#### Steps:
1. **Push to GitHub** (if not already done)
2. **Go to [netlify.com](https://netlify.com)**
3. **Sign up/Login** with GitHub
4. **Import your repository**
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Add environment variables** in Site Settings → Environment Variables
7. **Deploy!**

---

### Option 3: Railway
**Best for**: Full-stack apps, databases, custom domains
**Cost**: $5/month for hobby plan

#### Steps:
1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create new project** from GitHub repo
4. **Configure environment variables**
5. **Deploy!**

---

## Environment Variables Setup

### Required Variables:
```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Custom Domain Setup

### 1. Purchase Domain
- **Recommended**: Namecheap, GoDaddy, Cloudflare
- **Cost**: $10-15/year for .com domains

### 2. Configure DNS
- **A Record**: Point to hosting provider's IP
- **CNAME**: Point www to your domain
- **SSL**: Most providers offer free SSL

### 3. Update Environment Variables
- Update `NEXTAUTH_URL` to your custom domain
- Redeploy the application

---

## Production Optimizations

### 1. Performance
- ✅ **Image optimization** (Next.js built-in)
- ✅ **Code splitting** (automatic)
- ✅ **Static generation** where possible
- ✅ **CDN** (automatic with Vercel/Netlify)

### 2. Security
- ✅ **HTTPS** (automatic SSL)
- ✅ **Security headers** (configured)
- ✅ **Environment variables** (secure storage)

### 3. Monitoring
- **Analytics**: Add Google Analytics or Vercel Analytics
- **Error tracking**: Consider Sentry for production monitoring

---

## Cost Breakdown

### Free Options:
- **Vercel**: Free tier (100GB bandwidth/month)
- **Netlify**: Free tier (100GB bandwidth/month)
- **Domain**: $10-15/year

### Paid Options:
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Custom domain**: $10-15/year
- **Total**: ~$25/month for professional setup

---

## Quick Start (Recommended)

1. **Choose Vercel** (best for Next.js)
2. **Buy domain** (e.g., `hoops-trainer.com`)
3. **Deploy to Vercel**
4. **Add custom domain**
5. **Update environment variables**
6. **Go live!**

---

## Support

If you need help with deployment:
1. **Check the hosting provider's documentation**
2. **Join their Discord/community**
3. **Contact their support**

Your app is production-ready! 🎉
