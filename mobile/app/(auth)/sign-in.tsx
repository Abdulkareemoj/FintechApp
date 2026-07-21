import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { type SignInFormValues, signInSchema } from "@/lib/schemas";
import { showToast } from "@/lib/toast";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "User" | "Admin" | "Support" | "Merchant";
  };
};

export default function SignInScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const passwordInputRef = React.useRef<TextInput>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit(values: SignInFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        email: values.email,
        password: values.password,
      });

      if (!res.ok) {
        setError(res.error);
        showToast({
          title: "Sign-in failed",
          message: res.error,
          type: "error",
        });
        return;
      }

      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      showToast({
        title: "Signed in",
        message: "Welcome back!",
        type: "success",
      });
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
                Sign in to your app
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Welcome back! Please sign in to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {error && (
                <Alert icon={AlertCircle} variant="destructive">
                  <AlertTitle>Sign-in Failed</AlertTitle>
                  <AlertDescription>
                    {error.includes("Invalid login credentials")
                      ? "Incorrect email or password."
                      : error}
                  </AlertDescription>
                </Alert>
              )}
              <View className="gap-6">
                <View className="gap-1.5">
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <View className="gap-1.5">
                        <Label htmlFor={field.name}>Email</Label>
                        <Input
                          autoCapitalize="none"
                          autoComplete="email"
                          editable={!isSubmitting}
                          id={field.name}
                          keyboardType="email-address"
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          onSubmitEditing={onEmailSubmitEditing}
                          placeholder="m@example.com"
                          returnKeyType="next"
                          submitBehavior="submit"
                          value={field.value}
                        />
                        {fieldState.error?.message && (
                          <Text className="text-destructive text-sm">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
                <View className="gap-1.5">
                  <View className="flex-row items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link asChild href="/(auth)/forgot-password">
                      <Button
                        className="ml-auto h-4 web:h-fit px-1 py-0 sm:h-4"
                        size="sm"
                        variant="link"
                      >
                        <Text className="font-normal leading-4">
                          Forgot your password?
                        </Text>
                      </Button>
                    </Link>
                  </View>
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <View className="gap-1.5">
                        <Input
                          editable={!isSubmitting}
                          id={field.name}
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          onSubmitEditing={form.handleSubmit(onSubmit)}
                          ref={passwordInputRef}
                          returnKeyType="send"
                          secureTextEntry
                          value={field.value}
                        />
                        {fieldState.error?.message && (
                          <Text className="text-destructive text-sm">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onPress={form.handleSubmit(onSubmit)}
                >
                  <Text>{isSubmitting ? "Signing In..." : "Continue"}</Text>
                </Button>
              </View>
              <View className="flex flex-row items-center justify-center gap-2 text-sm">
                <Text>Don&apos;t have an account?</Text>
                <Pressable
                  onPress={() => {
                    router.push("/(auth)/sign-up");
                  }}
                >
                  <Text className="text-sm underline underline-offset-4">
                    Sign Up
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row items-center">
                <Separator className="flex-1" />
                <Text className="px-4 text-muted-foreground text-sm">or</Text>
                <Separator className="flex-1" />
              </View>

              <View className="gap-3">
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  variant="outline"
                  // onPress={()}
                >
                  <Text>Continue with Google</Text>
                </Button>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  variant="outline"
                  // onPress={}
                >
                  <View className="flex-row items-center gap-2">
                    <Text>Continue with Apple</Text>
                  </View>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
