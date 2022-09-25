import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const API_KEY = "v2SRCGHU06h3rSc5G4XhbrL7Dum3C2RX";
const API_URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=`;

export default function App() {
  const [region, setRegion] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("");

  const handleLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed for location!");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0221,
    });
    handleMarker(latitude, longitude);
  };

  useEffect(() => {
    handleLocation();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}${address}`);
      const json = await res.json();
      const latitude = json.results[0].locations[0].latLng.lat;
      const longitude = json.results[0].locations[0].latLng.lng;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      });
      handleMarker(latitude, longitude);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarker = (latitude, longitude) => {
    setCoordinates({
      latitude,
      longitude,
    });
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.mapContainer} region={region}>
        {coordinates !== null && (
          <Marker
            coordinate={coordinates}
            title={address || "Current location"}
          />
        )}
      </MapView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setAddress(text)}
          value={address}
        />
        <Button title="Show" onPress={handleSearch} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    marginTop: "10%",
    height: "90%",
    width: "100%",
  },
  inputContainer: {
    marginVertical: 5,
    width: "50%",
  },
  input: {
    textAlign: "center",
    marginBottom: 3,
    borderBottomColor: "dodgerblue",
    borderBottomWidth: 1.5,
  },
});
