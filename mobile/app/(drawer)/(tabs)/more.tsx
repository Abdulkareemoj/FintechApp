import { router } from "expo-router";
import React from "react";
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
        <Text className="font-bold text-3xl text-foreground">More</Text>
        <Text className="text-muted-foreground">
          Manage your account and tools.
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <Button
            onPress={() => router.push("/(drawer)/account")}
            variant="outline"
          >
            <Text>Profile & verification</Text>
          </Button>
          <Button
            onPress={() => router.push("/(drawer)/settings")}
            variant="outline"
          >
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
            onPress={() => router.push("/(drawer)/transactions" as any)}
            variant="outline"
          >
            <Text>Transactions</Text>
          </Button>
          <Button
            onPress={() => router.push("/(drawer)/statements" as any)}
            variant="outline"
          >
            <Text>Statements</Text>
          </Button>
          <Button
            onPress={() => router.push("/(drawer)/support" as any)}
            variant="outline"
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
            onPress={() => {
              clearAuth();
              router.replace("/(auth)/sign-in");
            }}
            variant="destructive"
          >
            <Text>Sign out</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
