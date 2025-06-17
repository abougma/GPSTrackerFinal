import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import API_BASE_URL from "../config/apiConfig";

export default function HistoryScreen() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPositions()
  }, [])

  const loadPositions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/positions`);
      if (!response.ok) {
        console.error("Erreur lors de la récupération des positions depuis l'API:", response.status);
        Alert.alert("Erreur API", "Impossible de charger l'historique des positions depuis le serveur.");
        setPositions([]);
        return;
      }
      const apiPositions = await response.json();
    
      apiPositions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPositions(apiPositions || []);
    } catch (error) {
      console.error("Error loading positions from API:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du chargement de l'historique.");
    } finally {
      setLoading(false);
    }
  }

  const exportData = async () => {
    if (positions.length === 0) {
      Alert.alert("Aucune donnée", "Aucune position à exporter")
      return
    }

    try {
      // Créer le contenu CSV
      const csvHeader = "ID,Latitude,Longitude,Date,Heure\n"
      const csvContent = positions
        .map((position) => {
          const date = new Date(position.createdAt)
          return `${position._id},${position.latitude},${position.longitude},${date.toLocaleDateString()},${date.toLocaleTimeString()}`
        })
        .join("\n")

      const fullCsvContent = csvHeader + csvContent

      // Créer le fichier
      const fileName = `positions_${new Date().toISOString().split("T")[0]}.csv`
      const fileUri = FileSystem.documentDirectory + fileName

      await FileSystem.writeAsStringAsync(fileUri, fullCsvContent)

      // Partager le fichier
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri)
      } else {
        // Fallback pour partager le contenu comme texte
        await Share.share({
          message: fullCsvContent,
          title: "Export des positions GPS",
        })
      }

      Alert.alert("Succès", "Données exportées avec succès !")
    } catch (error) {
      console.error("Export error:", error)
      Alert.alert("Erreur", "Erreur lors de l'export des données")
    }
  }

  const deletePosition = async (positionId) => {
    Alert.alert("Supprimer", "Êtes-vous sûr de vouloir supprimer cette position ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedPositions = positions.filter((p) => p._id !== positionId)
            await AsyncStorage.setItem("positions", JSON.stringify(updatedPositions))
            setPositions(updatedPositions)
          } catch (error) {
            Alert.alert("Erreur", "Erreur lors de la suppression")
          }
        },
      },
    ])
  }

  const formatCoordinate = (coord) => {
    return Number.parseFloat(coord).toFixed(6)
  }

  const renderPosition = ({ item, index }) => (
    <View style={styles.positionCard}>
      <View style={styles.positionHeader}>
        <Text style={styles.positionTitle}>Position {positions.length - index}</Text>
        <TouchableOpacity onPress={() => deletePosition(item._id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.coordinatesContainer}>
        <View style={styles.coordinateRow}>
          <Ionicons name="navigate" size={16} color="#666" />
          <Text style={styles.coordinateText}>Lat: {formatCoordinate(item.latitude)}</Text>
        </View>
        <View style={styles.coordinateRow}>
          <Ionicons name="navigate" size={16} color="#666" />
          <Text style={styles.coordinateText}>Lng: {formatCoordinate(item.longitude)}</Text>
        </View>
      </View>

      <View style={styles.timestampContainer}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.timestampText}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des positions</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportData}>
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={styles.exportButtonText}>Exporter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {positions.length} position{positions.length > 1 ? "s" : ""} enregistrée{positions.length > 1 ? "s" : ""}
        </Text>
      </View>

      {positions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Aucune position enregistrée</Text>
          <Text style={styles.emptySubtext}>Commencez par ajouter une position depuis le dashboard</Text>
        </View>
      ) : (
        <FlatList
          data={positions}
          renderItem={renderPosition}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadPositions}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  exportButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  exportButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  summary: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  list: {
    padding: 20,
  },
  positionCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deleteButton: {
    padding: 5,
  },
  coordinatesContainer: {
    gap: 5,
    marginBottom: 10,
  },
  coordinateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timestampText: {
    fontSize: 12,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
})
