import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

TaskManager.defineTask('LOCATION_TASK', async ({ data, error }) => {
  if (error) return;

  const { locations } = data as any;
  const location = locations[0];
  if (!location) return;

  const { latitude, longitude } = location.coords;
  const dest = (data as any).params?.dest;
  const radius = (data as any).params?.radius || 500;

  if (dest) {
    const d = getDistanceFromLatLonInM(
      latitude,
      longitude,
      dest.latitude,
      dest.longitude
    );
    if (d <= radius) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Wake up! 🚨',
          body: `You are near your destination (${Math.round(d)}m away).`,
        },
        trigger: null,
      });
      await Location.stopLocationUpdatesAsync('LOCATION_TASK');
    }
  }
});

function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}
