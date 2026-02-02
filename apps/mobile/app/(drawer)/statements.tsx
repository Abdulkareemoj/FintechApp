import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const statements = [
  { id: "st_1", title: "January 2024", subtitle: "Monthly statement" },
  { id: "st_2", title: "December 2023", subtitle: "Monthly statement" },
  { id: "st_3", title: "2023", subtitle: "Tax summary" },
];

export default function StatementsScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Statements</Text>
        <Text className="text-muted-foreground">Download account statements.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Available</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {statements.map((s) => (
            <Button key={s.id} variant="outline">
              <View className="w-full">
                <Text className="font-medium">{s.title}</Text>
                <Text className="text-muted-foreground text-sm">{s.subtitle}</Text>
              </View>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Button>
        <Text>Request custom statement</Text>
      </Button>
    </ScrollView>
  );
}
