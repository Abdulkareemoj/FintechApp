import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  DollarSign,
  Globe,
  Lock,
  Percent,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Sliders,
  ToggleLeft,
} from "lucide-react";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/settings")({
  component: AdminSettings,
});

interface FeeSettings {
  transferFee: number;
  withdrawalFee: number;
  depositFee: number;
  internationalFee: number;
  minimumFee: number;
}

interface LimitSettings {
  dailyLimit: number;
  monthlyLimit: number;
  singleTransactionLimit: number;
  unverifiedDailyLimit: number;
}

interface FeatureToggles {
  cryptoTransfers: boolean;
  internationalTransfers: boolean;
  instantTransfers: boolean;
  virtualCards: boolean;
  billPayments: boolean;
  p2pPayments: boolean;
}
function AdminSettings() {
  const [feeSettings, setFeeSettings] = useState<FeeSettings>({
    transferFee: 1.5,
    withdrawalFee: 2.0,
    depositFee: 0,
    internationalFee: 3.5,
    minimumFee: 0.5,
  });

  const [limitSettings, setLimitSettings] = useState<LimitSettings>({
    dailyLimit: 10_000,
    monthlyLimit: 50_000,
    singleTransactionLimit: 5000,
    unverifiedDailyLimit: 500,
  });

  const [featureToggles, setFeatureToggles] = useState<FeatureToggles>({
    cryptoTransfers: true,
    internationalTransfers: true,
    instantTransfers: true,
    virtualCards: true,
    billPayments: true,
    p2pPayments: true,
  });

  const [riskThreshold, setRiskThreshold] = useState([65]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration changes have been applied successfully.",
    });
  };
  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">
          {" "}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: -20 }}
          >
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                System Settings
              </h1>
              <p className="text-muted-foreground">
                Configure platform fees, limits, and feature toggles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={handleSaveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </motion.div>
          {/* Settings Tabs */}
          <Tabs className="w-full" defaultValue="fees">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger className="flex items-center gap-2" value="fees">
                <Percent className="h-4 w-4" />
                Fees
              </TabsTrigger>
              <TabsTrigger className="flex items-center gap-2" value="limits">
                <DollarSign className="h-4 w-4" />
                Limits
              </TabsTrigger>
              <TabsTrigger className="flex items-center gap-2" value="features">
                <ToggleLeft className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger className="flex items-center gap-2" value="risk">
                <Shield className="h-4 w-4" />
                Risk
              </TabsTrigger>
            </TabsList>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
                initial={{ opacity: 0, y: 20 }}
              >
                <Card className="border-border/50 bg-card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Percent className="h-5 w-5 text-amber-500" />
                      Transaction Fees
                    </CardTitle>
                    <CardDescription>
                      Configure platform fees for different transaction types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="transferFee">Transfer Fee (%)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            className="bg-muted/50"
                            id="transferFee"
                            onChange={(e) =>
                              setFeeSettings({
                                ...feeSettings,
                                transferFee: Number.parseFloat(e.target.value),
                              })
                            }
                            step="0.1"
                            type="number"
                            value={feeSettings.transferFee}
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Applied to all domestic transfers
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="withdrawalFee">
                          Withdrawal Fee (%)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            className="bg-muted/50"
                            id="withdrawalFee"
                            onChange={(e) =>
                              setFeeSettings({
                                ...feeSettings,
                                withdrawalFee: Number.parseFloat(
                                  e.target.value
                                ),
                              })
                            }
                            step="0.1"
                            type="number"
                            value={feeSettings.withdrawalFee}
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Applied to bank withdrawals
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internationalFee">
                          International Fee (%)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            className="bg-muted/50"
                            id="internationalFee"
                            onChange={(e) =>
                              setFeeSettings({
                                ...feeSettings,
                                internationalFee: Number.parseFloat(
                                  e.target.value
                                ),
                              })
                            }
                            step="0.1"
                            type="number"
                            value={feeSettings.internationalFee}
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Applied to cross-border transactions
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimumFee">Minimum Fee ($)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            className="bg-muted/50"
                            id="minimumFee"
                            onChange={(e) =>
                              setFeeSettings({
                                ...feeSettings,
                                minimumFee: Number.parseFloat(e.target.value),
                              })
                            }
                            step="0.1"
                            type="number"
                            value={feeSettings.minimumFee}
                          />
                          <span className="text-muted-foreground">$</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Minimum fee per transaction
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Limits Tab */}
            <TabsContent value="limits">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
                initial={{ opacity: 0, y: 20 }}
              >
                <Card className="border-border/50 bg-card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-amber-500" />
                      Transaction Limits
                    </CardTitle>
                    <CardDescription>
                      Set default limits for verified and unverified users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="dailyLimit">
                          Daily Limit (Verified)
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            className="bg-muted/50"
                            id="dailyLimit"
                            onChange={(e) =>
                              setLimitSettings({
                                ...limitSettings,
                                dailyLimit: Number.parseInt(e.target.value),
                              })
                            }
                            type="number"
                            value={limitSettings.dailyLimit}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyLimit">
                          Monthly Limit (Verified)
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            className="bg-muted/50"
                            id="monthlyLimit"
                            onChange={(e) =>
                              setLimitSettings({
                                ...limitSettings,
                                monthlyLimit: Number.parseInt(e.target.value),
                              })
                            }
                            type="number"
                            value={limitSettings.monthlyLimit}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="singleLimit">
                          Single Transaction Limit
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            className="bg-muted/50"
                            id="singleLimit"
                            onChange={(e) =>
                              setLimitSettings({
                                ...limitSettings,
                                singleTransactionLimit: Number.parseInt(
                                  e.target.value
                                ),
                              })
                            }
                            type="number"
                            value={limitSettings.singleTransactionLimit}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unverifiedLimit">
                          Daily Limit (Unverified)
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            className="bg-muted/50"
                            id="unverifiedLimit"
                            onChange={(e) =>
                              setLimitSettings({
                                ...limitSettings,
                                unverifiedDailyLimit: Number.parseInt(
                                  e.target.value
                                ),
                              })
                            }
                            type="number"
                            value={limitSettings.unverifiedDailyLimit}
                          />
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Maximum daily transactions for unverified users
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
                initial={{ opacity: 0, y: 20 }}
              >
                <Card className="border-border/50 bg-card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ToggleLeft className="h-5 w-5 text-amber-500" />
                      Feature Toggles
                    </CardTitle>
                    <CardDescription>
                      Enable or disable platform features globally
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="space-y-1">
                          <Label className="text-base">Crypto Transfers</Label>
                          <p className="text-muted-foreground text-sm">
                            Allow users to send and receive cryptocurrency
                          </p>
                        </div>
                        <Switch
                          checked={featureToggles.cryptoTransfers}
                          onCheckedChange={(checked) =>
                            setFeatureToggles({
                              ...featureToggles,
                              cryptoTransfers: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="space-y-1">
                          <Label className="text-base">
                            International Transfers
                          </Label>
                          <p className="text-muted-foreground text-sm">
                            Enable cross-border money transfers
                          </p>
                        </div>
                        <Switch
                          checked={featureToggles.internationalTransfers}
                          onCheckedChange={(checked) =>
                            setFeatureToggles({
                              ...featureToggles,
                              internationalTransfers: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="space-y-1">
                          <Label className="text-base">Instant Transfers</Label>
                          <p className="text-muted-foreground text-sm">
                            Allow instant money transfers between users
                          </p>
                        </div>
                        <Switch
                          checked={featureToggles.instantTransfers}
                          onCheckedChange={(checked) =>
                            setFeatureToggles({
                              ...featureToggles,
                              instantTransfers: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="space-y-1">
                          <Label className="text-base">Virtual Cards</Label>
                          <p className="text-muted-foreground text-sm">
                            Enable virtual card creation and management
                          </p>
                        </div>
                        <Switch
                          checked={featureToggles.virtualCards}
                          onCheckedChange={(checked) =>
                            setFeatureToggles({
                              ...featureToggles,
                              virtualCards: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="space-y-1">
                          <Label className="text-base">Bill Payments</Label>
                          <p className="text-muted-foreground text-sm">
                            Allow users to pay bills through the platform
                          </p>
                        </div>
                        <Switch
                          checked={featureToggles.billPayments}
                          onCheckedChange={(checked) =>
                            setFeatureToggles({
                              ...featureToggles,
                              billPayments: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="space-y-1">
                          <Label className="text-base">P2P Payments</Label>
                          <p className="text-muted-foreground text-sm">
                            Enable peer-to-peer payment functionality
                          </p>
                        </div>
                        <Switch
                          checked={featureToggles.p2pPayments}
                          onCheckedChange={(checked) =>
                            setFeatureToggles({
                              ...featureToggles,
                              p2pPayments: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Risk Tab */}
            <TabsContent value="risk">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
                initial={{ opacity: 0, y: 20 }}
              >
                <Card className="border-border/50 bg-card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-500" />
                      Risk Management
                    </CardTitle>
                    <CardDescription>
                      Configure risk thresholds and automated actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Automatic Flag Threshold</Label>
                          <Badge
                            className="border-amber-500/50 text-amber-500"
                            variant="outline"
                          >
                            Risk Score: {riskThreshold[0]}
                          </Badge>
                        </div>
                        <Slider
                          className="w-full"
                          max={100}
                          onValueChange={setRiskThreshold}
                          step={5}
                          value={riskThreshold}
                        />
                        <p className="text-muted-foreground text-xs">
                          Transactions with a risk score above this threshold
                          will be automatically flagged for review
                        </p>
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h4 className="font-medium">Automated Actions</h4>

                        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                          <div className="space-y-1">
                            <Label className="text-base">
                              Auto-block High Risk
                            </Label>
                            <p className="text-muted-foreground text-sm">
                              Automatically block transactions with risk score
                              &gt; 90
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                          <div className="space-y-1">
                            <Label className="text-base">Email Alerts</Label>
                            <p className="text-muted-foreground text-sm">
                              Send email alerts for flagged transactions
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                          <div className="space-y-1">
                            <Label className="text-base">Velocity Checks</Label>
                            <p className="text-muted-foreground text-sm">
                              Monitor transaction frequency patterns
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminLayout>
  );
}
