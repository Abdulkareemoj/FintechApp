import React from "react";
import { ScrollView, View, Image } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, Edit3, Camera } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="items-center py-6">
        <View className="relative mb-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-500">
            <Text className="font-bold text-3xl text-white">JD</Text>
          </View>
          <View className="absolute -right-1 -bottom-1 rounded-full bg-primary p-2">
            <Icon as={Camera} size={14} className="text-primary-foreground" />
          </View>
        </View>
        <Text className="font-bold text-2xl text-foreground">John Doe</Text>
        <Text className="text-muted-foreground">Member since Jan 2024</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex-row items-center gap-3">
            <Icon as={Mail} size={18} className="text-muted-foreground" />
            <View>
              <Text className="text-muted-foreground text-xs">Email</Text>
              <Text className="text-foreground">john.doe@email.com</Text>
            </View>
          </View>
          <Separator />
          <View className="flex-row items-center gap-3">
            <Icon as={Phone} size={18} className="text-muted-foreground" />
            <View>
              <Text className="text-muted-foreground text-xs">Phone</Text>
              <Text className="text-foreground">+1 (555) 123-4567</Text>
            </View>
          </View>
          <Separator />
          <View className="flex-row items-center gap-3">
            <Icon as={MapPin} size={18} className="text-muted-foreground" />
            <View>
              <Text className="text-muted-foreground text-xs">Address</Text>
              <Text className="text-foreground">123 Main St, San Francisco, CA</Text>
            </View>
          </View>
          <Separator />
          <View className="flex-row items-center gap-3">
            <Icon as={Calendar} size={18} className="text-muted-foreground" />
            <View>
              <Text className="text-muted-foreground text-xs">Date of Birth</Text>
              <Text className="text-foreground">January 15, 1990</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KYC Status</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-sm">Identity Verified</Text>
            <View className="rounded-full bg-emerald-500/10 px-2.5 py-0.5">
              <Text className="text-emerald-500 text-xs font-medium">Verified</Text>
            </View>
          </View>
          <View className="h-2 rounded-full bg-muted">
            <View className="h-full w-full rounded-full bg-emerald-500" />
          </View>
          <Text className="text-muted-foreground text-xs">Tier 3 — Full access</Text>
        </CardContent>
      </Card>

      <Button variant="outline" className="flex-row gap-2">
        <Icon as={Edit3} size={18} className="text-foreground" />
        <Text>Edit Profile</Text>
      </Button>
    </ScrollView>
  );
}
