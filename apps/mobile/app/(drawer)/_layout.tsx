import Drawer from "expo-router/drawer";
import { LayoutGrid, Settings, TrendingUp, User } from "lucide-react-native";
import React from "react";
import { Icon } from "@/components/ui/icon";

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "hsl(var(--background))",
          borderBottomWidth: 0,
          elevation: 0,
          height: 56,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 20,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
          drawerLabel: "Home",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon as={LayoutGrid} color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="account"
        options={{
          title: "Account",
          drawerLabel: "Account",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon as={User} color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="invest"
        options={{
          title: "Invest",
          drawerLabel: "Invest",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon as={TrendingUp} color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerLabel: "Settings",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon as={Settings} color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
