import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import Signup from "./Signup";
import LoginScreen from "./LoginScreen";
import AppIntro from "./AppIntro";
import ForgetPassword from "./ForgetPassword";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import AdminNavigator from "./Admin/AdminNavigator";
import MarketPlaceScreen from "./MarketPlaceScreen";
import NotificationScreen from "./NotificationScreen";
import SettingsScreen from "./SettingsScreen";
import WishlistScreen from "./WishlistScreen";
import { CartProvider } from "./CartContext";
import Checkout from "./Checkout";
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6366F1", // Indigo
    secondary: "#EC4899", // Pink
    background: "#F9FAFB",
    surface: "#FFFFFF",
    text: "#111827",
    accent: "#8B5CF6", // Purple
    error: "#EF4444",
    success: "#10B981",
  },
};
const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
         
          marginBottom:10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MarketPlace"
        component={MarketPlaceScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store" size={24} color={color} />
          ),
        }}
        screenOptions={{ headerShown: false }}
      />
      <Tab.Screen
        name="WishList"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" size={24} color={color} />
          ),
        }}
        screenOptions={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
        screenOptions={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="AppIntro"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: theme.colors.background },
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              screenOptions={{ headerShown: true }}
            />
            <Stack.Screen name="AppIntro" component={AppIntro} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background },
              }}
            />
            <Stack.Screen name="Admin" component={AdminNavigator} />
            <Stack.Screen
              name="Layout"
              component={MyTabs}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background },
              }}
            />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Settings" component={SettingsScreen}/>
            <Stack.Screen name="Notifications" component={NotificationScreen}/>
            <Stack.Screen
              name="Forget"
              component={ForgetPassword}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </PaperProvider>
  );
}
