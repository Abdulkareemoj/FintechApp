import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", income: 4000, spending: 2400 },
  { month: "Feb", income: 3000, spending: 1398 },
  { month: "Mar", income: 5000, spending: 3800 },
  { month: "Apr", income: 4780, spending: 3908 },
  { month: "May", income: 5890, spending: 4800 },
  { month: "Jun", income: 4390, spending: 3800 },
  { month: "Jul", income: 6490, spending: 4300 },
];

export function SpendingChart() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border-border/50 bg-card-gradient shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-semibold text-lg">
            Financial Overview
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Income vs Spending this year
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(160 84% 39%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(160 84% 39%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="spendingGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(217 33% 55%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(217 33% 55%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="hsl(217 33% 20%)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 47% 13%)",
                    border: "1px solid hsl(217 33% 20%)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "",
                  ]}
                  itemStyle={{ color: "hsl(210 40% 98%)" }}
                  labelStyle={{ color: "hsl(210 40% 98%)" }}
                />
                <Area
                  dataKey="income"
                  fill="url(#incomeGradient)"
                  name="Income"
                  stroke="hsl(160 84% 39%)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Area
                  dataKey="spending"
                  fill="url(#spendingGradient)"
                  name="Spending"
                  stroke="hsl(217 33% 55%)"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground text-sm">Spending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
