import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

// Import your screens
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AddProduct from "./AddProduct/AddProduct";
import AllProduct from "./AllProduct/AllProduct";
import AddCategories from "./AddCategories/AddCategories";
import AllCategories from "./AllCategories/AllCategories";
import OrdersListScreen from "./Order/OrderList";
import OrderDetailsScreen from "./Order/OrderAdminDetailScreen";
import AdminNotificationScreen from "./AdminNotification/AdminNotificationScreen";
import AdminChatList from "./AdminChat/AdminChatList";
import AdminChatScreen from "./AdminChat/AdminChatScreen";

// Create navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator (for Admin functionality)
function AdminDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="AdminDashboard">
      <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
      <Drawer.Screen name="AddProduct" component={AddProduct} />
      <Drawer.Screen name="AllProduct" component={AllProduct} />
      <Drawer.Screen name="AddCategories" component={AddCategories} />
      <Drawer.Screen name="AllCategories" component={AllCategories} />
      <Drawer.Screen name="AllOrders" component={OrdersListScreen} />

      <Drawer.Screen
        name="AllNotifications"
        component={AdminNotificationScreen}
      />
    </Drawer.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator initialRouteName="Admin">
      {/* Customer Chat Screen */}

      {/* Admin Screens (with Drawer) */}
      <Stack.Screen
        name="Admin"
        component={AdminDrawerNavigator}
        options={{ headerShown: false }} // Hide header for nested drawer
      />
      {/* Admin Chat Screen */}
      <Stack.Screen
        name="OrderDetailsAdmin"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
      <Stack.Screen
        name="Help"
        component={AdminChatList}
        options={{ title: "Messages" }}
      />
      <Stack.Screen name="ChatAdmin" component={AdminChatScreen} />
    </Stack.Navigator>
  );
}
