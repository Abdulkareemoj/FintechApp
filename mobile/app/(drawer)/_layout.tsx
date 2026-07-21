import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  ArrowLeft,
  Bell,
  CreditCard,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Receipt,
  Settings,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

// ─── Custom Drawer Content ────────────────────────────────────────────────────
function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Cards", icon: CreditCard, route: "/(drawer)/(tabs)/cards" },
    { label: "Transactions", icon: Receipt, route: "/transactions" },
    { label: "Messages", icon: MessageSquare, route: "/messages" },
    { label: "Notifications", icon: Bell, route: "/notifications" },
    { label: "Investments", icon: TrendingUp, route: "/invest" },
    { label: "Security", icon: Shield, route: "/security" },
    { label: "Help & Support", icon: HelpCircle, route: "/help" },
    { label: "Settings", icon: Settings, route: "/settings" },
  ] as const;

  return (
    <DrawerContentScrollView
      {...props}
      className="bg-zinc-950"
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={false}
    >
      {/* ── Profile Header ── */}
      <View className="border-zinc-900 px-5 pt-9 pb-5">
        {/* Avatar */}
        <View className="mb-3 h-[60px] w-[60px] items-center justify-center rounded-full bg-blue-500">
          <Text className="font-bold text-[22px] text-white">JD</Text>
        </View>

        <Text
          className="font-semibold text-[17px] text-white tracking-tight"
          numberOfLines={1}
        >
          John Doe
        </Text>
        <Text className="mt-0.5 text-[13px] text-zinc-500" numberOfLines={1}>
          john.doe@bank.com
        </Text>

        {/* Premium badge */}
        <View className="mt-2.5 flex-row items-center gap-1.5 self-start rounded-full bg-blue-500/10 px-2.5 py-1">
          <Icon as={Star} className="text-blue-400" size={11} />
          <Text className="font-semibold text-[11px] text-blue-400">
            Premium
          </Text>
        </View>
      </View>
      <Separator className="my-4" />

      {/* ── Nav Items ── */}
      <View className="flex-1 px-2 pt-2">
        <DrawerItem
          icon={({ size }) => (
            <Icon
              as={Home}
              className={
                pathname === "/(drawer)/(tabs)/home" || pathname === "/"
                  ? "text-blue-400"
                  : "text-zinc-500"
              }
              size={size}
            />
          )}
          label="Dashboard"
          labelStyle={{
            color:
              pathname === "/(drawer)/(tabs)/home" || pathname === "/"
                ? "#3E6AE1"
                : "#5C5E62",
            fontWeight:
              pathname === "/(drawer)/(tabs)/home" || pathname === "/"
                ? "600"
                : "400",
            fontSize: 14,
            marginLeft: 8,
          }}
          onPress={() => router.push("/(drawer)/(tabs)/home")}
          style={{
            borderRadius: 10,
            backgroundColor:
              pathname === "/(drawer)/(tabs)/home" || pathname === "/"
                ? "rgba(62,106,225,0.08)"
                : "transparent",
            marginBottom: 2,
          }}
        />

        {navItems.map((item) => {
          const isActive = pathname.includes(item.route.split("/").pop() || "");
          return (
            <DrawerItem
              icon={({ size }) => (
                <Icon
                  as={item.icon}
                  className={isActive ? "text-blue-400" : "text-zinc-500"}
                  size={size}
                />
              )}
              key={item.route}
              label={item.label}
              labelStyle={{
                color: isActive ? "#3E6AE1" : "#5C5E62",
                fontWeight: isActive ? "600" : "400",
                fontSize: 14,
                marginLeft: 12,
              }}
              onPress={() => router.push(item.route)}
              style={{
                borderRadius: 10,
                backgroundColor: isActive
                  ? "rgba(62,106,225,0.08)"
                  : "transparent",
                marginBottom: 2,
              }}
            />
          );
        })}
      </View>

      {/* ── Sign Out ── */}
      <View className="border-zinc-900 border-t px-5 pt-4 pb-9">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center gap-2.5"
          onPress={() => router.replace("/(auth)/sign-in")}
        >
          <Icon as={LogOut} className="text-red-500" size={19} />
          <Text className="font-medium text-red-400 text-sm">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// ─── Drawer Header Component ──────────────────────────────────────────────
function DrawerHeader({ title }: { title: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center border-zinc-900 border-b bg-zinc-950 px-4 pb-3"
      style={{ paddingTop: insets.top }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-zinc-900"
        onPress={() => router.back()}
      >
        <Icon as={ArrowLeft} className="text-zinc-200" size={20} />
      </TouchableOpacity>
      <Text
        className="font-bold text-lg text-white tracking-tight"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

// ─── Root Drawer Layout ───────────────────────────────────────────────────────
export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: ({ options }) => (
          <DrawerHeader
            title={
              (options.title || options.drawerLabel || "Untitled") as string
            }
          />
        ),
        drawerStyle: { backgroundColor: "#171A20", width: 285 },
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.55)",
        swipeEdgeWidth: 50,
        sceneStyle: { backgroundColor: "#171A20" },
      }}
    >
      {/* Tabs are the main shell - No header here as Tabs has its own */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          drawerLabel: "Dashboard",
          title: "Dashboard",
        }}
      />

      <Drawer.Screen
        name="transactions"
        options={{
          headerShown: true,
          drawerLabel: "Transactions",
          title: "Transaction History",
        }}
      />
      <Drawer.Screen
        name="messages"
        options={{
          headerShown: true,
          drawerLabel: "Messages",
          title: "Bank Messages",
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          headerShown: true,
          drawerLabel: "Notifications",
          title: "Alerts & Updates",
        }}
      />
      <Drawer.Screen
        name="invest"
        options={{
          headerShown: true,
          drawerLabel: "Investments",
          title: "Investment Portfolio",
        }}
      />
      <Drawer.Screen
        name="security"
        options={{
          headerShown: true,
          drawerLabel: "Security",
          title: "Security Settings",
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          headerShown: true,
          drawerLabel: "Help & Support",
          title: "Help Center",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          headerShown: true,
          drawerLabel: "Settings",
          title: "App Settings",
        }}
      />
      <Drawer.Screen
        name="search"
        options={{
          headerShown: true,
          drawerLabel: "Search",
          title: "Search Transactions",
        }}
      />
    </Drawer>
  );
}
