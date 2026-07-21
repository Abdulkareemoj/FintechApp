import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, PieChart, Plus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const holdings = [
  { id: "1", name: "S&P 500 ETF", ticker: "VOO", value: "$12,450", change: "+2.4%", up: true, allocation: 35 },
  { id: "2", name: "Tech Growth Fund", ticker: "TGF", value: "$8,200", change: "-1.2%", up: false, allocation: 23 },
  { id: "3", name: "Government Bonds", ticker: "GBD", value: "$6,800", change: "+0.8%", up: true, allocation: 19 },
  { id: "4", name: "Real Estate REIT", ticker: "RER", value: "$4,500", change: "+3.1%", up: true, allocation: 13 },
  { id: "5", name: "Crypto Basket", ticker: "CBX", value: "$3,550", change: "+5.7%", up: true, allocation: 10 },
];

export default function InvestScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Invest</Text>
        <Text className="text-muted-foreground">Manage your investment portfolio and track performance.</Text>
      </View>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="font-bold text-3xl text-foreground">$35,500.00</Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <Icon as={TrendingUp} size={16} className="text-emerald-500" />
            <Text className="text-emerald-500 text-sm font-medium">+$1,245 (3.6%)</Text>
            <Text className="text-muted-foreground text-xs">all time</Text>
          </View>
        </CardContent>
      </Card>

      <View className="flex-row gap-3">
        <Button className="flex-1 flex-row gap-2">
          <Icon as={Plus} size={18} className="text-primary-foreground" />
          <Text>Add funds</Text>
        </Button>
        <Button variant="outline" className="flex-1">
          <Text>Withdraw</Text>
        </Button>
      </View>

      <Card>
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <CardTitle>Holdings</CardTitle>
            <Text className="text-muted-foreground text-xs">5 assets</Text>
          </View>
        </CardHeader>
        <CardContent className="gap-3">
          {holdings.map((h) => (
            <View
              key={h.id}
              className="flex-row items-center gap-3 rounded-lg border border-border p-3"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Text className="font-bold text-xs text-foreground">{h.ticker}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-foreground text-sm">{h.name}</Text>
                <Text className="text-muted-foreground text-xs">{h.allocation}% portfolio</Text>
              </View>
              <View className="items-end">
                <Text className="font-semibold text-foreground">{h.value}</Text>
                <Text className={`text-xs ${h.up ? "text-emerald-500" : "text-red-500"}`}>
                  {h.change}
                </Text>
              </View>
            </View>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {holdings.map((h) => (
            <View key={h.id} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-foreground">{h.name}</Text>
                <Text className="text-xs text-muted-foreground">{h.allocation}%</Text>
              </View>
              <View className="h-1.5 rounded-full bg-muted">
                <View
                  className={`h-full rounded-full ${h.up ? "bg-emerald-500" : "bg-red-500"}`}
                  style={{ width: `${h.allocation}%` }}
                />
              </View>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
