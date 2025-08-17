Sleep-in-Metro 🚇

Sleep-in-Metro is a React Native + Expo app that helps you sleep on public transport without missing your stop. The app tracks your location in the background and wakes you up when you are near your chosen station.

Features:

- Current Location: Automatically detects your location using GPS.
- Station Search: Search for metro/bus/train stations by name using OpenStreetMap.
- Background Tracking: Tracks your location even when the app is in the background.
- Wake-up Notification: Sends a notification and vibration alert when you are near your destination.
- Customizable Radius: Choose how close you want to be to your stop before the alert triggers.

Installation & Running:

1. Clone the repository:

   git clone https://github.com/yourusername/sleep-in-metro.git
   cd sleep-in-metro

2. Install dependencies:

   npm install

3. Start the Expo development server:

   npx expo start -c

4. Open the app on your phone:

   - Scan the QR code with Expo Go app (Android/iOS).  
   - Make sure you allow location permissions and background tracking.

How to Use:

1. Open the app and allow location access.  
2. Type your station name in the search box.  
3. Select the correct station from the results.  
4. Enter a wake-up radius in meters (e.g., 500).  
5. Press "Start background tracking".  
6. The app will notify you with vibration when you are near your stop.

Permissions:

- Location (Foreground & Background): To track your position.  
- Notifications & Vibration: To wake you up at your station.  

Android uses ACCESS_FINE_LOCATION, ACCESS_BACKGROUND_LOCATION, FOREGROUND_SERVICE, and VIBRATE.  
iOS uses NSLocationAlwaysUsageDescription and NSLocationWhenInUseUsageDescription.

Project Structure:

wakeup-app/
├─ App.tsx               - Main app file
├─ app.config.ts         - Expo config with permissions
├─ package.json          - Project dependencies
└─ src/
   ├─ search.ts          - Station search function using OpenStreetMap
   └─ background.ts      - Background GPS tracking and notifications

Notes:

- Background tracking may be limited on some phones when running inside Expo Go. For full background support, build a standalone app:

   npx expo prebuild
   npx expo run:android

- Always allow location permissions and keep the app running in background for notifications to work properly.
