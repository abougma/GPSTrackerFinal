import { useState, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import API_BASE_URL from "../config/apiConfig";

export default function MapScreen() {
  const [positions, setPositions] = useState([])
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPositions()
  }, [])

  const loadPositions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/positions`)
      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger les positions depuis l'API.")
        setPositions([])
        return
      }
      const allPositions = await response.json()

      if (allPositions && allPositions.length > 0) {
        allPositions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setPositions(allPositions); 

        const mostRecentPosition = allPositions[0]
        setRegion({
          latitude: mostRecentPosition.latitude,
          longitude: mostRecentPosition.longitude,
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421,
        })
      } else {
        setPositions([])
        Alert.alert("Info", "Aucune position trouvée.")
      }
    } catch (error) {
      console.error("Error loading positions:", error)
      Alert.alert("Erreur", "Une erreur est survenue lors du chargement des positions.")
      setPositions([])
    } finally {
      setLoading(false)
    }
  }

  const centerOnMostRecentPosition = () => {
    if (positions.length > 0) {
      const lastPosition = positions[0]
      setRegion({
        latitude: lastPosition.latitude,
        longitude: lastPosition.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    } else {
      Alert.alert("Aucune position", "Aucune position à centrer.")
    }
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {positions.map((position, index) => (
          <Marker
            key={position._id}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
            title={index === 0 ? "Dernière position" : `Position #${positions.length - index}`}
            description={new Date(position.createdAt).toLocaleString()}
            pinColor={index === 0 ? "blue" : "red"} 
          />
        ))}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnMostRecentPosition}>
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={loadPositions}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          {positions.length > 0 ? `${positions.length} position(s) affichée(s)` : "Aucune position à afficher"}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  controls: {
    position: "absolute",
    right: 20,
    top: 60,
    gap: 10,
  },
  controlButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  info: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
})
