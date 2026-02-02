import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";

const cards = [
  { id: "card_1", brand: "Visa", last4: "4242", status: "active" as const },
  { id: "card_2", brand: "Mastercard", last4: "5512", status: "frozen" as const },
];

export default function Cards() {
  const [freezeMap, setFreezeMap] = React.useState<Record<string, boolean>>({
    card_1: false,
    card_2: true,
  });

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Cards</Text>
        <Text className="text-muted-foreground">Manage your cards securely.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Your cards</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          {cards.map((c) => (
            <View
              key={c.id}
              className="rounded-lg border border-border bg-background px-4 py-3"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium">{c.brand} ···· {c.last4}</Text>
                  <Text className="text-muted-foreground text-sm">
                    {freezeMap[c.id] ? "Frozen" : "Active"}
                  </Text>
                </View>
                <Switch
                  checked={!!freezeMap[c.id]}
                  onCheckedChange={(checked) =>
                    setFreezeMap((prev) => ({ ...prev, [c.id]: checked }))
                  }
                />
              </View>

              <View className="mt-3 flex-row gap-2">
                <Button className="flex-1" variant="outline">
                  <Text>Details</Text>
                </Button>
                <Button className="flex-1" variant="secondary">
                  <Text>Limits</Text>
                </Button>
              </View>
            </View>
          ))}

          <Button>
            <Text>Add new card</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
