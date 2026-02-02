import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Invest() {
  return (
    <ScrollView className="flex-1 p-6">
      <View className="py-8">
        <Text className="mb-2 font-bold text-3xl text-foreground">Invest</Text>
        <Text className="text-lg text-muted-foreground">
          Configure app Invest and preferences
        </Text>
      </View>
    </ScrollView>
  );
}
