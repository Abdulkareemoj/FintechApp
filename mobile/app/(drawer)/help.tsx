import React from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ChevronRight, Search } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useHelpArticles } from "@/hooks/useHelp";

export default function HelpScreen() {
  const { data: articles, isLoading, isError, refetch } = useHelpArticles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const filtered = (articles ?? []).filter(
    (a) =>
      !searchQuery ||
      a.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Help Center</Text>
        <Text className="text-muted-foreground">Find answers and get support.</Text>
      </View>

      <View className="relative">
        <Input
          placeholder="Search help articles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="pl-10"
        />
        <Icon as={Search} size={18} className="text-muted-foreground absolute left-3 top-3" />
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" className="text-primary" />
              <Text className="mt-3 text-sm text-muted-foreground">Loading articles...</Text>
            </View>
          ) : isError ? (
            <View className="items-center gap-3 py-6">
              <Text className="text-sm text-muted-foreground">Couldn't load articles.</Text>
              <Button variant="outline" onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </View>
          ) : filtered.length === 0 ? (
            <View className="py-6">
              <Text className="text-center text-sm text-muted-foreground">
                No articles found.
              </Text>
            </View>
          ) : (
            filtered.map((article, i) => {
              const isOpen = openId === article.id;
              return (
                <View key={article.id}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className={`px-4 py-3.5 ${i < filtered.length - 1 ? "border-b border-border" : ""}`}
                    onPress={() => setOpenId(isOpen ? null : article.id)}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-foreground flex-1 mr-2">
                        {article.question}
                      </Text>
                      <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
                    </View>
                  </TouchableOpacity>
                  {isOpen && (
                    <View className="border-b border-border bg-muted/30 px-4 py-3">
                      <Text className="text-sm text-muted-foreground">{article.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}