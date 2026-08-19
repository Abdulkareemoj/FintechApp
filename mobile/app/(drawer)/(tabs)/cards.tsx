import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import {
  useCards,
  useDeleteCard,
  useFreezeCard,
  useUnfreezeCard,
} from "@/hooks/useCards";
import type { Card as BankCard } from "@/lib/api/cards";

function humanize(value: string) {
  if (!value) return "—";
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function expiryLabel(card: BankCard) {
  const year = (card.expiryYear ?? "").padStart(2, "0");
  return `${card.expiryMonth ?? "—"}/${year.length > 2 ? year.slice(-2) : year}`;
}

export default function Cards() {
  const { data: cards, isLoading, isError, refetch } = useCards();
  const freezeMutation = useFreezeCard();
  const unfreezeMutation = useUnfreezeCard();
  const deleteMutation = useDeleteCard();

  const handleFreezeToggle = (card: BankCard) => {
    const isFrozen = card.status?.toLowerCase().includes("frozen");
    const mutate = isFrozen ? unfreezeMutation : freezeMutation;
    mutate.mutate(card.id, {
      onError: (err) =>
        Alert.alert("Failed", err instanceof Error ? err.message : "Try again"),
    });
  };

  const handleDelete = (card: BankCard) => {
    Alert.alert(
      "Delete card",
      `Delete card •••• ${card.lastFourDigits}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate(card.id, {
              onError: (err) =>
                Alert.alert(
                  "Failed",
                  err instanceof Error ? err.message : "Try again"
                ),
            }),
        },
      ]
    );
  };

  const isMutating =
    freezeMutation.isPending ||
    unfreezeMutation.isPending ||
    deleteMutation.isPending;

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Cards</Text>
        <Text className="text-muted-foreground">
          Manage your cards securely.
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Your cards</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" className="text-primary" />
              <Text className="mt-3 text-muted-foreground text-sm">
                Loading cards...
              </Text>
            </View>
          ) : isError ? (
            <View className="items-center gap-3 py-6">
              <Text className="text-muted-foreground text-sm">
                Couldn't load cards.
              </Text>
              <Button variant="outline" onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </View>
          ) : (cards ?? []).length === 0 ? (
            <Text className="text-muted-foreground text-sm">
              No cards yet.
            </Text>
          ) : (
            cards.map((card: BankCard) => {
              const isFrozen = card.status?.toLowerCase().includes("frozen");
              return (
                <View
                  className="rounded-lg border border-border bg-background px-4 py-3"
                  key={card.id}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-medium">
                        {humanize(card.cardType)} ···· {card.lastFourDigits}
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        {card.cardHolderName} · {"Exp "}
                        {expiryLabel(card)}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        {isFrozen ? "Frozen" : "Active"}
                      </Text>
                    </View>
                    <Switch
                      checked={isFrozen}
                      disabled={isMutating}
                      onCheckedChange={() => handleFreezeToggle(card)}
                    />
                  </View>

                  <View className="mt-3 flex-row gap-2">
                    <Button className="flex-1" variant="outline" disabled>
                      <Text>Limits</Text>
                    </Button>
                    <Button
                      className="flex-1"
                      variant="secondary"
                      disabled={deleteMutation.isPending}
                      onPress={() => handleDelete(card)}
                    >
                      <Text>Delete</Text>
                    </Button>
                  </View>
                </View>
              );
            })
          )}

          <Button disabled>
            <Text>Add new card</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}