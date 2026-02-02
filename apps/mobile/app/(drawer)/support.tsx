import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export default function SupportScreen() {
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Support</Text>
        <Text className="text-muted-foreground">We’re here to help.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Create a ticket</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChangeText={setSubject} />
          </View>
          <View className="gap-2">
            <Label htmlFor="message">Message</Label>
            <Input id="message" value={message} onChangeText={setMessage} />
          </View>
          <Button disabled={!subject || !message}>
            <Text>Submit</Text>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick help</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <Button variant="outline">
            <Text>Payment issues</Text>
          </Button>
          <Button variant="outline">
            <Text>Account verification</Text>
          </Button>
          <Button variant="outline">
            <Text>Card issues</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
