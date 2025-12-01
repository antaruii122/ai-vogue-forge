import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard, Download, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Mock billing data
const mockSubscription = {
  plan: "Pro",
  price: "$29/month",
  credits_remaining: 75,
  credits_total: 100,
  next_billing_date: "2024-12-15",
  credits_used_this_month: 25,
  api_calls: 156,
  storage_used: "2.3 GB",
  storage_total: "10 GB",
};

const mockInvoices = [
  { id: "1", date: "2024-11-01", amount: "$29.00", status: "Paid", invoice_url: "#" },
  { id: "2", date: "2024-10-01", amount: "$29.00", status: "Paid", invoice_url: "#" },
  { id: "3", date: "2024-09-01", amount: "$29.00", status: "Paid", invoice_url: "#" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    credits: "10 credits/month",
    features: [
      "10 AI generations per month",
      "Basic templates",
      "Standard resolution",
      "Community support",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    credits: "100 credits/month",
    features: [
      "100 AI generations per month",
      "All premium templates",
      "High resolution exports",
      "Priority support",
      "API access",
      "Custom branding",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    credits: "Unlimited credits",
    features: [
      "Unlimited AI generations",
      "Custom templates",
      "Ultra-high resolution",
      "Dedicated support",
      "Advanced API access",
      "White-label solution",
      "Team collaboration",
      "SLA guarantee",
    ],
    current: false,
  },
];

const Billing = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [subscription] = useState(mockSubscription);

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Payment integration coming soon",
      description: `You selected the ${planName} plan. Payment processing will be available soon.`,
    });
  };

  const handleAddPaymentMethod = () => {
    toast({
      title: "Payment integration coming soon",
      description: "Payment method management will be available soon.",
    });
  };

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Downloading invoice",
      description: `Invoice #${id} is being downloaded`,
    });
  };

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  const creditsPercentage = (subscription.credits_remaining / subscription.credits_total) * 100;
  const storagePercentage = (parseFloat(subscription.storage_used) / 10) * 100;

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-white mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground">Manage your plan and billing information</p>
          </div>

          {/* Current Plan & Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Plan Card */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-400" />
                      Current Plan
                    </CardTitle>
                    <CardDescription>Your active subscription</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-purple-500/20 border-purple-500 text-purple-300">
                    {subscription.plan}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-bold text-white">{subscription.price}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credits remaining</span>
                      <span className="text-white font-semibold">
                        {subscription.credits_remaining} / {subscription.credits_total}
                      </span>
                    </div>
                    <Progress value={creditsPercentage} className="h-2" />
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Next billing date</span>
                      <span className="text-white">{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Usage Statistics</CardTitle>
                <CardDescription>Your usage this billing period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Credits used</span>
                    <span className="text-white font-semibold">{subscription.credits_used_this_month} credits</span>
                  </div>
                  <Progress value={(subscription.credits_used_this_month / subscription.credits_total) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Storage used</span>
                    <span className="text-white font-semibold">{subscription.storage_used} / {subscription.storage_total}</span>
                  </div>
                  <Progress value={storagePercentage} className="h-2" />
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API calls this month</span>
                    <span className="text-white font-semibold">{subscription.api_calls}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 relative ${
                    plan.popular ? "border-purple-500/50 shadow-lg shadow-purple-500/20" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period !== "contact sales" && (
                        <span className="text-muted-foreground ml-2">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-purple-400 mt-2">{plan.credits}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.current
                          ? "bg-gray-700 cursor-default hover:bg-gray-700"
                          : plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      disabled={plan.current}
                      onClick={() => handleUpgrade(plan.name)}
                    >
                      {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">No payment method added</p>
                <Button variant="outline" onClick={handleAddPaymentMethod}>
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">Invoice #{invoice.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-300">
                        {invoice.status}
                      </Badge>
                      <span className="text-white font-semibold">{invoice.amount}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-700"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Billing;
