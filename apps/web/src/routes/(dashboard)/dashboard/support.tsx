import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/layout/DashboardLayout";

const tickets = [
  {
    id: "#1029",
    subject: "Transfer failed",
    status: "pending",
    date: "2024-07-20",
  },
  {
    id: "#1025",
    subject: "Question about fees",
    status: "closed",
    date: "2024-07-18",
  },
  {
    id: "#1021",
    subject: "Account verification issue",
    status: "in-progress",
    date: "2024-07-15",
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to Settings > Security > Change Password. Enter your current password and set a new one.",
  },
  {
    question: "What are the transfer limits?",
    answer:
      "Daily transfer limits are $10,000 for verified accounts. You can request higher limits through support.",
  },
  {
    question: "How long do transfers take?",
    answer:
      "Internal transfers are instant. Bank transfers typically take 1-3 business days.",
  },
  {
    question: "How do I add a new bank account?",
    answer:
      "Navigate to Accounts > Add New Account and follow the verification steps to link your bank.",
  },
];

const statusVariants: Record<string, { color: string; label: string }> = {
  pending: {
    color: "bg-warning/10 text-warning border-warning/20",
    label: "Pending Review",
  },
  "in-progress": {
    color: "bg-primary/10 text-primary border-primary/20",
    label: "In Progress",
  },
  closed: {
    color: "bg-success/10 text-success border-success/20",
    label: "Closed",
  },
};

export const Route = createFileRoute("/(dashboard)/dashboard/support")({
  component: SupportPage,
});

function SupportPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-6 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
            initial={{ opacity: 0, y: 10 }}
          >
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                Customer Support
              </h1>
              <p className="mt-1 text-muted-foreground">
                Get help with your account and transactions
              </p>
            </div>
            <Button variant="outline">
              <LifeBuoy className="mr-2 h-4 w-4" />
              Help Center
            </Button>
          </motion.div>

          {/* Quick Contact Options */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            {[
              {
                icon: MessageSquare,
                label: "Live Chat",
                description: "Chat with our support team",
                action: "Start Chat",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: Phone,
                label: "Phone Support",
                description: "Call us 24/7",
                action: "1-800-FINPAY",
                color: "bg-success/10 text-success",
              },
              {
                icon: Mail,
                label: "Email Support",
                description: "We'll respond within 24h",
                action: "support@finpay.com",
                color: "bg-warning/10 text-warning",
              },
            ].map((item) => (
              <Card
                className="group cursor-pointer border-border/50 bg-card-gradient shadow-card transition-all duration-300 hover:shadow-elevated"
                key={item.label}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div
                    className={`rounded-xl p-3 ${item.color} transition-transform group-hover:scale-110`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                    <p className="mt-1 font-medium text-primary text-sm">
                      {item.action}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* New Ticket Form */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    New Support Ticket
                  </CardTitle>
                  <CardDescription>
                    Describe your issue and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transaction">
                          Transaction Issue
                        </SelectItem>
                        <SelectItem value="account">Account Problem</SelectItem>
                        <SelectItem value="card">Card Issue</SelectItem>
                        <SelectItem value="security">
                          Security Concern
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing Question
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      className="bg-muted/50"
                      id="subject"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      className="resize-none bg-muted/50"
                      id="description"
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Attachments (Optional)</Label>
                    <div className="cursor-pointer rounded-lg border-2 border-border border-dashed p-6 text-center transition-colors hover:border-primary/50">
                      <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        Drag and drop files or click to upload
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-primary-gradient">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Tickets */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Your Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.map((ticket) => {
                    const status = statusVariants[ticket.status];
                    return (
                      <div
                        className="flex cursor-pointer items-start justify-between rounded-xl bg-accent/30 p-4 transition-colors hover:bg-accent/50"
                        key={ticket.id}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {ticket.subject}
                            </p>
                            <span className="text-muted-foreground text-xs">
                              {ticket.id}
                            </span>
                          </div>
                          <Badge
                            className={`text-xs ${status.color}`}
                            variant="outline"
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {new Date(ticket.date).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                  <Button className="w-full text-primary" variant="ghost">
                    View All Tickets
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQs */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50 bg-card-gradient shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Quick answers to common questions
                    </CardDescription>
                  </div>
                  <div className="relative hidden w-64 md:block">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="bg-muted/50 pl-10"
                      placeholder="Search FAQs..."
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion className="space-y-2" collapsible type="single">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      className="rounded-lg border-border/50 bg-accent/20 px-4"
                      key={index}
                      value={`faq-${index}`}
                    >
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <span className="text-left font-medium">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
}
