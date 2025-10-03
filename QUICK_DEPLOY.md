# 🚀 Quick Deploy Guide - HOOPS Trainer

## Ready to Go Live! 🎉

Your HOOPS Trainer app is production-ready! Here's how to deploy it with a custom domain:

---

## 🎯 **Recommended: Vercel + Custom Domain**

### **Step 1: Prepare Your Code**
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### **Step 2: Deploy to Vercel**
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your `hoops-trainer` repository**
5. **Click "Deploy"**

### **Step 3: Add Environment Variables**
In Vercel dashboard → Project Settings → Environment Variables:
```
NEXTAUTH_URL = https://your-domain.com
NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
```

### **Step 4: Buy & Configure Domain**
1. **Buy domain** (Namecheap, GoDaddy, etc.) - ~$10-15/year
2. **In Vercel** → Project Settings → Domains
3. **Add your domain** (e.g., `hoops-trainer.com`)
4. **Update DNS** as instructed by Vercel
5. **SSL certificate** will be automatic!

---

## 💰 **Cost Breakdown**

### **Free Option:**
- **Vercel**: Free tier (100GB bandwidth/month)
- **Domain**: $10-15/year
- **Total**: ~$15/year

### **Professional Option:**
- **Vercel Pro**: $20/month
- **Domain**: $10-15/year  
- **Total**: ~$25/month

---

## 🎨 **Your App Features**

✅ **Homepage** with Resources section
✅ **Video Library** with YouTube title fetching
✅ **Resource Management** (YouTube, Instagram, Facebook)
✅ **Content Management** with edit/delete
✅ **Responsive Design** for all devices
✅ **Production Optimized** with security headers

---

## 🚀 **Deploy Now!**

### **Option A: Use the Script**
```bash
./deploy.sh
```

### **Option B: Manual Steps**
1. **Push to GitHub**
2. **Go to Vercel.com**
3. **Import repository**
4. **Add environment variables**
5. **Deploy!**

---

## 🌐 **After Deployment**

Your app will be live at:
- **Vercel URL**: `https://hoops-trainer-xxx.vercel.app`
- **Custom Domain**: `https://your-domain.com`

### **Features Available:**
- ✅ **Add YouTube videos** with automatic title fetching
- ✅ **Manage resources** (channels, profiles, pages)
- ✅ **Edit/delete** content
- ✅ **Responsive design** on all devices
- ✅ **Fast loading** with CDN

---

## 🎉 **You're Ready!**

Your HOOPS Trainer app is:
- ✅ **Production-ready**
- ✅ **Optimized for performance**
- ✅ **Secure with HTTPS**
- ✅ **Mobile-friendly**
- ✅ **SEO-optimized**

**Go live and start training! 🏀**
