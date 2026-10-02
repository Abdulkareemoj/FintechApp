import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Calendar, Edit3, Mail, MapPin, Phone } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/lib/authStore";

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Icon>["as"];
  label: string;
  value: string;
}) {
  const isMissing = value === "Not provided";
  return (
    <View className="flex-row items-center gap-3">
      <Icon as={icon} size={18} className="text-muted-foreground" />
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">{label}</Text>
        <Text className={isMissing ? "text-muted-foreground" : "text-foreground"}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const profileQuery = useProfile();
  const profile = profileQuery.data;
  const updateProfile = useUpdateProfile();

  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    dob: "",
  });

  React.useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        dob: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      });
    }
  }, [profile]);

  const name =
    (profile
      ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
      : user
        ? `${user.firstName} ${user.lastName}`.trim()
        : "") || "Your account";
  const initials =
    (profile?.firstName?.[0] ?? user?.firstName?.[0] ?? "U") +
    (profile?.lastName?.[0] ?? user?.lastName?.[0] ?? "");
  const today = new Date().toISOString().slice(0, 10);

  const setField = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    if (firstName.length < 2 || lastName.length < 2) {
      Alert.alert(
        "Invalid name",
        "First and last name must be at least 2 characters.",
      );
      return;
    }
    if (form.dob && !/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) {
      Alert.alert("Invalid date", "Date of birth must be in YYYY-MM-DD format.");
      return;
    }
    if (form.dob > today) {
      Alert.alert("Invalid date", "Date of birth can't be in the future.");
      return;
    }
    updateProfile.mutate(
      {
        firstName,
        lastName,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        dateOfBirth: form.dob || null,
      },
      {
        onSuccess: () => {
          updateUser({ firstName, lastName });
          Alert.alert("Profile updated", "Your changes have been saved.");
          setEditing(false);
        },
        onError: (err) =>
          Alert.alert(
            "Failed",
            err instanceof Error ? err.message : "Try again later.",
          ),
      },
    );
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        dob: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      });
    }
    setEditing(false);
  };

  return (
    <ScrollView
      className="flex-1 p-6"
      contentContainerClassName="gap-4"
      keyboardShouldPersistTaps="handled"
    >
      <View className="items-center py-6">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-500">
          <Text className="font-bold text-3xl text-white">
            {initials.toUpperCase()}
          </Text>
        </View>
        <Text className="font-bold text-2xl text-foreground">{name}</Text>
        <Text className="text-muted-foreground">{profile?.role ?? user?.role ?? ""}</Text>
      </View>

      {profileQuery.isPending ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton className="h-10 w-full" key={`info-${i.toString()}`} />
            ))}
          </CardContent>
        </Card>
      ) : profileQuery.isError ? (
        <Card>
          <CardContent className="items-center gap-3 py-6">
            <Text className="text-muted-foreground text-sm">
              Couldn&apos;t load your profile.
            </Text>
            <Button
              onPress={() => profileQuery.refetch()}
              size="sm"
              variant="outline"
            >
              <Text>Try again</Text>
            </Button>
          </CardContent>
        </Card>
      ) : profile && editing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-1.5">
              <Label htmlFor="first-name">First name</Label>
              <Input
                autoCapitalize="words"
                id="first-name"
                maxLength={60}
                onChangeText={(v) => setField("firstName", v)}
                value={form.firstName}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                autoCapitalize="words"
                id="last-name"
                maxLength={60}
                onChangeText={(v) => setField("lastName", v)}
                value={form.lastName}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                editable={false}
                id="email"
                value={profile.email}
              />
              <Text className="text-muted-foreground text-xs">
                Email address can&apos;t be changed here.
              </Text>
            </View>
            <View className="gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                keyboardType="phone-pad"
                maxLength={30}
                onChangeText={(v) => setField("phone", v)}
                value={form.phone}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                maxLength={200}
                onChangeText={(v) => setField("address", v)}
                value={form.address}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="dob">Date of birth</Label>
              <Input
                id="dob"
                maxLength={10}
                onChangeText={(v) => setField("dob", v)}
                placeholder="YYYY-MM-DD"
                value={form.dob}
              />
            </View>
            <View className="flex-row gap-3">
              <Button
                className="flex-1"
                disabled={updateProfile.isPending}
                onPress={handleSave}
              >
                <Text>{updateProfile.isPending ? "Saving…" : "Save"}</Text>
              </Button>
              <Button
                className="flex-1"
                disabled={updateProfile.isPending}
                onPress={handleCancel}
                variant="outline"
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      ) : profile ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <View
              className={
                profile.emailVerified
                  ? "rounded-full bg-emerald-500/10 px-2.5 py-0.5"
                  : "rounded-full bg-muted px-2.5 py-0.5"
              }
            >
              <Text
                className={
                  profile.emailVerified
                    ? "font-medium text-emerald-500 text-xs"
                    : "font-medium text-muted-foreground text-xs"
                }
              >
                {profile.emailVerified ? "Verified" : "Not verified"}
              </Text>
            </View>
          </CardHeader>
          <CardContent className="gap-4">
            <InfoRow
              icon={Mail}
              label="Email"
              value={profile.email || "Not provided"}
            />
            <Separator />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={profile.phone || "Not provided"}
            />
            <Separator />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={profile.address || "Not provided"}
            />
            <Separator />
            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={formatDate(profile.dateOfBirth)}
            />
            <Separator />
            <InfoRow
              icon={Calendar}
              label="Member since"
              value={formatDate(profile.createdAt)}
            />
          </CardContent>
        </Card>
      ) : null}

      {!editing && profile ? (
        <Button
          className="flex-row gap-2"
          onPress={() => setEditing(true)}
          variant="outline"
        >
          <Icon as={Edit3} size={18} className="text-foreground" />
          <Text>Edit Profile</Text>
        </Button>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>KYC Status</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-sm">Identity verification</Text>
            <View className="rounded-full bg-amber-500/10 px-2.5 py-0.5">
              <Text className="font-medium text-amber-500 text-xs">Preview</Text>
            </View>
          </View>
          <Text className="text-muted-foreground text-xs">
            Verification isn&apos;t connected yet.
          </Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
