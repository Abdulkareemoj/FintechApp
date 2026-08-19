import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	View,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";

function formatBalance(amount: number, currency: string) {
	return `${currency} ${amount.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

function formatAmount(
	amount: number,
	currency: string,
	direction: "incoming" | "outgoing",
) {
	const sign = direction === "outgoing" ? "-" : "+";
	return `${sign} ${currency} ${amount.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

export default function Home() {
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);

	const { data: wallets, isLoading: walletsLoading } = useWallets();
	const { data: txData, isLoading: txLoading } = useTransactions({
		page: 1,
		pageSize: 5,
	});

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["wallets"] }),
			queryClient.invalidateQueries({ queryKey: ["transactions"] }),
		]);
		setRefreshing(false);
	};

	if (walletsLoading || txLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
			</View>
		);
	}

	const transactions = txData?.items ?? [];

	return (
		<ScrollView
			className="flex-1 p-6"
			contentContainerClassName="gap-4"
			refreshControl={
				<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
			}
		>
			<View className="gap-1">
				<Text className="font-bold text-3xl text-foreground">Wallet</Text>
				<Text className="text-muted-foreground">
					Balances and recent activity
				</Text>
			</View>

			<Card>
				<CardHeader>
					<CardTitle>Balances</CardTitle>
				</CardHeader>
				<CardContent className="gap-3">
					{wallets?.length === 0 && (
						<Text className="text-muted-foreground">No wallets yet.</Text>
					)}
					{wallets?.map((w) => (
						<View
							className="flex-row items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
							key={w.id}
						>
							<View>
								<Text className="font-medium">{w.currencyCode} Wallet</Text>
								<Text className="text-muted-foreground text-sm">Available</Text>
							</View>
							<Text className="font-semibold">
								{formatBalance(w.balance, w.currencyCode)}
							</Text>
						</View>
					))}

					<View className="flex-row gap-2">
						<Button
							className="flex-1"
							onPress={() => router.push("/(drawer)/(tabs)/transfers")}
						>
							<Text>Send</Text>
						</Button>
						<Button
							className="flex-1"
							onPress={() => router.push("/(drawer)/top-up" as any)}
							variant="outline"
						>
							<Text>Add money</Text>
						</Button>
					</View>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Quick actions</CardTitle>
				</CardHeader>
				<CardContent className="gap-2">
					<View className="flex-row gap-2">
						<Button
							className="flex-1"
							onPress={() => router.push("/(drawer)/bills" as any)}
							variant="secondary"
						>
							<Text>Pay bills</Text>
						</Button>
						<Button
							className="flex-1"
							onPress={() => router.push("/(drawer)/top-up" as any)}
							variant="secondary"
						>
							<Text>Request money</Text>
						</Button>
					</View>
					<View className="flex-row gap-2">
						{/* Exchange has no page/backend yet */}
						<Button className="flex-1" disabled variant="secondary">
							<Text>Exchange</Text>
						</Button>
						<Button
							className="flex-1"
							onPress={() => router.push("/(drawer)/statements" as any)}
							variant="secondary"
						>
							<Text>Statements</Text>
						</Button>
					</View>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Recent transactions</CardTitle>
				</CardHeader>
				<CardContent className="gap-3">
					{transactions.length === 0 && (
						<Text className="text-muted-foreground">No transactions yet.</Text>
					)}
					{transactions.map((tx) => (
						<View className="flex-row items-start justify-between" key={tx.id}>
							<View className="flex-1 pr-3">
								<Text className="font-medium">{tx.description || tx.type}</Text>
								<Text className="text-muted-foreground text-sm">
									{tx.type} · {new Date(tx.createdAt).toLocaleDateString()}
								</Text>
							</View>
							<Text
								className={
									tx.direction === "outgoing"
										? "text-destructive"
										: "text-emerald-600"
								}
							>
								{formatAmount(tx.amount, tx.currency, tx.direction)}
							</Text>
						</View>
					))}

					<Button
						onPress={() => router.push("/(drawer)/transactions" as any)}
						variant="outline"
					>
						<Text>View all</Text>
					</Button>
				</CardContent>
			</Card>
		</ScrollView>
	);
}
