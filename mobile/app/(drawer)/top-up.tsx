
// ================================================================
// FILE: app/(drawer)/top-up.tsx
// ================================================================

import { Alert, ScrollView, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MoneyRequestsSection from "@/components/MoneyRequestsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Text } from "@/components/ui/text";
import { useWallets } from "@/hooks/useWallets";
import { useInitiateDeposit, useDepositStatus, useSimulateDepositCallback } from "@/hooks/useDeposits";
import { generateIdempotencyKey } from "@/lib/idempotency";
import type { DepositSource } from "@/lib/api/deposits";
import React from "react";

const topUpSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});
type TopUpForm = z.infer<typeof topUpSchema>;

const sources: { id: DepositSource; label: string }[] = [
  { id: "DebitCard", label: "Card" },
  { id: "BankTransfer", label: "Bank Transfer" },
  { id: "USSD", label: "USSD" },
];

export default function TopUpScreen() {
  const { data: wallets } = useWallets();
  const primaryWallet = wallets?.[0];

  const { control, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<TopUpForm>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: 0 },
  });

  const amount = watch("amount");
  const [source, setSource] = React.useState<DepositSource>("DebitCard");
  const [activeDepositId, setActiveDepositId] = React.useState<string | null>(null);

  const initiateDeposit = useInitiateDeposit();
  const { data: depositStatus } = useDepositStatus(activeDepositId ?? undefined);
  const simulateCallback = useSimulateDepositCallback();

  const onSubmit = async (values: TopUpForm) => {
    if (!primaryWallet) return;
    try {
      const deposit = await initiateDeposit.mutateAsync({
        idempotencyKey: generateIdempotencyKey(),
        walletId: primaryWallet.id,
        amount: values.amount,
        source,
      });
      setActiveDepositId(deposit.id);
      Alert.alert("Deposit initiated", `Reference: ${deposit.referenceId}`);
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Add money</Text>
        <Text className="text-muted-foreground">
          Top up your wallet or request money.
        </Text>
      </View>

      {activeDepositId && depositStatus && (
        <Card>
          <CardContent className="gap-2 p-4">
            <Text className="font-medium">
              Deposit {depositStatus.status === "Pending" ? "pending" : depositStatus.status.toLowerCase()}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {depositStatus.currency} {depositStatus.amount.toFixed(2)}
            </Text>
            {depositStatus.status === "Pending" && __DEV__ && (
              <View className="flex-row gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => simulateCallback.mutate({ depositId: activeDepositId, success: true })}
                >
                  <Text>Simulate success (dev)</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Top up</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <FormInput control={control} name="amount" label="Amount" placeholder="0.00" keyboardType="decimal-pad" />

          <View className="flex-row gap-2">
            {[25, 50, 100].map((q) => (
              <Button key={q} className="flex-1" onPress={() => setValue("amount", q)} variant="secondary">
                <Text>{q}</Text>
              </Button>
            ))}
          </View>

          <Text className="text-sm font-medium text-foreground">Payment method</Text>
          <View className="flex-row gap-2">
            {sources.map((s) => (
              <Button
                key={s.id}
                className="flex-1"
                onPress={() => setSource(s.id)}
                variant={source === s.id ? "default" : "outline"}
              >
                <Text>{s.label}</Text>
              </Button>
            ))}
          </View>

          <Button disabled={!amount || isSubmitting || initiateDeposit.isPending} onPress={handleSubmit(onSubmit)}>
            <Text>{initiateDeposit.isPending ? "Processing..." : "Top up"}</Text>
          </Button>
        </CardContent>
      </Card>

      <MoneyRequestsSection />
    </ScrollView>
  );
}
