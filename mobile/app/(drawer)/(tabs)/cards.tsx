import React from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useCards, useFreezeCard, useUnfreezeCard } from "@/hooks/useCards";

const fallbackCards = [
  { id: "card_1", brand: "Visa", last4: "4242", status: "active" as const },
  { id: "card_2", brand: "Mastercard", last4: "5512", status: "frozen" as const },
];

export default function Cards() {
  const { data: remoteCards, isLoading, isError } = useCards();
  const freezeMutation = useFreezeCard();
  const unfreezeMutation = useUnfreezeCard();

  const cards = remoteCards?.length ? remoteCards : isError ? fallbackCards : [];
  const showSkeleton = isLoading && !remoteCards;

  const handleFreezeToggle = (cardId: string, currentlyFrozen: boolean) => {
    if (currentlyFrozen) {
      unfreezeMutation.mutate(cardId);
    } else {
      freezeMutation.mutate(cardId);
    }
  };

  const isMutating = (cardId: string) =>
    freezeMutation.isPending || unfreezeMutation.isPending;

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
          {showSkeleton ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" className="text-primary" />
              <Text className="text-muted-foreground mt-3 text-sm">
                Loading cards...
              </Text>
            </View>
          ) : (
            cards.map((c: any) => {
              const isFrozen = c.status === "frozen";
              return (
                <View
                  className="rounded-lg border border-border bg-background px-4 py-3"
                  key={c.id}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-medium">
                        {c.brand} ···· {c.last4}
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        {isFrozen ? "Frozen" : "Active"}
                      </Text>
                    </View>
                    <Switch
                      checked={isFrozen}
                      disabled={isMutating(c.id)}
                      onCheckedChange={() =>
                        handleFreezeToggle(c.id, isFrozen)
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
              );
            })
          )}

          <Button>
            <Text>Add new card</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
