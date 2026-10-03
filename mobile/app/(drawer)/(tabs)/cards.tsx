import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import {
  useCards,
  useCreateCard,
  useDeleteCard,
  useFreezeCard,
  useUnfreezeCard,
  useUpdateCardLimits,
} from "@/hooks/useCards";
import { useWallets } from "@/hooks/useWallets";
import { useAuthStore } from "@/lib/authStore";
import type { Card as BankCard } from "@/lib/api/cards";
import React from "react";

function humanize(value: string) {
  if (!value) return "-";
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function expiryLabel(card: BankCard) {
  const year = (card.expiryYear ?? "").padStart(2, "0");
  return `${card.expiryMonth ?? "-"}/${year.length > 2 ? year.slice(-2) : year}`;
}

export default function Cards() {
  const { data: cards, isLoading, isError, refetch } = useCards();
  const { data: wallets } = useWallets();
  const freezeMutation = useFreezeCard();
  const unfreezeMutation = useUnfreezeCard();
  const deleteMutation = useDeleteCard();
  const createMutation = useCreateCard();
  const limitsMutation = useUpdateCardLimits();
  const user = useAuthStore((state) => state.user);

  const [createOpen, setCreateOpen] = useState(false);
  const [walletOption, setWalletOption] = useState<
    { value: string; label: string } | undefined
  >(undefined);
  const [holderName, setHolderName] = useState("");
  const [limitsCard, setLimitsCard] = useState<BankCard | null>(null);
  const [spendingLimit, setSpendingLimit] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const openCreate = () => {
    const name = user ? `${user.firstName} ${user.lastName}`.trim() : "";
    setHolderName(name);
    const first = (wallets ?? [])[0];
    setWalletOption(
      first ? { value: first.id, label: `${first.currencyCode} wallet` } : undefined,
    );
    setCreateOpen(true);
  };

  const openLimits = (card: BankCard) => {
    setLimitsCard(card);
    setSpendingLimit(String(card.spendingLimit ?? 0));
    setDailyLimit(String(card.dailyLimit ?? 0));
    setMonthlyLimit(String(card.monthlyLimit ?? 0));
  };

  const handleCreate = async () => {
    if (!walletOption?.value || holderName.trim().length < 2) return;
    try {
      await createMutation.mutateAsync({
        walletId: walletOption.value,
        cardHolderName: holderName.trim(),
      });
      Alert.alert("Card created", "Your virtual card is ready to use.");
      setCreateOpen(false);
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

  const handleUpdateLimits = async () => {
    if (!limitsCard) return;
    const spending = Number(spendingLimit);
    const daily = Number(dailyLimit);
    const monthly = Number(monthlyLimit);
    if ([spending, daily, monthly].some((n) => Number.isNaN(n) || n < 0)) {
      Alert.alert("Invalid limits", "Limits must be 0 or greater.");
      return;
    }
    try {
      await limitsMutation.mutateAsync({
        id: limitsCard.id,
        limits: {
          spendingLimit: spending,
          dailyLimit: daily,
          monthlyLimit: monthly,
        },
      });
      Alert.alert("Saved", "Card limits updated.");
      setLimitsCard(null);
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

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
                    <Button
                      className="flex-1"
                      disabled={limitsMutation.isPending}
                      onPress={() => openLimits(card)}
                      variant="outline"
                    >
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

          <Button onPress={openCreate}>
            <Text>Add new card</Text>
          </Button>
        </CardContent>
      </Card>

      <Dialog onOpenChange={setCreateOpen} open={createOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a virtual card</DialogTitle>
          </DialogHeader>
          <View className="gap-4">
            <View className="gap-2">
              <Label>Wallet</Label>
              <Select onValueChange={setWalletOption} value={walletOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {(wallets ?? []).map((w) => (
                    <SelectItem
                      key={w.id}
                      label={`${w.currencyCode} wallet`}
                      value={w.id}
                    >
                      {`${w.currencyCode} wallet`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>
            <View className="gap-2">
              <Label htmlFor="card-holder">Cardholder name</Label>
              <Input
                id="card-holder"
                onChangeText={setHolderName}
                placeholder="Name on card"
                value={holderName}
              />
            </View>
            <Button
              disabled={
                !walletOption?.value ||
                holderName.trim().length < 2 ||
                createMutation.isPending
              }
              onPress={handleCreate}
            >
              <Text>{createMutation.isPending ? "Creating…" : "Create card"}</Text>
            </Button>
          </View>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => {
          if (!open) setLimitsCard(null);
        }}
        open={!!limitsCard}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Card limits</DialogTitle>
          </DialogHeader>
          <View className="gap-4">
            <View className="gap-2">
              <Label htmlFor="spending-limit">Spending limit</Label>
              <Input
                id="spending-limit"
                keyboardType="decimal-pad"
                onChangeText={setSpendingLimit}
                value={spendingLimit}
              />
            </View>
            <View className="gap-2">
              <Label htmlFor="daily-limit">Daily limit</Label>
              <Input
                id="daily-limit"
                keyboardType="decimal-pad"
                onChangeText={setDailyLimit}
                value={dailyLimit}
              />
            </View>
            <View className="gap-2">
              <Label htmlFor="monthly-limit">Monthly limit</Label>
              <Input
                id="monthly-limit"
                keyboardType="decimal-pad"
                onChangeText={setMonthlyLimit}
                value={monthlyLimit}
              />
            </View>
            <Button
              disabled={limitsMutation.isPending}
              onPress={handleUpdateLimits}
            >
              <Text>{limitsMutation.isPending ? "Saving…" : "Save limits"}</Text>
            </Button>
          </View>
        </DialogContent>
      </Dialog>
    </ScrollView>
  );
}