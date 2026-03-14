# Firebase Setup Guide for GitHub Pages

This guide will help you set up Firebase Authentication and Realtime Database to enable the **Admin Panel** on GitHub Pages (static hosting).

---

## 🎯 Why Firebase?

GitHub Pages is **static hosting** - it doesn't support PHP backends. Firebase provides:
- ✅ **Authentication** (Email/Password login)
- ✅ **Realtime Database** (Store users, jobs, blogs)
- ✅ **Free Tier** (Spark Plan - no credit card required)
- ✅ **Works on GitHub Pages**

---

## 📋 Prerequisites

1. A GitHub account (for GitHub Pages)
2. A Google account (for Firebase)
3. Basic command line knowledge

---

## 🚀 Setup Steps (5-10 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., `gov-job-hai`)
4. **Disable Google Analytics** for now (not required)
5. Click **"Create project"**
6. Wait for project to be created (~30 seconds)

---

### Step 2: Enable Authentication

1. In Firebase Console, click **"Build"** → **"Authentication"** from left sidebar
2. Click **"Get Started"**
3. Click **"Sign-in method"** tab
4. Find **"Email/Password"** and click it
5. Toggle **"Enable"** to ON
6. Click **"Save"**

---

### Step 3: Enable Realtime Database

1. In Firebase Console, click **"Build"** → **"Realtime Database"** from left sidebar
2. Click **"Create Database"**
3. Select a location (choose closest to your users, e.g., `us-central`)
4. **Important:** Select **"Start in test mode"** (allows read/write for testing)
5. Click **"Enable"**

> ⚠️ **Security Note:** Test mode allows anyone to read/write your database. We'll secure it later.

---

### Step 4: Get Firebase Configuration

1. In Firebase Console, click the **⚙️ gear icon** (Project Settings)
2. Scroll down to **"Your apps"** section
3. Click the **"</>"** icon (Web app)
4. Enter app nickname: `gov-job-hai-web`
5. **Don't** check "Firebase Hosting"
6. Click **"Register app"**
7. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gov-job-hai.firebaseapp.com",
  databaseURL: "https://gov-job-hai-default-rtdb.firebaseio.com",
  projectId: "gov-job-hai",
  storageBucket: "gov-job-hai.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

8. Click **"Continue to console"**

---

### Step 5: Update firebase-config.js

1. Open `js/firebase-config.js` in your project
2. Replace the config object with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // Paste your API key
    authDomain: "gov-job-hai.firebaseapp.com",     // Paste your auth domain
    projectId: "gov-job-hai",                       // Paste your project ID
    storageBucket: "gov-job-hai.appspot.com",       // Paste your storage bucket
    messagingSenderId: "1234567890",                // Paste your sender ID
    appId: "1:1234567890:web:abcdef123456"         // Paste your app ID
};
```

3. Save the file

---

### Step 6: Create Admin User

#### Option A: Using the Setup Script (Recommended)

1. Open terminal/command prompt
2. Run the setup script:
   ```bash
   node scripts/setup-firebase-admin.js
   ```
3. Follow the prompts:
   - **Email:** Enter admin email (default: `admin@sarkari.com`)
   - **Password:** Enter admin password (default: `admin123`)
   - **Name:** Enter admin name (default: `Admin User`)
4. Copy the JSON output

#### Option B: Manual Setup

1. Create a JSON file with admin user data:
   ```json
   {
     "users": {
       "admin": {
         "email": "admin@sarkari.com",
         "name": "Admin User",
         "role": "admin",
         "createdAt": "2024-01-01T00:00:00.000Z"
       }
     }
   }
   ```

---

### Step 7: Import Admin User to Firebase

1. In Firebase Console, go to **"Realtime Database"**
2. Click the **three dots (⋮)** menu
3. Select **"Import JSON"**
4. Paste the JSON from Step 6
5. Click **"Import"**

**Result:** You should now see a `users` node with an `admin` child.

---

### Step 8: Create Admin User in Authentication

⚠️ **Important:** The database only stores user data. You also need to create the authentication account.

1. In Firebase Console, go to **"Authentication"** → **"Users"** tab
2. Click **"Add user"**
3. Enter the **same email and password** you used in Step 6:
   - Email: `admin@sarkari.com` (or whatever you chose)
   - Password: `admin123` (or whatever you chose)
4. Click **"Add user"**

**Result:** You should now see the user in the Authentication → Users tab.

---

### Step 9: Test the Setup

1. Deploy your changes to GitHub Pages (if not already deployed)
2. Open your GitHub Pages site
3. Go to `login.html`
4. You should see the login form (not the "Firebase Not Configured" message)
5. Enter your admin credentials:
   - Email: `admin@sarkari.com` (or what you chose)
   - Password: `admin123` (or what you chose)
6. Click **"Login"**

**✅ Success:** You should be logged in and redirected to the admin panel!

---

## 🔒 Secure Your Database (After Testing)

Once everything is working, secure your Realtime Database:

1. In Firebase Console, go to **"Realtime Database"** → **"Rules"** tab
2. Replace the test rules with:

```javascript
{
  "rules": {
    "users": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "jobs": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "blogs": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

3. Click **"Publish"**

> 📖 **What this does:**
> - Only authenticated admins can read/write `users` and `jobs`
> - Anyone can read `blogs` (public)
> - Only authenticated admins can write `blogs`

---

## 🐛 Troubleshooting

### Problem: "Firebase Not Configured" message still shows

**Solution:**
1. Check `js/firebase-config.js` - make sure you replaced all the values
2. Open browser console (F12) and look for errors
3. Make sure you copied the entire config object correctly

### Problem: Login shows "Firebase Auth not initialized"

**Solution:**
1. Open browser console (F12)
2. Check if Firebase SDK scripts are loading
3. Verify all 3 Firebase scripts are in `login.html`:
   - `firebase-app-compat.js`
   - `firebase-auth-compat.js`
   - `firebase-database-compat.js`

### Problem: "User not found in database" error

**Solution:**
1. Check Realtime Database → Data tab
2. Verify `users/admin` node exists
3. Verify the `uid` in your database matches the Firebase Authentication UID
4. **Important:** When you create user manually, use the Firebase Authentication UID as the key

### Problem: Authentication works but can't access admin panel

**Solution:**
1. Check Realtime Database → Data tab
2. Verify `users/{uid}/role` is set to `"admin"`
3. Make sure you're using the correct UID from Authentication

---

## 📚 Next Steps

After setup is complete:

1. **Create More Admins:**
   - Run `node scripts/setup-firebase-admin.js` for each admin
   - Import JSON to database
   - Create user in Authentication → Users

2. **Migrate Existing Data:**
   - If you have existing jobs/blogs in JSON files
   - You can import them to Realtime Database
   - Or continue using JSON files (they still work)

3. **Set Up Firebase Hosting (Optional):**
   - Firebase offers free hosting
   - Alternative to GitHub Pages
   - Includes custom domain support

---

## 🎉 You're Done!

Your admin panel now works on GitHub Pages! You can:
- ✅ Login to admin panel
- ✅ Create/edit/delete jobs
- ✅ Create/edit/delete blogs
- ✅ Manage website content

All without needing a PHP backend!

---

## 📞 Need Help?

- **Firebase Docs:** https://firebase.google.com/docs
- **Firebase Auth:** https://firebase.google.com/docs/auth
- **Realtime Database:** https://firebase.google.com/docs/database
- **GitHub Issues:** https://github.com/ROYALBANCHERS/GOV-JOB-HAI/issues

---

**Generated for:** GOV-JOB-HAI
**Last Updated:** 2024
**License:** MIT
