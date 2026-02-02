import React from "react";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/lib/authStore";

export default function More() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">More</Text>
        <Text className="text-muted-foreground">Manage your account and tools.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <Button variant="outline" onPress={() => router.push("/(drawer)/account")}>
            <Text>Profile & verification</Text>
          </Button>
          <Button variant="outline" onPress={() => router.push("/(drawer)/settings")}>
            <Text>Settings & security</Text>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <Button
            variant="outline"
            onPress={() => router.push("/(drawer)/transactions" as any)}
          >
            <Text>Transactions</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => router.push("/(drawer)/statements" as any)}
          >
            <Text>Statements</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => router.push("/(drawer)/support" as any)}
          >
            <Text>Support</Text>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onPress={() => {
              clearAuth();
              router.replace("/(auth)/sign-in");
            }}
          >
            <Text>Sign out</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
