import { createFileRoute } from "@tanstack/react-router";
import MerchantLayout from "@/layout/MerchantLayout";
import { motion } from "motion/react";
import {
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Book,
  Code2,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tickets = [
  { id: "TKT-1234", subject: "API integration issue", status: "open", priority: "high", updated: "2 hours ago" },
  { id: "TKT-1233", subject: "Settlement delay inquiry", status: "pending", priority: "medium", updated: "1 day ago" },
  { id: "TKT-1232", subject: "Webhook configuration help", status: "resolved", priority: "low", updated: "3 days ago" },
];

const faqs = [
  {
    question: "How long do settlements take?",
    answer: "Standard settlements take 2-3 business days. You can request instant payouts for a small fee if you need funds faster.",
  },
  {
    question: "What are your transaction fees?",
    answer: "Our standard rate is 2.9% + $0.30 per successful transaction. Volume discounts are available for high-volume merchants.",
  },
  {
    question: "How do I handle refunds?",
    answer: "Refunds can be processed directly from the Payments page. Click on any transaction and select 'Refund'. Funds typically return to customers within 5-10 business days.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We are PCI DSS Level 1 certified and use industry-standard encryption. All sensitive data is tokenized and we never store raw card numbers.",
  },
];

const resources = [
  { title: "API Documentation", description: "Complete API reference and guides", icon: Code2, link: "#" },
  { title: "Integration Guides", description: "Step-by-step setup tutorials", icon: Book, link: "#" },
  { title: "FAQ & Help Center", description: "Common questions answered", icon: HelpCircle, link: "#" },
];

export const Route = createFileRoute("/(dashboard)/merchant/support")({
  component: MerchantSupport,
});

function MerchantSupport() {
    const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      open: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
    return config[status] || "";
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, string> = {
      high: "bg-red-500/10 text-red-400 border-red-500/20",
      medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      low: "bg-muted text-muted-foreground",
    };
    return config[priority] || "";
  };

  return (
    <MerchantLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">{/* Header */} <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground mt-1">Get help with your merchant account and integration.</p>
      </motion.div>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Live Chat", description: "Chat with our support team", icon: MessageSquare, action: "Start Chat", available: true },
          { title: "Phone Support", description: "+1 (800) 123-4567", icon: Phone, action: "Call Now", available: true },
          { title: "Email Support", description: "support@finpay.com", icon: Mail, action: "Send Email", available: true },
        ].map((contact, index) => (
          <motion.div
            key={contact.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-violet-500/30 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                  <contact.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="font-semibold">{contact.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{contact.description}</p>
                <Button className="mt-4 bg-violet-500 hover:bg-violet-600 w-full">
                  {contact.action}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Submit a Ticket</CardTitle>
              <CardDescription>Describe your issue and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Brief description of your issue" className="bg-muted/50" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="integration">API Integration</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                      <SelectItem value="settlements">Settlements</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Provide detailed information about your issue..." className="bg-muted/50 min-h-[120px]" />
              </div>
              <Button className="bg-violet-500 hover:bg-violet-600 w-full">
                Submit Ticket
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Your Tickets</CardTitle>
              <CardDescription>Track and manage your support requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                        <Badge variant="outline" className={getStatusBadge(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityBadge(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="font-medium mt-1">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {ticket.updated}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Tickets
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Developer Resources</CardTitle>
            <CardDescription>Documentation and guides for integration.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <resource.icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{resource.title}</h3>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-border/50">
                  <AccordionTrigger className="hover:no-underline text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div></main>
      </div>
    </MerchantLayout>
  );
}
