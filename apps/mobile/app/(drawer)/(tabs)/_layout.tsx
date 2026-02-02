import { Tabs } from "expo-router";
import { Heart, Home, MessageSquare, ShoppingCart } from "lucide-react-native";
import React from "react";
import { Icon } from "@/components/ui/icon";

function TabBarIcon({
  name,
  focused,
}: {
  name: React.ComponentProps<typeof Icon>["as"];
  focused: boolean;
}) {
  const colorClass = focused ? "text-primary" : "text-muted-foreground";
  return <Icon as={name} className={colorClass} size={24} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Headers handled by the parent Drawer/Stack
        tabBarActiveTintColor: "hsl(var(--primary))",
        tabBarInactiveTintColor: "hsl(var(--muted-foreground))",
        tabBarStyle: {
          backgroundColor: "hsl(var(--background))",
          borderTopWidth: 0,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -6,
          marginBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Home} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={ShoppingCart} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: "Transfers",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Heart} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={MessageSquare} />
          ),
        }}
      />
    </Tabs>
  );
}
