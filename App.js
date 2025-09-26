// App.js - Main application entry point with nested navigation
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import AddStoryByURLScreen from './src/screens/AddStoryByURLScreen';
import GameScreen from './src/screens/GameScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StoreScreen from './src/screens/StoreScreen';

// Context
import { GameProvider } from './src/context/GameContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Library" 
        component={LibraryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Game" 
        component={GameScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function StoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Store" 
        component={StoreScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'LibraryTab') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'StoreTab') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryStack}
        options={{ title: 'Library' }}
      />
      <Tab.Screen 
        name="StoreTab" 
        component={StoreStack}
        options={{ title: 'Store' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="AddByURL" 
            component={AddStoryByURLScreen}
            options={{ 
              headerShown: true,
              title: 'Add Game from URL',
              headerBackTitle: 'Settings'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}