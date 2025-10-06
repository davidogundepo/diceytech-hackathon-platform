# DiceyTech Testing Guide

## 🚀 Getting Started

This guide provides **EXACT** steps to test every Firebase-integrated feature of the DiceyTech platform.

---

## 📋 Prerequisites

Before testing, ensure:
1. Firebase project is set up and environment variables are configured in `.env`
2. Firestore database is created
3. Firebase Authentication is enabled (Email/Password and Google providers)
4. Firebase Storage is enabled

---

## 🌱 Step 0: Seed the Database

**This is REQUIRED before testing!** The database needs sample data.

1. Open your browser console (F12)
2. Navigate to the app homepage: `http://localhost:5173`
3. In the console, run:
```javascript
import { seedDatabase } from './src/utils/seedData';
await seedDatabase();
```

**OR** create a temporary button in your app to trigger seeding:
```tsx
import { seedDatabase } from '@/utils/seedData';

<Button onClick={async () => {
  await seedDatabase();
  toast({ title: "Database seeded!" });
}}>
  Seed Database
</Button>
```

**Expected Result:**
- Console will show progress: "Creating sample users...", "Creating sample projects...", etc.
- Final message: "Database seeding completed successfully!"
- You'll see a summary of created items

**Verify in Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database
4. You should see collections: `users`, `projects`, `hackathons`, `achievements`, `applications`, `notifications`, `userAchievements`

---

## 🔐 Test 1: Sign Up with Email/Password

**Exact Steps:**
1. Navigate to the login page: `http://localhost:5173`
2. Click **"Sign up for free"** link at the bottom of the form
3. Fill in the registration form:
   - Full Name: `Test User`
   - Username: `testuser`
   - Email: `test@diceytech.com`
   - Password: `Test123!@#`
   - Confirm Password: `Test123!@#`
4. Click **"Create Account"** button

**What Should Happen:**
- Button shows "Creating account..." loading state
- Toast notification: "Account created! Welcome to DiceyTech!"
- You are automatically redirected to `/dashboard`
- Top navigation shows your profile with display name "Test User"

**Verify in Firebase Console:**
1. Go to Authentication tab
2. You should see a new user with email `test@diceytech.com`
3. Go to Firestore Database → `users` collection
4. Find document with the same UID as the authenticated user
5. Document should contain: `email`, `displayName`, `role`, `skills`, `profileCompleteness`, `createdAt`, `updatedAt`

**Possible Issues:**
- ❌ Error: "Email already in use" → Email exists, use a different one
- ❌ Error: "Weak password" → Password must be at least 6 characters
- ❌ Redirect fails → Check if `/dashboard` route exists

---

## 🔑 Test 2: Sign In with Google

**Exact Steps:**
1. If logged in, click profile picture → **"Logout"**
2. You're back at login page: `http://localhost:5173`
3. Look for the **"Sign in with Google"** button (white button with Google icon below the email/password form)
4. Click **"Sign in with Google"**
5. Google popup appears
6. Select a Google account or sign in
7. Grant permissions

**What Should Happen:**
- Google authentication popup opens
- After selecting account, popup closes
- Toast notification: "Welcome! You have successfully signed in with Google."
- You are redirected to `/dashboard`
- Profile picture in navigation shows your Google avatar
- Display name shows your Google name

**Verify in Firebase Console:**
1. Go to Authentication tab
2. You should see a new user with your Google email
3. Sign-In Provider shows "google.com"
4. Go to Firestore Database → `users` collection
5. New document created with your UID
6. Contains: `email` (from Google), `displayName`, `photoURL` (Google avatar), `role: "user"`

**Possible Issues:**
- ❌ "Popup blocked" → Allow popups in browser settings
- ❌ "Unauthorized domain" → In Firebase Console → Authentication → Settings → Authorized domains, add `localhost`
- ❌ Google button not visible → Check if `react-icons` package is installed

---

## 📝 Test 3: Create a Project

**Exact Steps:**
1. Make sure you're logged in
2. Navigate to **"Add Project"** from sidebar (or go to `/add-project`)
3. Fill in the project form:
   - Project Title: `My Test Project`
   - Description: `This is a test project to verify Firebase integration works correctly.`
   - Category: Select `Web Development`
   - Difficulty: Select `Intermediate`
   - Demo URL: `https://test-project-demo.com`
   - GitHub URL: `https://github.com/testuser/test-project`
   - Tech Stack: Add tags: `React`, `TypeScript`, `Firebase`
   - Skills: Add: `Frontend`, `Database`
   - Challenges: `Learning Firebase integration`
   - Learnings: `Implemented real-time updates`
   - Future Improvements: `Add more features`
   - Status: Select `In Development`
4. (Optional) Upload a project image
5. Click **"Submit Project"**

**What Should Happen:**
- If image uploaded: Shows upload progress percentage
- Button shows "Submitting..." loading state
- Toast notification: "Project created successfully!"
- You are redirected to `/my-portfolio`
- Your new project appears in the portfolio grid

