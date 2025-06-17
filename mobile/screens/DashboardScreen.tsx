import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../config/apiConfig";

export default function DashboardScreen({ navigation }) {
  const [positions, setPositions] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    loadData()

    const intervalId = setInterval(() => {
      loadData();
    }, 3000); 
    return () => clearInterval(intervalId);
  }, []); 

  const loadData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username")
      if (storedUsername) {
        setUsername(storedUsername)
      }

      const response = await fetch(`${API_BASE_URL}/positions`);
      if (!response.ok) {
        console.error("Erreur lors de la récupération des positions depuis l'API:", response.status);
        Alert.alert("Erreur API", "Impossible de charger les positions depuis le serveur.");
        setPositions([]); 
        return;
      }
      const apiPositions = await response.json();
      const sortedPositions = (apiPositions || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPositions(sortedPositions);
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const getLastPosition = () => {
    return positions.length > 0 ? positions[0] : null
  }

  const formatCoordinate = (coord) => {
    return Number.parseFloat(coord).toFixed(6)
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour, {username}</Text>
        <Text style={styles.subtitle}>Tableau de bord GPS</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="location" size={30} color="#007AFF" />
          <Text style={styles.statNumber}>{positions.length}</Text>
          <Text style={styles.statLabel}>Positions enregistrées</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time" size={30} color="#34C759" />
          <Text style={styles.statNumber}>{positions.length > 0 ? "1" : "0"}</Text>
          <Text style={styles.statLabel}>Sessions actives</Text>
        </View>
      </View>

      {getLastPosition() && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dernière position</Text>
          <View style={styles.positionInfo}>
            <View style={styles.coordinateRow}>
              <Ionicons name="navigate" size={20} color="#666" />
              <Text style={styles.coordinateText}>Lat: {formatCoordinate(getLastPosition().latitude)}</Text>
            </View>
            <View style={styles.coordinateRow}>
              <Ionicons name="navigate" size={20} color="#666" />
              <Text style={styles.coordinateText}>Lng: {formatCoordinate(getLastPosition().longitude)}</Text>
            </View>
            <Text style={styles.timestampText}>{new Date(getLastPosition().createdAt).toLocaleString()}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CreatePosition")}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Ajouter une position</Text>
      </TouchableOpacity>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Map")}>
          <Ionicons name="map" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Voir la carte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("History")}>
          <Ionicons name="time" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Historique</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  positionInfo: {
    gap: 10,
  },
  coordinateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  coordinateText: {
    fontSize: 16,
    color: "#333",
  },
  timestampText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quickActions: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: "#007AFF",
    fontSize: 14,
    marginTop: 5,
  },
})
