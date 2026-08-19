import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  ArrowUpDown,
  Bell,
  CreditCard,
  Home,
  Menu,
  User,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

// ─── Custom Header ────────────────────────────────────────────────────
function TabHeader({ title }: { title: string }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View
      className="relative flex-row items-center justify-between border-zinc-900 border-b bg-zinc-950 px-5 pb-3.5"
      style={{ paddingTop: insets.top + 2 }}
    >
      <View
        className="absolute right-0 left-0 items-center justify-center"
        pointerEvents="none"
        style={{ top: insets.top + 2, bottom: 14 }}
      >
        <Text className="font-bold text-[17px] text-white tracking-tight">
          {title}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        className="h-10 w-10 items-center justify-center rounded-xl bg-zinc-900"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Icon as={Menu} className="text-zinc-200" size={20} />
      </TouchableOpacity>

      <View className="flex flex-row gap-2">
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-xl bg-zinc-900"
          onPress={() => router.push("/notifications")}
        >
          <View>
            <Icon as={Bell} className="text-zinc-200" size={20} />
            <View className="-top-1 -right-1 absolute h-4 w-4 items-center justify-center rounded-full bg-red-500">
              <Text className="font-bold text-[9px] text-white">2</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Animated Tab Item ────────────────────────────────────────────────
const TAB_ITEMS = [
  { name: "home", icon: Home, label: "Home" },
  { name: "cards", icon: CreditCard, label: "Cards" },
  { name: "transfers", icon: ArrowUpDown, label: "Transfers" },
  { name: "more", icon: User, label: "More" },
] as const;

function AnimatedTabItem({
  item,
  focused,
  onPress,
}: {
  item: (typeof TAB_ITEMS)[number];
  focused: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pillOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const pillScale = useRef(new Animated.Value(focused ? 1 : 0.7)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pillOpacity, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.spring(pillScale, {
        toValue: focused ? 1 : 0.7,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(labelOpacity, {
        toValue: focused ? 1 : 0.45,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const iconColor = focused ? "#3E6AE1" : "#5C5E62"; // blue-500 : zinc-500

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1, alignItems: "center" }}
    >
      <Animated.View
        style={{ alignItems: "center", gap: 4, transform: [{ scale }] }}
      >
        {/* Icon + pill */}
        <View
          style={{
            width: 44,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Animated pill background */}
          <Animated.View
            style={{
              position: "absolute",
              width: 44,
              height: 28,
              borderRadius: 14,
              backgroundColor: "rgba(62,106,225,0.15)",
              opacity: pillOpacity,
              transform: [{ scaleX: pillScale }],
            }}
          />
          <Icon as={item.icon} color={iconColor} size={20} />
        </View>

        {/* Label */}
        <Animated.Text
          style={{
            opacity: labelOpacity,
            fontSize: 12,
            fontWeight: focused ? "600" : "400",
            color: focused ? "#3E6AE1" : "#5C5E62",
            letterSpacing: -0.2,
          }}
        >
          {item.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────
function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const getCurrentTab = () => {
    const segment = pathname.split("/").pop() ?? "";
    return TAB_ITEMS.find((t) => t.name === segment)?.name ?? "home";
  };

  const currentTab = getCurrentTab();

  return (
    <View
      style={{
        backgroundColor: "#171A20",
        borderTopWidth: 1,
        borderTopColor: "#252529",
        paddingBottom: insets.bottom + 8,
        paddingTop: 10,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {TAB_ITEMS.map((item) => (
        <AnimatedTabItem
          focused={currentTab === item.name}
          item={item}
          key={item.name}
          onPress={() => router.push(`/${item.name}`)}
        />
      ))}
    </View>
  );
}

// ─── Tabs Layout ──────────────────────────────────────────────────────
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => <TabHeader title={getTitleForRoute(route.name)} />,
      })}
      tabBar={() => <CustomTabBar />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="cards" />
      <Tabs.Screen name="transfers" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}

function getTitleForRoute(routeName: string): string {
  const map: Record<string, string> = {
    home: "🏦 Dashboard",
    cards: "Cards",
    transfers: "Transfers",
    more: "More",
  };
  return map[routeName] ?? "Banking";
}