**Verify in Firebase Console:**
1. Go to Firestore Database → `projects` collection
2. Find your project (newest document)
3. Document should contain all fields you entered:
   - `userId` matches your UID
   - `title`, `description`, `category`, `difficulty`
   - `techStack` (array), `skills` (array)
   - `views: 0`, `likes: 0`
   - `createdAt`, `updatedAt` (timestamps)
4. If you uploaded an image:
   - Go to Storage tab
   - Navigate to `project-images/` folder
   - You should see your uploaded image file

**Possible Issues:**
- ❌ "Unauthorized" error → Firestore security rules might be too restrictive
- ❌ Image upload fails → Check Storage rules allow authenticated users to write
- ❌ Project not appearing → Check if `getUserProjects` function filters by userId correctly

---

## 🖼️ Test 4: Upload a Profile Picture

**Exact Steps:**
1. Make sure you're logged in
2. Navigate to **"Profile"** from sidebar (or go to `/profile`)
3. Look for the profile picture avatar (top-left of profile section)
4. Click on the avatar or "Upload" button
5. Select an image file (JPG, PNG, max 2MB recommended)
6. Click **"Save Changes"** button at bottom of form

**What Should Happen:**
- Image preview updates immediately
- Button shows "Saving..." loading state
- Toast notification: "Profile updated successfully"
- Page reloads or profile section updates
- New avatar appears in top navigation bar

**Verify in Firebase Console:**
1. Go to Storage tab
2. Navigate to `avatars/` folder
3. You should see a file named like `[your-user-id].jpg` or `.png`
4. Click on the file to see the preview
5. Go to Firestore Database → `users` collection
6. Find your user document
7. `photoURL` field should contain the Firebase Storage download URL (starts with `https://firebasestorage.googleapis.com/...`)

**Possible Issues:**
- ❌ Upload fails → Check Storage rules allow authenticated users to upload to `avatars/{userId}`
- ❌ Image doesn't display → photoURL might not be saved to Firestore correctly
- ❌ File too large → Resize image or compress it

---

## 📚 Test 5: View Projects (Firestore Data)

**Exact Steps:**
1. Navigate to **"Explore Projects"** from sidebar (or go to `/explore-projects`)
2. Wait for projects to load (should see skeleton loaders first)
3. Scroll through the project grid

**What Should Happen:**
- Loading skeletons appear briefly
- Projects from seed data appear in a grid
- Each project shows:
  - Title (e.g., "AfriPay - Mobile Money Integration Platform")
  - Description preview
  - Category badge
  - Tech stack tags
  - Author name
  - Views and likes count
- Click on a project card → redirects to `/project/[project-id]`

**What You're Verifying:**
- Data is coming from Firestore, NOT mock/hardcoded data
- `getAllProjects()` function works
- Projects have images, proper formatting

**Verify It's Real Data:**
1. Open browser DevTools → Network tab
2. Filter by "Firestore" or look for requests to `firestore.googleapis.com`
3. You should see network requests fetching project documents
4. In Console, you can run:
```javascript
// This should match what's displayed
const { getAllProjects } = await import('./src/services/firestoreService');
const projects = await getAllProjects();
console.log(projects);
```

**Verify in Firebase Console:**
1. Go to Firestore Database → `projects` collection
2. Count the number of documents (should be 15 from seed data + any you created)
3. The displayed projects should match these documents

**Possible Issues:**
- ❌ No projects show → Check Firestore rules allow read access
- ❌ Shows error → Check console for Firestore errors
- ❌ Infinite loading → Check `getAllProjects` function doesn't have bugs

---

## 🎯 Test 6: View Hackathons (Firestore Data)

**Exact Steps:**
1. Navigate to **"Hackathons"** from sidebar (or go to `/hackathons`)
2. Wait for hackathons to load
3. Browse the hackathon cards

**What Should Happen:**
- Hackathons from seed data appear (e.g., "AfriFintech Innovation Challenge 2025")
- Each card shows:
  - Title
  - Description
  - Category badge (e.g., "Fintech", "Healthcare")
  - Dates (start and end)
  - Prize information
  - Participant count
  - "Active" or "Ended" badge
- Filter buttons at top (All, Active, Upcoming, Ended) work
- Search box filters by title

**Verify It's Real Data:**
1. Open browser DevTools → Network tab
2. Look for Firestore requests
3. In Console:
```javascript
const { getAllHackathons } = await import('./src/services/firestoreService');
const hackathons = await getAllHackathons();
console.log(hackathons);
```

**Verify in Firebase Console:**
1. Go to Firestore Database → `hackathons` collection
2. You should see 10 hackathon documents
3. Each has: `title`, `description`, `category`, `startDate`, `endDate`, `prize`, `isActive`, etc.

---

## 🔔 Test 7: Real-Time Notifications

**Exact Steps:**
1. Make sure you're logged in with the FIRST seeded user (email: `kwame.tech@diceytech.com`)
   - Or sign up with a new account and manually create notifications in Firestore
2. Navigate to **"Notifications"** from sidebar (or go to `/notifications`)
3. You should see 5 sample notifications from seed data

