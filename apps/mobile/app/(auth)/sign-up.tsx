import { AlertCircle } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, type TextInput, View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { router } from 'expo-router';
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/lib/authStore";
import { api } from "@/lib/api";

type RegisterResponse =
  | {
      requiresEmailVerification: true;
    }
  | {
      requiresEmailVerification?: false;
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: "customer" | "merchant" | "support" | "admin";
      };
    };

export default function SignUpScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post<RegisterResponse>("/api/auth/register", {
        name,
        email,
        password,
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      if ("requiresEmailVerification" in res.data && res.data.requiresEmailVerification) {
        router.replace({
          pathname: "/(auth)/verify-email" as any,
          params: { email },
        } as any);
        return;
      }

      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.replace("/(drawer)" as any);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <ScrollView
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full max-w-sm">
        <View className="gap-6">
          <Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl sm:text-left">
                Create your account
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Welcome! Please fill in the details to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {error && (
                <Alert icon={AlertCircle} variant="destructive">
                  <AlertTitle>Sign-up Failed</AlertTitle>
                  <AlertDescription>
                    {error.includes("unique constraint")
                      ? "This email is already in use."
                      : error}
                  </AlertDescription>
                </Alert>
              )}
              <View className="gap-6">
                <View className="gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    autoCapitalize="words"
                    autoComplete="name"
                    id="name"
                    onChangeText={setName}
                    placeholder="John Doe"
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={name}
                  />
                </View>
                <View className="gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    autoCapitalize="none"
                    autoComplete="email"
                    id="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    onSubmitEditing={onEmailSubmitEditing}
                    placeholder="m@example.com"
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={email}
                  />
                </View>
                <View className="gap-1.5">
                  <View className="flex-row items-center">
                    <Label htmlFor="password">Password</Label>
                  </View>
                  <Input
                    id="password"
                    onChangeText={setPassword}
                    onSubmitEditing={onSubmit}
                    ref={passwordInputRef}
                    returnKeyType="send"
                    secureTextEntry
                    value={password}
                  />
                </View>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onPress={onSubmit}
                >
                  <Text>
                    {isSubmitting ? "Creating Account..." : "Continue"}
                  </Text>
                </Button>
              </View>
            <View className="flex flex-row items-center justify-center gap-2 text-sm">
                <Text>Already have an account?</Text>
                <Pressable
                  onPress={() => {
                    router.push('/(auth)/sign-in');
                  }}>
                  <Text className="text-sm underline underline-offset-4">Sign In</Text>
                </Pressable>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
