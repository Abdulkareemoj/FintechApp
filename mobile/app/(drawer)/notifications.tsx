import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Bell, CreditCard, DollarSign, ArrowRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const notifications = [
  {
    id: "1",
    title: "Payment Received",
    description: "You've received $1,250.00 from Sarah Smith",
    time: "5 min ago",
    type: "payment",
    read: false,
  },
  {
    id: "2",
    title: "Security Alert",
    description: "New login from Chrome on Windows 11 · San Francisco, CA",
    time: "1 hr ago",
    type: "alert",
    read: false,
  },
  {
    id: "3",
    title: "Card Transaction",
    description: "Your card ending in 4521 was charged $45.00 at Starbucks",
    time: "2 hrs ago",
    type: "card",
    read: true,
  },
  {
    id: "4",
    title: "Bill Payment Due",
    description: "Your electricity bill of $124.50 is due in 3 days",
    time: "1 day ago",
    type: "bill",
    read: true,
  },
  {
    id: "5",
    title: "Account Updated",
    description: "Your profile information has been successfully updated",
    time: "2 days ago",
    type: "system",
    read: true,
  },
  {
    id: "6",
    title: "Transfer Completed",
    description: "Wire transfer of $3,000.00 to account ending in 4521 completed",
    time: "3 days ago",
    type: "payment",
    read: true,
  },
  {
    id: "7",
    title: "Monthly Statement",
    description: "Your February 2026 statement is now available for download",
    time: "5 days ago",
    type: "system",
    read: true,
  },
];

const typeIcons: Record<string, typeof Bell> = {
  payment: DollarSign,
  alert: AlertTriangle,
  card: CreditCard,
  bill: Bell,
  system: CheckCircle,
};

export default function NotificationsScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Notifications</Text>
        <Text className="text-muted-foreground">Alerts, updates, and activity from your account.</Text>
      </View>

      <Card>
        <CardHeader className="pb-2">
          <View className="flex-row items-center justify-between">
            <CardTitle>Recent</CardTitle>
            {notifications.some((n) => !n.read) && (
              <TouchableOpacity>
                <Text className="text-primary text-sm font-medium">Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.map((n, i) => {
            const IconComponent = typeIcons[n.type] || Bell;
            return (
              <TouchableOpacity
                key={n.id}
                activeOpacity={0.7}
                className={`flex-row items-start gap-3 px-4 py-3.5 ${i < notifications.length - 1 ? "border-b border-border" : ""}`}
              >
                <View
                  className={`rounded-full p-2 ${n.type === "alert" ? "bg-red-500/10" : n.type === "payment" ? "bg-emerald-500/10" : "bg-muted"}`}
                >
                  <Icon
                    as={IconComponent}
                    size={16}
                    className={n.type === "alert" ? "text-red-500" : n.type === "payment" ? "text-emerald-500" : "text-muted-foreground"}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-sm ${!n.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                      {n.title}
                    </Text>
                    <Text className="text-muted-foreground text-xs">{n.time}</Text>
                  </View>
                  <Text className="text-muted-foreground text-sm mt-0.5" numberOfLines={2}>
                    {n.description}
                  </Text>
                </View>
                {!n.read && <View className="mt-1.5 h-2 w-2 rounded-full bg-primary" />}
              </TouchableOpacity>
            );
          })}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
