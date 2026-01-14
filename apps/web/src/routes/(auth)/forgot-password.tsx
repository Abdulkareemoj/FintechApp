import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { LandingLayout } from "@/layout/LandingLayout";
// import { axiosClient } from "@/utils/";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword({ className, ...props }: React.ComponentProps<"div">) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // const onSubmit = async (values: ForgotPasswordFormValues) => {
  //   try {
  //     const response = await axiosClient.post("/api/forgot-password", values, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     // using shadcn toast system (sonner already in project)
  //     toast.success(response.data.message ?? "Password reset email sent");
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       toast.error(
  //         error.response.data.message ?? "Failed to send password reset email"
  //       );
  //     } else {
  //       toast.error("An unexpected error occurred. Please try again later.");
  //     }
  //   }
  // };

  return (
  <LandingLayout>  <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  className="p-6 md:p-8"
                  // onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="font-bold text-2xl">
                        Forgot your password?
                      </h1>
                      <p className="text-balance text-muted-foreground">
                        Enter your email to reset your password
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="email"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button className="w-full" type="submit">
                      Send password reset email
                    </Button>
                    <div className="text-center text-sm">
                      Remember your password?
                      <Link
                        className="underline underline-offset-4"
                        to="/signin" 
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block">
                <img
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  src="/placeholder.svg"
                />
              </div>
            </CardContent>
          </Card>
       
        </div>
      </div>
    </div>
</LandingLayout>  );
}
