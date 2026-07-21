import { Building2, CreditCard, PiggyBank, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Account {
	id: string;
	name: string;
	type: "checking" | "savings" | "credit" | "business";
	balance: number;
	lastFour: string;
}

interface AccountsListProps {
	accounts: Account[];
}

const accountIcons = {
	checking: Wallet,
	savings: PiggyBank,
	credit: CreditCard,
	business: Building2,
};

export function AccountsList({ accounts }: AccountsListProps) {
	const formatBalance = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(amount);

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.4, delay: 0.3 }}
		>
			<Card className="border-border/50 bg-card-gradient shadow-card">
				<CardHeader className="pb-4">
					<CardTitle className="font-semibold text-lg">
						Account Balances
					</CardTitle>
					<p className="text-muted-foreground text-sm">
						All your linked accounts
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					{accounts.map((account, index) => {
						const Icon = accountIcons[account.type];
						const isNegative = account.balance < 0;

						return (
							<motion.div
								animate={{ opacity: 1, x: 0 }}
								className="group flex cursor-pointer items-center justify-between rounded-xl bg-accent/30 p-4 transition-colors hover:bg-accent/50"
								initial={{ opacity: 0, x: 10 }}
								key={account.id}
								transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
							>
								<div className="flex items-center gap-4">
									<div className="rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
										<Icon className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="font-medium">{account.name}</p>
										<p className="text-muted-foreground text-sm">
											•••• {account.lastFour}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p
										className={`number-display font-semibold text-lg ${
											isNegative ? "text-destructive" : "text-foreground"
										}`}
									>
										{formatBalance(account.balance)}
									</p>
								</div>
							</motion.div>
						);
					})}
				</CardContent>
			</Card>
		</motion.div>
	);
}
