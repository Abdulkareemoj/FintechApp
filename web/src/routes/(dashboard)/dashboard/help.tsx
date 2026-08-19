import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	LifeBuoy,
	Mail,
	MessageSquare,
	Phone,
	Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useHelpArticles } from "@/hooks/useHelp";
import DashboardLayout from "@/layout/DashboardLayout";

export const Route = createFileRoute("/(dashboard)/dashboard/help")({
	component: HelpCenterPage,
});

function HelpCenterPage() {
	const { data: articles, isPending, isError, refetch } = useHelpArticles();
	const [search, setSearch] = useState("");

	const filtered = (articles ?? []).filter(
		(a) =>
			!search ||
			a.question.toLowerCase().includes(search.toLowerCase()) ||
			a.answer.toLowerCase().includes(search.toLowerCase()) ||
			a.category.toLowerCase().includes(search.toLowerCase()),
	);

	const categories = Array.from(
		new Set((articles ?? []).map((a) => a.category)),
	);

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">Help Center</h1>
							<p className="mt-1 text-muted-foreground">
								Find answers to common questions and get in touch
							</p>
						</div>
						<a href="/dashboard/support">
							<Button variant="outline">
								<LifeBuoy className="mr-2 h-4 w-4" />
								Contact Support
							</Button>
						</a>
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle>Search Help Articles</CardTitle>
								<CardDescription>
									Type a keyword to filter questions and answers
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="relative">
									<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
									<Input
										className="bg-muted/50 pl-10"
										onChange={(e) => setSearch(e.target.value)}
										placeholder="e.g. password, transfer, card..."
										value={search}
									/>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{categories.length > 0 && (
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="flex flex-wrap gap-2"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.15 }}
						>
							{categories.map((category) => (
								<Button
									className="border-border/50"
									key={category}
									onClick={() => setSearch(search === category ? "" : category)}
									size="sm"
									variant={search === category ? "default" : "outline"}
								>
									<BookOpen className="mr-1.5 h-3.5 w-3.5" />
									{category}
								</Button>
							))}
						</motion.div>
					)}

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle>Frequently Asked Questions</CardTitle>
								<CardDescription>
									{search ? `Results for "${search}"` : "All articles"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isPending ? (
									<div className="flex justify-center py-8">
										<Spinner />
									</div>
								) : isError ? (
									<div className="flex flex-col items-center gap-3 py-8">
										<p className="text-muted-foreground">
											Couldn't load articles.
										</p>
										<Button onClick={() => refetch()} variant="outline">
											Retry
										</Button>
									</div>
								) : filtered.length === 0 ? (
									<p className="py-4 text-center text-muted-foreground">
										No articles match your search.
									</p>
								) : (
									<Accordion className="space-y-2" collapsible type="single">
										{filtered.map((article) => (
											<AccordionItem
												className="rounded-lg border-border/50 bg-accent/20 px-4"
												key={article.id}
												value={`article-${article.id}`}
											>
												<AccordionTrigger className="py-4 hover:no-underline">
													<span className="text-left font-medium">
														{article.question}
													</span>
												</AccordionTrigger>
												<AccordionContent className="pb-4 text-muted-foreground">
													{article.answer}
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								)}
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle>Still need help?</CardTitle>
								<CardDescription>
									Reach us through any of these channels
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4 md:grid-cols-3">
								{[
									{
										icon: MessageSquare,
										label: "Live Chat",
										value: "Start Chat",
									},
									{
										icon: Phone,
										label: "Phone Support",
										value: "1-800-FINPAY",
									},
									{
										icon: Mail,
										label: "Email Support",
										value: "support@finpay.com",
									},
								].map((item) => (
									<div
										className="flex items-center gap-3 rounded-xl bg-accent/30 p-4"
										key={item.label}
									>
										<div className="rounded-lg bg-primary/10 p-2.5 text-primary">
											<item.icon className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium text-sm">{item.label}</p>
											<p className="text-muted-foreground text-xs">
												{item.value}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
