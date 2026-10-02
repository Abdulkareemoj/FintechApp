import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
  monthRange,
  shareStatementCsv,
  type StatementParams,
  ytdRange,
} from "@/lib/api/statements";

function buildPeriods(): Array<{
  id: string;
  title: string;
  subtitle: string;
  params: StatementParams;
}> {
  const periods: Array<{
    id: string;
    title: string;
    subtitle: string;
    params: StatementParams;
  }> = [];

  for (let offset = 0; offset < 6; offset += 1) {
    const range = monthRange(offset);
    periods.push({
      id: `month-${offset}`,
      title: range.label,
      subtitle: `${range.startDate} → ${range.endDate}`,
      params: { startDate: range.startDate, endDate: range.endDate },
    });
  }

  const ytd = ytdRange();
  periods.push({
    id: "ytd",
    title: ytd.label,
    subtitle: `${ytd.startDate} → ${ytd.endDate}`,
    params: { startDate: ytd.startDate, endDate: ytd.endDate },
  });

  periods.push({
    id: "all",
    title: "All time",
    subtitle: "Full transaction history",
    params: {},
  });

  return periods;
}

export default function StatementsScreen() {
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const periods = React.useMemo(() => buildPeriods(), []);

  const handleShare = async (
    id: string,
    title: string,
    params: StatementParams,
  ) => {
    setBusyId(id);
    try {
      await shareStatementCsv(params, `Statement — ${title}`);
    } catch (err) {
      Alert.alert(
        "Failed",
        err instanceof Error ? err.message : "Try again later.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Statements</Text>
        <Text className="text-muted-foreground">
          Download account statements as CSV and share them anywhere.
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Available</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {periods.map((s) => (
            <Button
              disabled={busyId === s.id}
              key={s.id}
              onPress={() => void handleShare(s.id, s.title, s.params)}
              variant="outline"
            >
              <View className="w-full">
                <Text className="font-medium">{s.title}</Text>
                <Text className="text-muted-foreground text-sm">
                  {busyId === s.id ? "Preparing…" : s.subtitle}
                </Text>
              </View>
            </Button>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
