import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAnalyticsSummary } from "@/hooks/useAnalytics";

const CATEGORY_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-primary",
  "bg-green-500",
  "bg-pink-500",
  "bg-zinc-500",
];

function pctChange(current: number, previous: number): string | null {
  if (!previous) return null;
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export default function AnalyticsScreen() {
  const { data: summary, isLoading, isError, refetch } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  if (isError || !summary) {
    return (
      <View className="flex-1 items-center justify-center gap-3 p-6">
        <Text className="text-muted-foreground">Couldn't load your analytics.</Text>
        <Button onPress={() => refetch()} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const monthly = summary.monthly ?? [];
  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];

  const monthIncome = lastMonth?.income ?? 0;
  const monthExpenses = lastMonth?.expenses ?? 0;
  const monthNet = monthIncome - monthExpenses;
  const monthRate =
    monthIncome > 0 ? ((monthNet / monthIncome) * 100).toFixed(1) : "0.0";

  const incomeChange = pctChange(monthIncome, prevMonth?.income ?? 0);
  const expenseChange = pctChange(monthExpenses, prevMonth?.expenses ?? 0);
  const netChange = pctChange(
    monthNet,
    (prevMonth?.income ?? 0) - (prevMonth?.expenses ?? 0),
  );
  const rateChange =
    prevMonth && prevMonth.income > 0
      ? pctChange(monthNet, prevMonth.income - prevMonth.expenses)
      : null;

  const stats = [
    {
      label: "Total Income",
      value: `$${monthIncome.toLocaleString()}`,
      change: incomeChange,
      goodWhenUp: true,
    },
    {
      label: "Total Expenses",
      value: `$${monthExpenses.toLocaleString()}`,
      change: expenseChange,
      goodWhenUp: false,
    },
    {
      label: "Net Savings",
      value: `$${monthNet.toLocaleString()}`,
      change: netChange,
      goodWhenUp: true,
    },
    {
      label: "Savings Rate",
      value: `${monthRate}%`,
      change: rateChange,
      goodWhenUp: true,
    },
  ];

  const totalExpenses = summary.totalExpenses ?? 0;
  const categories = (summary.categories ?? []).map((c, index) => ({
    name: c.name,
    amount: c.value,
    percentage:
      totalExpenses > 0 ? Math.round((c.value / totalExpenses) * 100) : 0,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Analytics</Text>
        <Text className="text-muted-foreground">
          Track your spending and income trends.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-4">
        {stats.map((s) => {
          const up = s.change !== null && !s.change.startsWith("-");
          const good = s.goodWhenUp ? up : !up;
          const changeClass =
            s.change === null
              ? "text-muted-foreground"
              : good
                ? "text-emerald-500"
                : "text-red-500";
          return (
            <Card className="flex-1 min-w-[140px]" key={s.label}>
              <CardContent className="p-4">
                <Text className="text-muted-foreground text-xs">{s.label}</Text>
                <Text className="font-bold text-lg text-foreground mt-1">
                  {s.value}
                </Text>
                <Text className={`mt-0.5 text-xs ${changeClass}`}>
                  {s.change === null ? "No prior month data" : `${s.change} from last month`}
                </Text>
              </CardContent>
            </Card>
          );
        })}
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {categories.length === 0 ? (
            <Text className="text-muted-foreground text-sm">
              No spending recorded yet.
            </Text>
          ) : (
            categories.map((c) => (
              <View key={c.name} className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-foreground">{c.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    ${c.amount.toLocaleString()} ({c.percentage}%)
                  </Text>
                </View>
                <View className="h-2 rounded-full bg-muted">
                  <View
                    className={`h-full rounded-full ${c.color}`}
                    style={{ width: `${c.percentage}%` }}
                  />
                </View>
              </View>
            ))
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
