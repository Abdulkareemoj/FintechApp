import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	FileText,
	HelpCircle,
	Search,
	Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupportLayout from "@/layout/SupportLayout";

export const Route = createFileRoute("/(dashboard)/support/knowledge")({
	component: SupportKnowledge,
});

interface Article {
	id: string;
	title: string;
	excerpt: string;
	category: string;
	type: "guide" | "faq" | "video" | "troubleshoot";
	readTime: string;
	popular: boolean;
}

const articles: Article[] = [
	{
		id: "ART-001",
		title: "Getting Started with Finova",
		excerpt: "Learn the basics of setting up your account, navigating the dashboard, and making your first transaction.",
		category: "Getting Started",
		type: "guide",
		readTime: "8 min",
		popular: true,
	},
	{
		id: "ART-002",
		title: "How to Reset Your Password",
		excerpt: "Step-by-step instructions for resetting your password if you've forgotten it or want to update it.",
		category: "Account",
		type: "guide",
		readTime: "3 min",
		popular: true,
	},
	{
		id: "ART-003",
		title: "Understanding Transaction Fees",
		excerpt: "A breakdown of all transaction fees, including domestic transfers, international wires, and currency conversion.",
		category: "Payments",
		type: "faq",
		readTime: "5 min",
		popular: false,
	},
	{
		id: "ART-004",
		title: "Card Security Best Practices",
		excerpt: "Tips to keep your virtual and physical cards secure, including freeze features and spending limits.",
		category: "Security",
		type: "guide",
		readTime: "6 min",
		popular: true,
	},
	{
		id: "ART-005",
		title: "Troubleshooting Payment Failures",
		excerpt: "Common reasons why payments fail and how to resolve them quickly.",
		category: "Troubleshooting",
		type: "troubleshoot",
		readTime: "4 min",
		popular: false,
	},
	{
		id: "ART-006",
		title: "Setting Up Recurring Payments",
		excerpt: "How to schedule automatic payments for bills, subscriptions, and recurring transfers.",
		category: "Payments",
		type: "video",
		readTime: "2 min",
		popular: false,
	},
	{
		id: "ART-007",
		title: "KYC Verification Process",
		excerpt: "What documents you need and how to complete your identity verification to unlock higher limits.",
		category: "Account",
		type: "guide",
		readTime: "5 min",
		popular: true,
	},
	{
		id: "ART-008",
		title: "International Transfers Guide",
		excerpt: "Everything you need to know about sending money abroad, including exchange rates and delivery times.",
		category: "Transfers",
		type: "guide",
		readTime: "7 min",
		popular: false,
	},
	{
		id: "ART-009",
		title: "Disputing a Transaction",
		excerpt: "How to report an unauthorized or incorrect transaction and track your dispute status.",
		category: "Security",
		type: "troubleshoot",
		readTime: "4 min",
		popular: false,
	},
	{
		id: "ART-010",
		title: "Using the Mobile App",
		excerpt: "Tips for using Finova on mobile, including biometric login, mobile check deposit, and notifications.",
		category: "Getting Started",
		type: "guide",
		readTime: "6 min",
		popular: false,
	},
];

const categories = [...new Set(articles.map((a) => a.category))];

const typeIcons = {
	guide: BookOpen,
	faq: HelpCircle,
	video: Video,
	troubleshoot: FileText,
};

function SupportKnowledge() {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");

	const filtered = articles.filter((a) => {
		const matchesSearch =
			search === "" ||
			a.title.toLowerCase().includes(search.toLowerCase()) ||
			a.excerpt.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			activeCategory === "all" || a.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<SupportLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-8 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<div className="mb-8">
							<h1 className="font-bold text-3xl text-foreground tracking-tight">
								Knowledge Base
							</h1>
							<p className="mt-1 text-muted-foreground">
								Guides, FAQs, and resources to help you support users faster.
							</p>
						</div>

						{/* Search */}
						<div className="relative mb-6 max-w-xl">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
							<Input
								className="pl-10"
								placeholder="Search knowledge base..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						{/* Category Tabs */}
						<Tabs
							value={activeCategory}
							onValueChange={setActiveCategory}
							className="mb-8"
						>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								{categories.map((cat) => (
									<TabsTrigger key={cat} value={cat}>
										{cat}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>

						{/* Articles Grid */}
						{filtered.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2">
								{filtered.map((article) => {
									const TypeIcon = typeIcons[article.type];
									return (
										<Card
											key={article.id}
											className="cursor-pointer transition-shadow hover:shadow-md"
										>
											<CardHeader className="pb-2">
												<div className="flex items-start justify-between gap-2">
													<div className="flex items-center gap-2">
														<TypeIcon className="h-4 w-4 text-primary" />
														<CardTitle className="text-base">
															{article.title}
														</CardTitle>
													</div>
													{article.popular && (
														<Badge variant="secondary" className="shrink-0 text-[10px]">
															Popular
														</Badge>
													)}
												</div>
												<CardDescription className="mt-1">
													{article.excerpt}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex items-center gap-3 text-xs text-muted-foreground">
													<span className="capitalize">{article.type}</span>
													<span>·</span>
													<span>{article.readTime} read</span>
													<span>·</span>
													<span>{article.category}</span>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						) : (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-16">
									<HelpCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
									<p className="text-sm text-muted-foreground">
										No articles found for your search
									</p>
								</CardContent>
							</Card>
						)}
					</motion.div>
				</main>
			</div>
		</SupportLayout>
	);
}
