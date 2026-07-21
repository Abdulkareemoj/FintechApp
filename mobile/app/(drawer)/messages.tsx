import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, CreditCard, Shield, Bell, ArrowRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const conversations = [
  {
    id: "1",
    name: "Finova Support",
    preview: "Your dispute case #DSP-2024 has been resolved.",
    time: "2 min ago",
    unread: 1,
    type: "support",
  },
  {
    id: "2",
    name: "Security Alert",
    preview: "New login detected from Chrome on Windows.",
    time: "1 hr ago",
    unread: 0,
    type: "alert",
  },
  {
    id: "3",
    name: "Transaction Receipt",
    preview: "Payment of $250.00 to Amazon.com completed.",
    time: "3 hrs ago",
    unread: 0,
    type: "receipt",
  },
  {
    id: "4",
    name: "Card Services",
    preview: "Your virtual card ending in 4521 has been activated.",
    time: "1 day ago",
    unread: 0,
    type: "card",
  },
  {
    id: "5",
    name: "Monthly Statement",
    preview: "Your March 2026 statement is now available.",
    time: "2 days ago",
    unread: 0,
    type: "statement",
  },
];

const typeIcons: Record<string, typeof MessageSquare> = {
  support: MessageSquare,
  alert: Shield,
  receipt: Bell,
  card: CreditCard,
  statement: MessageSquare,
};

export default function MessagesScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Messages</Text>
        <Text className="text-muted-foreground">Bank communications and updates.</Text>
      </View>

      <Card>
        <CardHeader className="pb-2">
          <View className="flex-row items-center justify-between">
            <CardTitle>Inbox</CardTitle>
            <Badge>
              <Text className="text-xs text-white">1 new</Text>
            </Badge>
          </View>
        </CardHeader>
        <CardContent className="p-0">
          {conversations.map((c, i) => {
            const IconComponent = typeIcons[c.type] || MessageSquare;
            return (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.7}
                className={`flex-row items-center gap-3 px-4 py-3.5 ${i < conversations.length - 1 ? "border-b border-border" : ""}`}
              >
                <View className={`rounded-full p-2 ${c.unread > 0 ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon
                    as={IconComponent}
                    size={18}
                    className={c.unread > 0 ? "text-primary" : "text-muted-foreground"}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-sm ${c.unread > 0 ? "font-semibold text-foreground" : "text-foreground"}`}>
                      {c.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs">{c.time}</Text>
                  </View>
                  <Text className="text-muted-foreground text-sm mt-0.5" numberOfLines={1}>
                    {c.preview}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
