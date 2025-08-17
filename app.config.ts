export default {
  expo: {
    name: "wakeup-app",
    slug: "wakeup-app",
    version: "1.0.0",
    orientation: "portrait",
    sdkVersion: "51.0.0",
    platforms: ["ios", "android"],
    android: {
      package: "com.yourname.wakeupapp",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "VIBRATE",
      ],
    },
    ios: {
      bundleIdentifier: "com.yourname.wakeupapp",
      infoPlist: {
        NSLocationAlwaysUsageDescription: "We need your location to wake you up at the right station.",
        NSLocationWhenInUseUsageDescription: "We need your location to wake you up at the right station.",
      },
    },
  },
};
