// ================================================================
// FILE: components/MoneyRequestsSection.tsx
// PURPOSE: Money requests (create + incoming accept/decline + outgoing history)
// ================================================================

import { Alert, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Text } from "@/components/ui/text";
import { useWallets } from "@/hooks/useWallets";
import {
  useAcceptMoneyRequest,
  useCancelMoneyRequest,
  useCreateMoneyRequest,
  useDeclineMoneyRequest,
  useIncomingMoneyRequests,
  useOutgoingMoneyRequests,
} from "@/hooks/useMoneyRequests";
import { generateIdempotencyKey } from "@/lib/idempotency";
import type { MoneyRequest } from "@/lib/api/money-requests";

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  KES: "KSh",
};

function formatAmount(amount: number, currency: string) {
  const symbol = currencySymbols[currency.toUpperCase()] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: MoneyRequest["status"] }) {
  const config: Record<string, { color: string; label: string }> = {
    Pending: { color: "text-yellow-400", label: "Pending" },
    Paid: { color: "text-green-400", label: "Paid" },
    Declined: { color: "text-red-400", label: "Declined" },
    Cancelled: { color: "text-zinc-500", label: "Cancelled" },
    Expired: { color: "text-zinc-500", label: "Expired" },
  };
  const c = config[status] ?? config.Pending;
  return <Text className={`text-xs font-medium ${c.color}`}>{c.label}</Text>;
}

function CreateRequestForm({
  onSent,
}: {
  onSent?: () => void;
}) {
  const { data: wallets } = useWallets();
  const primaryWallet = wallets?.[0];
  const createRequest = useCreateMoneyRequest();

  const requestMoneySchema = z.object({
    email: z.email("Enter a valid email"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    note: z.string().max(500).optional(),
  });
  type RequestMoneyForm = z.infer<typeof requestMoneySchema>;
  type FormInput = z.input<typeof requestMoneySchema>;
  type FormOutput = z.output<typeof requestMoneySchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(requestMoneySchema),
    defaultValues: { email: "", amount: 0, note: "" },
  });

  const onSubmit = async (values: RequestMoneyForm) => {
    if (!primaryWallet) return;
    try {
      await createRequest.mutateAsync({
        requesterWalletId: primaryWallet.id,
        payerEmail: values.email,
        amount: values.amount,
        description: values.note,
      });
      Alert.alert("Request sent");
      reset();
      onSent?.();
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New request</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <FormInput
          control={control}
          name="email"
          label="From"
          placeholder="Enter email address"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FormInput
          control={control}
          name="amount"
          label="Amount"
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        <FormInput
          control={control}
          name="note"
          label="Note (optional)"
          placeholder="What's this for?"
        />

        <Text className="text-muted-foreground text-xs">Expires in 7 days</Text>

        <Button
          disabled={isSubmitting || createRequest.isPending}
          onPress={handleSubmit(onSubmit)}
        >
          <Text>{createRequest.isPending ? "Sending..." : "Send request"}</Text>
        </Button>
      </CardContent>
    </Card>
  );
}

function IncomingRequests() {
  const { data: incoming } = useIncomingMoneyRequests(1, 50);
  const acceptRequest = useAcceptMoneyRequest();
  const declineRequest = useDeclineMoneyRequest();
  const { data: wallets } = useWallets();
  const primaryWallet = wallets?.[0];

  const pending = (incoming?.items ?? []).filter(
    (r) => r.status === "Pending"
  );

  const handleAccept = async (id: string) => {
    if (!primaryWallet) return;
    try {
      await acceptRequest.mutateAsync({
        id,
        req: {
          idempotencyKey: generateIdempotencyKey(),
          fromWalletId: primaryWallet.id,
        },
      });
      Alert.alert("Paid");
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineRequest.mutateAsync(id);
      Alert.alert("Declined");
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

  if (pending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incoming requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-muted-foreground text-sm">
            Nothing pending.
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming requests</CardTitle>
      </CardHeader>
      <CardContent className="gap-3">
        {pending.map((req) => (
          <View
            key={req.id}
            className="flex-row items-center justify-between rounded-lg border border-border bg-zinc-900 p-3"
          >
            <View className="flex-1 pr-3">
              <Text className="font-medium text-foreground">
                {req.requesterName}
              </Text>
              <Text className="text-muted-foreground text-sm">
                {formatAmount(req.amount, req.currency)}
                {req.description ? ` · ${req.description}` : ""}
              </Text>
              <Text className="text-muted-foreground text-xs">
                Received {formatDate(req.createdAt)}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Button
                size="sm"
                disabled={acceptRequest.isPending}
                onPress={() => handleAccept(req.id)}
              >
                <Text>Accept</Text>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={declineRequest.isPending}
                onPress={() => handleDecline(req.id)}
              >
                <Text>Decline</Text>
              </Button>
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}

function OutgoingRequests() {
  const { data: outgoing } = useOutgoingMoneyRequests(1, 100);
  const cancelRequest = useCancelMoneyRequest();

  const handleCancel = async (id: string) => {
    try {
      await cancelRequest.mutateAsync(id);
      Alert.alert("Cancelled");
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Try again");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outgoing requests</CardTitle>
      </CardHeader>
      <CardContent className="gap-3">
        {(outgoing?.items ?? []).length === 0 && (
          <Text className="text-muted-foreground text-sm">
            No requests yet.
          </Text>
        )}
        {outgoing?.items.map((req) => (
          <View
            key={req.id}
            className="rounded-lg border border-border bg-zinc-900 p-3"
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-foreground">
                {req.payerName}
              </Text>
              <Text className="font-medium text-foreground">
                {formatAmount(req.amount, req.currency)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-muted-foreground text-xs">
                {req.description ? `${req.description} · ` : ""}
                {formatDate(req.createdAt)}
              </Text>
              <View className="flex-row items-center gap-2">
                {req.status === "Pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={cancelRequest.isPending}
                    onPress={() => handleCancel(req.id)}
                  >
                    <Text>Cancel</Text>
                  </Button>
                )}
                <StatusBadge status={req.status} />
              </View>
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}

export default function MoneyRequestsSection() {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">
          Money requests
        </Text>
        <Text className="text-muted-foreground">
          Ask someone to pay you, or respond to incoming requests
        </Text>
      </View>

      <CreateRequestForm />
      <IncomingRequests />
      <OutgoingRequests />
    </View>
  );
}