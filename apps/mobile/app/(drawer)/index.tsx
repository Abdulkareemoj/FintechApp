import { ScrollView, Text, View } from "react-native";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="mb-4 font-bold font-mono text-3xl text-foreground">
          BETTER T STACK
        </Text>
        <View className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm" />
      </ScrollView>
    </Container>
  );
}
