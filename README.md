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

**Connecting to the Backend (Important!):**
Because you are running the server locally, your Expo app needs to know your computer's IP address to connect to the backend.
1. Open your terminal and type `ipconfig` (if on Windows) or `ifconfig` (if on Mac/Linux).
2. Find your **IPv4 Address** (it will look something like `192.168.1.X`).
3. Open the file `mobile/src/api/axiosConfig.js`.
4. Change the `BASE_URL` to match your IP address: `const BASE_URL = 'http://YOUR_IPV4_ADDRESS:5000/api';`

**Run the Mobile App:**
```bash
npx expo start
```
Scan the QR code on your phone using the **Expo Go** app, or press `a` to run an Android Emulator!

---


