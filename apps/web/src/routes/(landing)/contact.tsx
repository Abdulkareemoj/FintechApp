import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea is available or will be added
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <LandingLayout>
      <div className="container py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-center font-bold text-4xl">Get in Touch</h1>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            We're here to help. Send us a message and we'll get back to you as
            soon as possible.
          </p>
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="your@email.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LandingLayout>
  );
}
