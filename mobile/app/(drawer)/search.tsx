import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpRight, ArrowDownLeft, Clock, TrendingUp } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const recentSearches = ["Amazon purchase", "Wire transfer", "Starbucks", "Electric bill"];

const results = [
  { id: "1", name: "Amazon.com", amount: "-$45.00", date: "Mar 15, 2026", type: "outgoing", category: "Shopping" },
  { id: "2", name: "Sarah Smith", amount: "+$1,250.00", date: "Mar 14, 2026", type: "incoming", category: "Transfer" },
  { id: "3", name: "Wire Transfer", amount: "-$3,000.00", date: "Mar 13, 2026", type: "outgoing", category: "Transfer" },
  { id: "4", name: "Starbucks", amount: "-$5.75", date: "Mar 13, 2026", type: "outgoing", category: "Food" },
];

export default function SearchScreen() {
  const [query, setQuery] = React.useState("");

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Search</Text>
        <Text className="text-muted-foreground">Find transactions, merchants, and more.</Text>
      </View>

      <View className="relative">
        <Icon as={Search} size={18} className="text-muted-foreground absolute left-3 top-3.5 z-10" />
        <Input
          placeholder="Search transactions, merchants..."
          value={query}
          onChangeText={setQuery}
          className="pl-10"
        />
      </View>

      {!query ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent searches</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {recentSearches.map((s) => (
              <TouchableOpacity
                key={s}
                activeOpacity={0.7}
                onPress={() => setQuery(s)}
                className="flex-row items-center gap-3 rounded-lg px-2 py-2.5"
              >
                <Icon as={Clock} size={16} className="text-muted-foreground" />
                <Text className="text-foreground text-sm">{s}</Text>
              </TouchableOpacity>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <View className="flex-row items-center justify-between">
              <CardTitle>Results</CardTitle>
              <Text className="text-muted-foreground text-xs">{results.length} found</Text>
            </View>
          </CardHeader>
          <CardContent className="p-0">
            {results.map((r, i) => (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.7}
                className={`flex-row items-center gap-3 px-4 py-3.5 ${i < results.length - 1 ? "border-b border-border" : ""}`}
              >
                <View className={`rounded-full p-2 ${r.type === "incoming" ? "bg-emerald-500/10" : "bg-muted"}`}>
                  <Icon
                    as={r.type === "incoming" ? ArrowDownLeft : ArrowUpRight}
                    size={16}
                    className={r.type === "incoming" ? "text-emerald-500" : "text-muted-foreground"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-sm font-medium">{r.name}</Text>
                  <Text className="text-muted-foreground text-xs">{r.date} · {r.category}</Text>
                </View>
                <Text className={`font-medium text-sm ${r.type === "incoming" ? "text-emerald-500" : "text-foreground"}`}>
                  {r.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}
