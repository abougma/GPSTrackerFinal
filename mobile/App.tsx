import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import DashboardScreen from "./screens/DashboardScreen"
import MapScreen from "./screens/MapScreen"
import SettingsScreen from "./screens/SettingsScreen"
import ProfileScreen from "./screens/ProfileScreen"
import HistoryScreen from "./screens/HistoryScreen"
import CreatePositionScreen from "./screens/CreatePositionScreen";
import WelcomeScreen from "./screens/WelcomeScreen"; // Importer le WelcomeScreen

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function TabNavigator({ setIsAuthenticated }) { 
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true); // Nouvel état pour l'écran de bienvenue

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      
      const storedUsername = await AsyncStorage.getItem("username")
      setIsAuthenticated(!!storedUsername)
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  if (isAuthLoading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" options={{ animationTypeForReplace: isAuthLoading ? 'pop' : 'push' }}>
              {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Main">
              {(props) => <TabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="CreatePosition" component={CreatePositionScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
