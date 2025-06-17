import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Location from "expo-location"
import API_BASE_URL from "../config/apiConfig";

export default function CreatePositionScreen({ navigation }) {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const getCurrentLocation = async () => {
    setGettingLocation(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Permission d'accès à la localisation refusée")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLatitude(location.coords.latitude.toString())
      setLongitude(location.coords.longitude.toString())
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'obtenir la position actuelle")
    } finally {
      setGettingLocation(false)
    }
  }

  const validateCoordinates = () => {
    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    const device = Number.parseInt(deviceId) 


    if (isNaN(lat) || isNaN(lng) || (deviceId && isNaN(device))) { 
      Alert.alert("Erreur", "Veuillez entrer des coordonnées et un Device ID valides")
      return false
    }

    if (lat < -90 || lat > 90) {
      Alert.alert("Erreur", "La latitude doit être entre -90 et 90")
      return false
    }

    if (lng < -180 || lng > 180) {
      Alert.alert("Erreur", "La longitude doit être entre -180 et 180")
      return false
    }

    return true
  }

 const savePosition = async () => {
  if (!validateCoordinates()) return;

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/positions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
        deviceId: Number.parseInt(deviceId),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert("Erreur", errorData.message || "Erreur lors de l'enregistrement de la position");
      return;
    }

    Alert.alert("Succès", "Position enregistrée avec succès !", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);

  } catch (error) {
      Alert.alert("Erreur", "Une erreur de connexion est survenue. Vérifiez votre connexion ou l'adresse du serveur.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle Position</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Device Id</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2"
            value={deviceId}
            onChangeText={setDeviceId}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 48.8566"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2.3522"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
        </View>

      

        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} disabled={gettingLocation}>
          <Ionicons name="location" size={20} color="#007AFF" />
          <Text style={styles.locationButtonText}>
            {gettingLocation ? "Localisation..." : "Utiliser ma position actuelle"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={savePosition}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? "Enregistrement..." : "Enregistrer"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "white",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 10,
  },
  locationButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
