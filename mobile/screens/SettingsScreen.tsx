import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../config/apiConfig";

export default function SettingsScreen({ navigation, setIsAuthenticated }) {
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
              method: "POST", 
            });

            if (!response.ok) {
              console.warn("Avertissement: L'appel à l'API de déconnexion a échoué, mais la déconnexion locale va continuer.");
            }
          } catch (apiError) {
            console.warn("Erreur lors de l'appel à l'API de déconnexion:", apiError);
          }
          await AsyncStorage.removeItem("username");
          if (setIsAuthenticated) {
            setIsAuthenticated(false);
          }
        },
      },
    ])
  }

  const clearAllData = () => {
    Alert.alert("Effacer les données", "Êtes-vous sûr de vouloir effacer toutes les positions enregistrées ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Effacer",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("positions")
          Alert.alert("Succès", "Toutes les données ont été effacées")
        },
      },
    ])
  }

  const SettingItem = ({ icon, title, subtitle, onPress, color = "#333" }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color }]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Général</Text>

        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Gérer les notifications"
          onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}
        />

        <SettingItem
          icon="location-outline"
          title="Localisation"
          subtitle="Paramètres de géolocalisation"
          onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}
        />

        <SettingItem
          icon="cloud-outline"
          title="Synchronisation"
          subtitle="Sauvegarder dans le cloud"
          onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Données</Text>

        <SettingItem
          icon="download-outline"
          title="Exporter les données"
          subtitle="Télécharger vos positions"
          onPress={() => navigation.navigate("History")}
        />

        <SettingItem
          icon="trash-outline"
          title="Effacer les données"
          subtitle="Supprimer toutes les positions"
          onPress={clearAllData}
          color="#FF3B30"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos</Text>

        <SettingItem
          icon="information-circle-outline"
          title="Version"
          subtitle="1.0.0"
          onPress={() => Alert.alert("Version", "GPS Tracker v1.0.0")}
        />

        <SettingItem
          icon="help-circle-outline"
          title="Aide"
          subtitle="Support et FAQ"
          onPress={() => Alert.alert("Aide", "Contactez le support")}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
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
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginLeft: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  settingItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
