import React from "react";
import { ScrollView, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, ArrowLeftRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const stats = [
  { label: "Total Income", value: "$12,450", change: "+8.2%", up: true },
  { label: "Total Expenses", value: "$8,320", change: "+3.1%", up: false },
  { label: "Avg. Transaction", value: "$245", change: "-2.4%", up: false },
  { label: "Net Savings", value: "$4,130", change: "+12.5%", up: true },
];

const categories = [
  { name: "Food & Dining", amount: 2450, percentage: 29, color: "bg-orange-500" },
  { name: "Transport", amount: 1280, percentage: 15, color: "bg-blue-500" },
  { name: "Shopping", amount: 1850, percentage: 22, color: "bg-primary" },
  { name: "Bills & Utilities", amount: 1580, percentage: 19, color: "bg-green-500" },
  { name: "Entertainment", amount: 620, percentage: 8, color: "bg-pink-500" },
  { name: "Others", amount: 540, percentage: 7, color: "bg-zinc-500" },
];

export default function AnalyticsScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Analytics</Text>
        <Text className="text-muted-foreground">Track your spending and income trends.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="gap-4">
            <View className="flex-row items-center gap-3">
              <View className="rounded-full bg-emerald-500/10 p-2">
                <Icon as={TrendingUp} size={20} className="text-emerald-500" />
              </View>
              <View className="flex-1">
                <Text className="text-muted-foreground text-sm">Income</Text>
                <Text className="font-bold text-xl text-foreground">$12,450</Text>
              </View>
              <Badge><Text className="text-xs text-emerald-500">+8.2%</Text></Badge>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="rounded-full bg-red-500/10 p-2">
                <Icon as={TrendingDown} size={20} className="text-red-500" />
              </View>
              <View className="flex-1">
                <Text className="text-muted-foreground text-sm">Expenses</Text>
                <Text className="font-bold text-xl text-foreground">$8,320</Text>
              </View>
              <Badge><Text className="text-xs text-red-500">+3.1%</Text></Badge>
            </View>
          </View>
        </CardContent>
      </Card>

      <View className="flex-row flex-wrap gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex-1 min-w-[140px]">
            <CardContent className="p-4">
              <Text className="text-muted-foreground text-xs">{s.label}</Text>
              <Text className="font-bold text-lg text-foreground mt-1">{s.value}</Text>
              <Text className={`text-xs mt-0.5 ${s.up ? "text-emerald-500" : "text-red-500"}`}>
                {s.change}
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {categories.map((c) => (
            <View key={c.name} className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">{c.name}</Text>
                <Text className="text-sm text-muted-foreground">
                  ${c.amount.toLocaleString()} ({c.percentage}%)
                </Text>
              </View>
              <View className="h-2 rounded-full bg-muted">
                <View
                  className={`h-full rounded-full ${c.color}`}
                  style={{ width: `${c.percentage}%` }}
                />
              </View>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
