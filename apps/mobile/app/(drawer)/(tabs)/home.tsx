import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
export default function Home() {
  return (
    <ScrollView className="flex-1 p-6">
      <View className="py-8">
        <Text className="mb-2 font-bold text-3xl text-foreground">Tab One</Text>
        <Text className="text-lg text-muted-foreground">
          Explore the first section of your app
        </Text>
      </View>
    </ScrollView>
  );
}
