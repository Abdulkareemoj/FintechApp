import { ScrollView, View } from "react-native";
import { FileText, PieChart, TrendingUp } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const reports = [
  { title: "Monthly spending", description: "See where your money went this month.", icon: PieChart },
  { title: "Income and expenses", description: "Review your cash flow over time.", icon: TrendingUp },
  { title: "Annual overview", description: "Prepare a yearly financial summary.", icon: FileText },
];

export default function ReportsScreen() {
  return <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
    <View className="gap-1"><Text className="font-bold text-3xl text-foreground">Reports</Text><Text className="text-muted-foreground">Prepare a clearer picture of your finances.</Text><Text className="font-medium text-amber-500 text-xs">Preview — reporting is not connected to your account yet.</Text></View>
    {reports.map((report) => <Card key={report.title}><CardHeader><View className="flex-row items-center gap-3"><View className="rounded-xl bg-primary/10 p-3"><Icon as={report.icon} className="size-5 text-primary" /></View><View className="flex-1"><CardTitle>{report.title}</CardTitle><Text className="mt-1 text-muted-foreground text-sm">{report.description}</Text></View></View></CardHeader><CardContent><Text className="text-muted-foreground text-sm">Available when report generation is enabled.</Text></CardContent></Card>)}
  </ScrollView>;
}
