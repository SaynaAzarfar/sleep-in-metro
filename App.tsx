import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, Vibration } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { v4 as uuidv4 } from 'uuid';

// --- Background Task ---
TaskManager.defineTask('LOCATION_TASK', async ({ data, error }) => {
  if (error) return;

  const { locations } = data as any;
  const location = locations[0];
  if (!location) return;

  const { latitude, longitude } = location.coords;
  const dest = (data as any).params?.dest;
  const radius = (data as any).params?.radius || 500;

  if (dest) {
    const d = getDistanceFromLatLonInM(latitude, longitude, dest.latitude, dest.longitude);
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
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// --- Search function ---
type Place = { displayName: string; lat: number; lon: number; };
async function searchPlaces(query: string): Promise<Place[]> {
  if (!query) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'wakeup-app/1.0' } });
  const json = (await res.json()) as any[];
  return json.map(item => ({ displayName: item.display_name, lat: Number(item.lat), lon: Number(item.lon) }));
}

// --- App ---
export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [dest, setDest] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState('500');
  const [alarmActive, setAlarmActive] = useState(false);

  // Request permissions & get current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return alert('Location permission denied');
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      await Location.requestBackgroundPermissionsAsync();
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  // Listen for notifications
  useEffect(() => {
    const sub1 = Notifications.addNotificationReceivedListener(() => {
      setAlarmActive(true);
      Vibration.vibrate([0,800,400,800,400,1000], true);
    });
    const sub2 = Notifications.addNotificationResponseReceivedListener(() => {
      setAlarmActive(false);
      Vibration.cancel();
    });
    return () => { sub1.remove(); sub2.remove(); };
  }, []);

  const runSearch = async () => {
    const res = await searchPlaces(query);
    setResults(res);
  };

  const startTracking = async () => {
    if (!dest) return alert('Select a destination first');
    await Location.startLocationUpdatesAsync('LOCATION_TASK', {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 50,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Sleep-in-the-Metro',
        notificationBody: 'Tracking your location...',
      },
      params: { dest, radius: Number(radius) },
    });
    alert('Tracking started! You can lock your phone.');
  };

  return (
    <View style={{ flex:1, padding:20, marginTop:40 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Sleep in the Metro 🚇</Text>
      {location && <Text>Your location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}</Text>}

      <View style={{ marginVertical:10 }}>
        <TextInput
          placeholder="Search station"
          value={query}
          onChangeText={setQuery}
          style={{ borderWidth:1, padding:8, borderRadius:6 }}
        />
        <Button title="Search" onPress={runSearch} />
      </View>

      <FlatList
        data={results}
        keyExtractor={() => uuidv4()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding:10, borderBottomWidth:1 }}
            onPress={() => {
              setDest({ latitude: item.lat, longitude: item.lon });
              setQuery(item.displayName);
              setResults([]);
            }}
          >
            <Text>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginVertical:10 }}>
        <Text>Wake-up radius (meters):</Text>
        <TextInput
          value={radius}
          onChangeText={setRadius}
          keyboardType="numeric"
          style={{ borderWidth:1, padding:8, borderRadius:6 }}
        />
      </View>

      <Button title="Start background tracking" onPress={startTracking} />

      {alarmActive && <Text style={{ color:'red', marginTop:20 }}>⏰ WAKE UP!</Text>}
    </View>
  );
}

