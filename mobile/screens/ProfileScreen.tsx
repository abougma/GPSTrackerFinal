import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../config/apiConfig"; // Importer la configuration API

export default function ProfileScreen() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [positions, setPositions] = useState([])

  useEffect(() => {
    loadProfile()
    loadPositions()
  }, [])

  const loadProfile = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username")
      const storedEmail = await AsyncStorage.getItem("email")

      if (storedUsername) setUsername(storedUsername)
      if (storedEmail) setEmail(storedEmail)
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const loadPositions = async () => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/positions`);
      if (!response.ok) {
        console.error("Erreur ProfileScreen: Impossible de charger les positions depuis l'API", response.status);
        setPositions([]);
        return;
      }
      const apiPositions = await response.json();
      const sortedPositions = (apiPositions || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setPositions(sortedPositions);
    } catch (error) {
      console.error("Error loading positions in ProfileScreen:", error)
    }
  }

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("username", username)
      await AsyncStorage.setItem("email", email)
      setIsEditing(false)
      Alert.alert("Succès", "Profil mis à jour")
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la sauvegarde")
    }
  }

  const getFirstPosition = () => {
    return positions.length > 0 ? positions[0] : null
  }

  const getLastPosition = () => {
    return positions.length > 0 ? positions[positions.length - 1] : null
  }

  const StatCard = ({ icon, title, value, color = "#007AFF" }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={30} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePicture}>
          <Ionicons name="person" size={50} color="white" />
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email || "Email non renseigné"}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
            <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={username}
              onChangeText={setUsername}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              keyboardType="email-address"
              placeholder="votre@email.com"
            />
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsContainer}>
          <StatCard icon="location" title="Positions" value={positions.length.toString()} color="#34C759" />
          <StatCard icon="time" title="Jours actifs" value={positions.length > 0 ? "1" : "0"} color="#FF9500" />
        </View>
      </View>

      {positions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>

          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Première position</Text>
            <Text style={styles.activityDate}>{new Date(getFirstPosition().createdAt).toLocaleDateString()}</Text>
          </View>

          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Dernière position</Text>
            <Text style={styles.activityDate}>{new Date(getLastPosition().createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      )}
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
    alignItems: "center",
    padding: 30,
    paddingTop: 60,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  username: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 5,
  },
  section: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: 5,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#f9f9f9",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 15,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  activityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 10,
  },
  activityTitle: {
    fontSize: 16,
    color: "#333",
  },
  activityDate: {
    fontSize: 14,
    color: "#666",
  },
})
