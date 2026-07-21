import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { Search, MessageSquare, BookOpen, Phone, ChevronRight, HelpCircle } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const faqs = [
  { q: "How do I reset my password?", a: "Go to Settings > Security and tap 'Change Password'. You'll need your current password." },
  { q: "Why was my card declined?", a: "Common reasons: insufficient funds, daily limit reached, or security freeze enabled." },
  { q: "How long do transfers take?", a: "Domestic transfers: instant-2 hrs. International: 1-5 business days." },
  { q: "How do I dispute a transaction?", a: "Tap the transaction in your history and select 'Dispute Transaction'." },
];

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");

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

      <View className="flex-row gap-3">
        <Card className="flex-1">
          <CardContent className="items-center py-4">
            <Icon as={BookOpen} size={24} className="text-primary mb-2" />
            <Text className="text-foreground text-sm font-medium">Guides</Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="items-center py-4">
            <Icon as={MessageSquare} size={24} className="text-primary mb-2" />
            <Text className="text-foreground text-sm font-medium">Chat</Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="items-center py-4">
            <Icon as={Phone} size={24} className="text-primary mb-2" />
            <Text className="text-foreground text-sm font-medium">Call</Text>
          </CardContent>
        </Card>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {faqs.map((faq, i) => (
            <TouchableOpacity
              key={faq.q}
              activeOpacity={0.7}
              className={`px-4 py-3.5 ${i < faqs.length - 1 ? "border-b border-border" : ""}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground text-sm flex-1 mr-2">{faq.q}</Text>
                <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
              </View>
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Button variant="outline" className="flex-row gap-2">
            <Icon as={MessageSquare} size={18} className="text-foreground" />
            <Text>Start live chat</Text>
          </Button>
          <Button variant="outline" className="flex-row gap-2">
            <Icon as={Phone} size={18} className="text-foreground" />
            <Text>Call support</Text>
          </Button>
          <View className="rounded-lg bg-muted p-3">
            <Text className="text-muted-foreground text-xs text-center">
              Available Mon-Fri 8AM-8PM EST
            </Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
