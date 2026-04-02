# Duinophile - Gamified Learning Platform

Welcome to the Duinophile project repository! Please follow these exact steps to get the environment running on your local computer.

## 1. Clone the Repository
Open a terminal in your workspace folder and run:
```bash
git clone https://github.com/IT24102913/WMT-test.git
cd WMT-test
```

## 2. Backend Setup
You need to install the server libraries and set up the secret variables.
```bash
# Go into the backend directory
cd backend

# Install all backend libraries
npm install
```

**Environment Variables Setup:**
. In the `backend` folder, create new file called .env i'll send the codings for save in there

**Run the Backend:**
Once `.env` is saved, keep your backend running by typing:
```bash
npm run dev
```

## 3. Mobile Setup
Open a **new, separate terminal** so your backend isn't closed, and set up the React Native app.
```bash
# From the root folder, go into the mobile directory
cd mobile

# Install all mobile and Expo libraries
npm install
```

**Run the Mobile App:**
```bash
npx expo start
```
Scan the QR code on your phone using the **Expo Go** app, or press `a` to run an Android Emulator!

---

### Need to push your changes?
Always make sure you pull first to avoid messing up the history!
```bash
git pull origin main
git checkout -b feature/your-feature-name
# Make your changes
git add .
git commit -m "Added my task"
git push -u origin feature/your-feature-name
```
