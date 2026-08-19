
// ================================================================
// FILE: app/(drawer)/(tabs)/transfers.tsx
// ================================================================

import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/ui/form-input";
import { Text } from "@/components/ui/text";
import { useWallets } from "@/hooks/useWallets";
import { useCreateTransfer, useRecentRecipients } from "@/hooks/useTransactions";
import { useRecipientLookup } from "@/hooks/useRecipientLookup";
import { generateIdempotencyKey } from "@/lib/idempotency";

const sendMoneySchema = z.object({
  recipientEmail: z.string().email("Enter a valid email"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  note: z.string().max(500).optional(),
});
type SendMoneyForm = z.infer<typeof sendMoneySchema>;

export default function Transfers() {
  const { data: wallets } = useWallets();
  const primaryWallet = wallets?.[0];

  const { control, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } =
    useForm<SendMoneyForm>({
      resolver: zodResolver(sendMoneySchema),
      defaultValues: { recipientEmail: "", amount: 0, note: "" },
    });

  const recipientEmail = watch("recipientEmail");
  const [foundRecipient, setFoundRecipient] = useState<{ userId: string; name: string; email: string; walletId: string } | null>(null);

  useEffect(() => setFoundRecipient(null), [recipientEmail]);

  const lookup = useRecipientLookup();
  const transfer = useCreateTransfer();
  const { data: recentRecipients } = useRecentRecipients(5);

  const handleFind = async (emailOverride?: string) => {
    const email = emailOverride ?? recipientEmail;
    if (!primaryWallet || !email) return;
    try {
      const result = await lookup.mutateAsync({ identifier: email, currency: primaryWallet.currencyCode });
      setFoundRecipient(result);
      if (emailOverride) setValue("recipientEmail", emailOverride);
    } catch (err) {
      setFoundRecipient(null);
      Alert.alert("Recipient not found", err instanceof Error ? err.message : "Try again");
    }
  };

  const onSubmit = async (values: SendMoneyForm) => {
    if (!foundRecipient || !primaryWallet) {
      Alert.alert("Find the recipient first");
      return;
    }
    try {
      await transfer.mutateAsync({
        idempotencyKey: generateIdempotencyKey(),
        fromWalletId: primaryWallet.id,
        toWalletId: foundRecipient.walletId,
        amount: values.amount,
        description: values.note,
      });
      Alert.alert("Sent", `${primaryWallet.currencyCode} ${values.amount.toFixed(2)} sent to ${foundRecipient.name}`);
      reset();
      setFoundRecipient(null);
    } catch (err) {
      Alert.alert("Transfer failed", err instanceof Error ? err.message : "Try again");
    }
  };

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Send money</Text>
        <Text className="text-muted-foreground">Transfer to another user instantly.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Transfer details</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <Controller
            control={control}
            name="recipientEmail"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error}>
                <FieldContent>
                  <FieldLabel>Recipient</FieldLabel>
                  <View className="flex-row gap-2 items-center">
                    <Input
                      className="flex-1"
                      placeholder="Email address"
                      value={field.value}
                      onChangeText={field.onChange}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    <Button
                      variant="secondary"
                      disabled={!field.value || lookup.isPending}
                      onPress={() => handleFind()}
                    >
                      <Text>{lookup.isPending ? "..." : "Find"}</Text>
                    </Button>
                  </View>
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </FieldContent>
              </Field>
            )}
          />

          {foundRecipient && (
            <View className="flex-row items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <Text>{foundRecipient.name[0]}</Text>
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-medium">{foundRecipient.name}</Text>
                <Text className="text-muted-foreground text-sm">{foundRecipient.email}</Text>
              </View>
            </View>
          )}

          <FormInput
            control={control}
            name="amount"
            label="Amount"
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          <Text className="text-muted-foreground text-xs">
            Available: {primaryWallet ? `${primaryWallet.currencyCode} ${primaryWallet.balance.toFixed(2)}` : "—"}
          </Text>

          <FormInput control={control} name="note" label="Note (optional)" placeholder="What's this for?" />

          <Button
            disabled={!foundRecipient || isSubmitting || transfer.isPending}
            onPress={handleSubmit(onSubmit)}
          >
            <Text>{transfer.isPending ? "Sending..." : "Send"}</Text>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent recipients</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {(recentRecipients ?? []).length === 0 && (
            <Text className="text-muted-foreground">No recent recipients yet.</Text>
          )}
          {recentRecipients?.map((r) => (
            <Button key={r.userId} variant="outline" onPress={() => handleFind(r.email)}>
              <Text>{r.name} ({r.email})</Text>
            </Button>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}