**What Should Happen:**
- Notifications appear in list format:
  - "New Hackathon Alert!" (unread)
  - "Achievement Unlocked!" (unread)
  - "Project Milestone" (read - grayed out)
  - "Application Update" (unread)
  - "Welcome to DiceyTech!" (read)
- Unread notifications have a colored background
- Click **"Mark as Read"** on an unread notification
- Notification immediately turns gray (no page reload needed!)
- Bell icon in top navigation shows unread count badge

**Test Real-Time Updates:**
1. Keep notifications page open
2. Open Firebase Console → Firestore Database → `notifications` collection
3. Manually add a new notification document:
```json
{
  "userId": "[your-user-id]",
  "type": "system",
  "title": "Test Real-Time",
  "message": "This should appear instantly!",
  "isRead": false,
  "category": "system",
  "createdAt": [current timestamp]
}
```
4. **Without refreshing the page**, the new notification should appear in your list!

**Verify in Firebase Console:**
1. After marking notification as read
2. Go to Firestore → `notifications` → find that notification
3. `isRead` field should now be `true`

**Possible Issues:**
- ❌ Notifications don't appear → Check userId matches your logged-in user
- ❌ Real-time updates don't work → Check Firestore subscription in `Notifications.tsx`
- ❌ Can't mark as read → Check Firestore rules allow updates

---

## 🏆 Test 8: Achievements

**Exact Steps:**
1. Navigate to **"Achievements"** from sidebar (or go to `/achievements`)
2. View available achievements

**What Should Happen:**
- All achievements display with:
  - Icon (emoji)
  - Title
  - Description
  - Points value
  - Rarity badge (Common, Rare, Epic, Legendary)
- Your earned achievements show "Unlocked" badge or checkmark
- Unearned achievements show "Locked" or progress bar

**Verify in Firebase Console:**
1. Go to Firestore Database → `achievements` collection
2. Should see 8 achievement documents
3. Go to `userAchievements` collection
4. Find documents where `userId` matches yours
5. These are your earned achievements

---

## 📱 Test 9: Dashboard (Real Data)

**Exact Steps:**
1. Navigate to **"Dashboard"** from sidebar (or go to `/dashboard`)
2. Observe all sections

**What Should Happen:**
- **Stats Cards** show:
  - Your total projects count
  - Hackathons participated
  - Points/rank
  - Profile completion percentage
- **Recent Projects** section:
  - Shows YOUR projects (fetched from Firestore)
  - If you haven't created any, shows empty state
- **Upcoming Events** section:
  - Shows active hackathons
  - Real data from `hackathons` collection

**Verify:**
1. Projects shown match your `userId` in Firestore
2. Stats are calculated from your actual data

---

## 🔍 Test 10: Search and Filters

**Test on Explore Projects:**
1. Go to `/explore-projects`
2. Use search box: Type `"Mobile Money"` → Should show "AfriPay" project
3. Filter by category: Select `"Fintech"` → Shows only fintech projects
4. Filter by difficulty: Select `"Advanced"` → Shows only advanced projects

**Test on Hackathons:**
1. Go to `/hackathons`
2. Use search box: Type `"Health"` → Should show healthcare hackathons
3. Click filter buttons: `"Active"` → Shows only active hackathons

---

## ⚠️ Common Issues & Solutions

### Issue: "Missing or insufficient permissions"
**Solution:** Check Firestore Security Rules. For development, you can use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Issue: "Storage: User does not have permission"
**Solution:** Check Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /project-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Issue: Projects not showing
**Solution:**
1. Check browser console for errors
2. Verify Firestore connection in DevTools Network tab
3. Check if `getAllProjects()` is being called
4. Verify projects exist in Firestore Console

### Issue: Google Sign-In fails
**Solution:**
1. In Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add authorized domains: `localhost`, your production domain
4. Check browser allows popups

### Issue: Real-time updates not working
**Solution:**
1. Check Firestore subscriptions are set up (`.onSnapshot()`)
2. Verify cleanup functions run on unmount
3. Check browser console for subscription errors

---

## ✅ Success Checklist

After completing all tests, you should have verified:

- [x] Email/password registration works
- [x] Google Sign-In works
- [x] Users are created in Firestore
- [x] Projects can be created and saved
- [x] Images upload to Firebase Storage
- [x] Profile pictures save and display
- [x] Projects are fetched from Firestore (not mock data)
- [x] Hackathons are fetched from Firestore
- [x] Notifications work with real-time updates
- [x] Achievements display correctly
- [x] Dashboard shows real user data
- [x] Search and filters work

---

## 🎉 Next Steps

Once all tests pass:
1. Configure production Firebase project
2. Update environment variables for production
3. Set up proper Firestore Security Rules (more restrictive)
4. Set up Firebase Storage Rules
5. Enable Firebase Analytics (optional)
6. Set up Firebase Hosting for deployment

---

## 📞 Need Help?

If tests are failing:
1. Check browser console for errors (F12)
2. Check Firebase Console for authentication/database errors
3. Verify environment variables are set correctly
4. Check Firestore and Storage rules
5. Ensure Firebase SDK is properly initialized

Happy Testing! 🚀
