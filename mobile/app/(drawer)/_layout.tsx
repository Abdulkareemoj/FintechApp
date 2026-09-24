import type { Href } from "expo-router";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import type { LucideIcon } from "lucide-react-native";
import {
  Bell,
  ChartNoAxesCombined,
  CircleHelp,
  CreditCard,
  FileText,
  House,
  LifeBuoy,
  LogOut,
  MessageSquare,
  ReceiptText,
  Settings,
  WalletCards,
} from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/lib/authStore";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: LucideIcon;
  route: string;
}

const primaryItems: NavItem[] = [
  { label: "Dashboard", icon: House, route: "/(drawer)/(tabs)/home" },
  { label: "Cards", icon: CreditCard, route: "/(drawer)/(tabs)/cards" },
  { label: "Transfers", icon: WalletCards, route: "/(drawer)/(tabs)/transfers" },
];

const moneyItems: NavItem[] = [
	{ label: "Accounts", icon: WalletCards, route: "/(drawer)/accounts" },
	{ label: "Transactions", icon: ReceiptText, route: "/(drawer)/transactions" },
	{ label: "Top Up", icon: WalletCards, route: "/(drawer)/top-up" },
	{ label: "Bills", icon: ReceiptText, route: "/(drawer)/bills" },
	{ label: "Statements", icon: FileText, route: "/(drawer)/statements" },
	{ label: "Analytics", icon: ChartNoAxesCombined, route: "/(drawer)/analytics" },
	{ label: "Reports", icon: FileText, route: "/(drawer)/reports" },
];

const supportItems: NavItem[] = [
	{ label: "Support tickets", icon: LifeBuoy, route: "/(drawer)/support" },
	{ label: "Help Center", icon: CircleHelp, route: "/(drawer)/support/help" },
	{ label: "Messages", icon: MessageSquare, route: "/(drawer)/support/messages" },
	{ label: "Notifications", icon: Bell, route: "/(drawer)/notifications" },
];

const accountItems: NavItem[] = [
	{ label: "Profile", icon: WalletCards, route: "/(drawer)/profile" },
	{ label: "Settings", icon: Settings, route: "/(drawer)/settings" },
];

function CustomDrawerContent() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Your account";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "FT";

  const isActive = (route: string) => {
    const stripGroups = (path: string) =>
      path
        .replace(/\([^)]*\)/g, "")
        .replace(/\/+/g, "/")
        .replace(/\/$/, "");
    return stripGroups(pathname) === stripGroups(route);
  };

  const renderSection = (label: string, items: NavItem[]) => (
    <View className="mt-6 px-3" key={label}>
      <Text className="mb-2 px-3 font-semibold text-[10px] text-slate-500 uppercase tracking-[2px]">
        {label}
      </Text>
      {items.map((item) => (
        <NavRow
          key={item.route}
          {...item}
          active={isActive(item.route)}
          onPress={() => router.push(item.route as Href)}
        />
      ))}
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="border-slate-800 border-b px-5 pt-12 pb-6">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-teal-400">
            <Text className="font-bold text-slate-950 text-xl">{initials}</Text>
          </View>
          <View className="rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1.5">
            <Text className="font-semibold text-[10px] text-teal-300 uppercase tracking-widest">
              Secure
            </Text>
          </View>
        </View>
        <Text className="font-semibold text-slate-100 text-lg" numberOfLines={1}>
          {displayName}
        </Text>
        <Text className="mt-1 text-slate-400 text-xs" numberOfLines={1}>
          {user?.email ?? "Manage your FinTech account"}
        </Text>
      </View>

      {renderSection("Overview", primaryItems)}
      {renderSection("Money", moneyItems)}
      {renderSection("Stay Informed", supportItems)}
      {renderSection("Account", accountItems)}

      <View className="mt-8 border-slate-800 border-t px-3 pt-4">
        <Button
          variant="ghost"
          className="flex-row items-center justify-start gap-3"
          onPress={() => {
            clearAuth();
            router.replace("/(auth)/sign-in" as Href);
          }}
        >
          <Icon as={LogOut} className="size-5 text-rose-400" />
          <Text className="font-medium text-rose-300 text-sm">Sign out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

function NavRow({
  icon: IconComponent,
  label,
  active,
  onPress,
}: NavItem & { active: boolean; onPress: () => void }) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-start gap-3 rounded-xl px-3",
        active ? "bg-teal-400/12" : "",
      )}
    >
      <Icon
        as={IconComponent}
        className={cn("size-5", active ? "text-teal-300" : "text-slate-500")}
      />
      <Text
        className={cn(
          "text-sm",
          active ? "font-semibold text-slate-100" : "text-slate-300",
        )}
      >
        {label}
      </Text>
    </Button>
  );
}

function DrawerHeader({ title }: { title: string }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const toggleDrawer = () => {
    (navigation as unknown as { toggleDrawer: () => void }).toggleDrawer();
  };

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center border-slate-800 border-b bg-slate-950 px-4 pb-3"
    >
      <Button
        variant="ghost"
        size="icon"
        onPress={toggleDrawer}
        className="mr-3 h-11 w-11 rounded-xl bg-slate-900"
        accessibilityLabel="Open navigation menu"
      >
        <Icon as={WalletCards} className="text-teal-300" size={20} />
      </Button>
      <Text className="font-semibold text-lg text-slate-100" numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        header: ({ options }) => (
          <DrawerHeader title={(options.title ?? "FinTech") as string} />
        ),
        drawerStyle: { backgroundColor: "#020617", width: 296 },
        drawerType: "slide",
        overlayColor: "rgba(2, 6, 23, 0.68)",
        swipeEdgeWidth: 48,
        sceneStyle: { backgroundColor: "#020617" },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false, title: "Dashboard" }} />
		<Drawer.Screen name="accounts" options={{ title: "Accounts" }} />
      <Drawer.Screen name="transactions" options={{ title: "Transactions" }} />
		<Drawer.Screen name="top-up" options={{ title: "Top Up" }} />
		<Drawer.Screen name="bills" options={{ title: "Bills" }} />
      <Drawer.Screen name="statements" options={{ title: "Statements" }} />
      <Drawer.Screen name="analytics" options={{ title: "Analytics" }} />
		<Drawer.Screen name="reports" options={{ title: "Reports" }} />
      <Drawer.Screen name="notifications" options={{ title: "Notifications" }} />
		<Drawer.Screen name="support" options={{ title: "Support" }} />
		<Drawer.Screen name="support/help" options={{ title: "Help Center" }} />
		<Drawer.Screen name="support/messages" options={{ title: "Messages" }} />
		<Drawer.Screen name="profile" options={{ title: "Profile & verification" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
}
