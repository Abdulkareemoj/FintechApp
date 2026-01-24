import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Profile() {
  return (
    <ScrollView className="flex-1 p-6">
      <View className="py-8">
        <Text className="mb-2 font-bold text-3xl text-foreground">Profile</Text>
        <Text className="text-lg text-muted-foreground">
          Manage your profile information and preferences
        </Text>
      </View>
    </ScrollView>
  );
}
