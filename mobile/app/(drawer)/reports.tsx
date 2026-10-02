import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { FileText, PieChart, TrendingUp } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  monthRange,
  shareStatementCsv,
  type StatementParams,
  ytdRange,
} from "@/lib/api/statements";

const lastFullMonth = monthRange(1);
const ytd = ytdRange();

const reports = [
  {
    title: "Monthly spending",
    description: `Outgoing transactions for ${lastFullMonth.label}.`,
    icon: PieChart,
    params: { ...lastFullMonth, direction: "outgoing" } as StatementParams,
  },
  {
    title: "Income and expenses",
    description: `All transactions for ${lastFullMonth.label}.`,
    icon: TrendingUp,
    params: lastFullMonth as StatementParams,
  },
  {
    title: "Annual overview",
    description: `All transactions for ${ytd.label}.`,
    icon: FileText,
    params: ytd as StatementParams,
  },
];

export default function ReportsScreen() {
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const handleShare = async (id: string, title: string, params: StatementParams) => {
    setBusyId(id);
    try {
      await shareStatementCsv(params, `Report — ${title}`);
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
        <Text className="font-bold text-3xl text-foreground">Reports</Text>
        <Text className="text-muted-foreground">
          Prepare a clearer picture of your finances. Reports download as CSV.
        </Text>
      </View>
      {reports.map((report, index) => (
        <Card key={report.title}>
          <CardHeader>
            <View className="flex-row items-center gap-3">
              <View className="rounded-xl bg-primary/10 p-3">
                <Icon as={report.icon} className="size-5 text-primary" />
              </View>
              <View className="flex-1">
                <CardTitle>{report.title}</CardTitle>
                <Text className="mt-1 text-muted-foreground text-sm">
                  {report.description}
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <Button
              disabled={busyId === `report-${index}`}
              onPress={() => void handleShare(`report-${index}`, report.title, report.params)}
              variant="outline"
            >
              {busyId === `report-${index}` ? "Preparing…" : "Download CSV (share)"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
  );
}
