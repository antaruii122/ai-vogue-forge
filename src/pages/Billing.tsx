import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Zap, Image, Video, Check, Sparkles, Clock, Info, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCredits } from "@/hooks/useCredits";
import { PayPalCheckoutModal } from "@/components/PayPalCheckoutModal";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  created_at: string;
  tier: string;
  amount_usd: number;
  credits_purchased: number;
  status: string;
}

const CREDIT_PACKAGES = [
  {
    name: "Trial",
    price: 9,
    credits: 20,
    perCredit: 0.45,
    savings: null,
    description: "20 photos OR 2 videos",
    popular: false,
  },
  {
    name: "Basic",
    price: 35,
    credits: 200,
    perCredit: 0.175,
    savings: "61%",
    description: "200 photos OR 20 videos",
    popular: false,
    badge: "⭐",
  },
  {
    name: "Professional",
    price: 99,
    credits: 600,
    perCredit: 0.165,
    savings: "63%",
    description: "600 photos OR 60 videos",
    popular: true,
    badge: "🔥",
  },
  {
    name: "Enterprise",
    price: 450,
    credits: 3000,
    perCredit: 0.15,
    savings: "67%",
    description: "3,000 photos OR 300 videos",
    popular: false,
  },
];

const Billing = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  // Use the shared credits hook as the single source of truth
  const { credits, totalPurchased, isLoading: creditsLoading, refetch: refetchCredits } = useCredits();
  const [isPayPalOpen, setIsPayPalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [usageStats, setUsageStats] = useState({ photos: 0, videos: 0 });

  // Fetch transactions and usage stats
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Fetch transactions
        const { data: txData, error: txError } = await supabase
          .from("payment_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (txError) {
          console.error("Error fetching transactions:", txError);
        } else {
          setTransactions(txData || []);
        }

        // Fetch usage stats (count generations this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: generationsData, error: genError } = await supabase
          .from("user_generations")
          .select("credits_used, style")
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth.toISOString());

        if (!genError && generationsData) {
          // Photos use 1 credit, videos use 10
          let photos = 0;
          let videos = 0;
          generationsData.forEach((gen) => {
            if (gen.credits_used >= 10) {
              videos += 1;
            } else {
              photos += 1;
            }
          });
          setUsageStats({ photos, videos });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleBuyCredits = () => {
    setIsPayPalOpen(true);
  };

  const handlePayPalClose = () => {
    setIsPayPalOpen(false);
    // Refetch credits after modal closes
    refetchCredits();
  };

  if (!isLoaded || creditsLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  const currentCredits = credits ?? 0;
  // Calculate credits spent: total purchased - current balance (excluding free signup credits)
  const creditsSpent = Math.max(0, totalPurchased + 3 - currentCredits); // +3 for free signup credits
  const videosCanMake = Math.floor(currentCredits / 10);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 md:p-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Credits & Billing</h1>
            <p className="text-muted-foreground">Manage your credits and purchase history</p>
          </div>

          {/* Top Section - Balance & Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Credit Balance Card */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Your Credit Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Large Credit Number */}
                  <div className="text-center py-4">
                    <span className="text-6xl font-bold text-foreground">{currentCredits}</span>
                    <span className="text-2xl text-muted-foreground ml-2">Credits</span>
                  </div>

                  {/* What you can create */}
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">What you can create:</p>
                    <div className="flex items-center gap-3 text-foreground">
                      <Image className="h-5 w-5 text-green-400" />
                      <span>{currentCredits} AI photos</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground">
                      <Video className="h-5 w-5 text-blue-400" />
                      <span>{videosCanMake} AI videos {currentCredits < 10 && <span className="text-muted-foreground text-sm">(need 10 credits)</span>}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyCredits}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-primary-foreground"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Buy More Credits
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2">
                  📊 Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-muted-foreground">Credits spent (lifetime)</span>
                    <span className="text-foreground font-semibold text-lg">{creditsSpent}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-green-400" />
                      <span className="text-muted-foreground">Photos this month</span>
                    </div>
                    <span className="text-foreground font-medium">{usageStats.photos}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-400" />
                      <span className="text-muted-foreground">Videos this month</span>
                    </div>
                    <span className="text-foreground font-medium">{usageStats.videos}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-muted-foreground">Credits remaining</span>
                    </div>
                    <span className="text-foreground font-semibold">{currentCredits}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total credits purchased</span>
                      <span className="text-foreground font-semibold">{totalPurchased}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Packages Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Buy Credits - Use Anytime</h2>
            <p className="text-muted-foreground mb-6">No subscription. Credits never expire.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CREDIT_PACKAGES.map((pkg) => (
                <Card
                  key={pkg.name}
                  className={`bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 relative transition-all hover:scale-[1.02] hover:shadow-lg ${
                    pkg.popular ? "border-purple-500/70 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500/50" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-primary-foreground border-none">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground text-lg">
                        {pkg.name} {pkg.badge}
                      </CardTitle>
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                    </div>
                    <p className="text-lg text-purple-400 font-semibold">{pkg.credits} credits</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{pkg.description}</p>
                      <p className="text-muted-foreground">${pkg.perCredit.toFixed(3)}/credit</p>
                      {pkg.savings && (
                        <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-300">
                          Save {pkg.savings}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={handleBuyCredits}
                      className={`w-full ${
                        pkg.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-primary-foreground"
                          : "bg-gray-700 hover:bg-gray-600 text-foreground"
                      }`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Your recent credit purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTransactions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No transactions yet</p>
                  <Button onClick={handleBuyCredits} variant="outline">
                    Buy Your First Credits <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-muted-foreground">Package</TableHead>
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Credits</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-gray-700">
                        <TableCell className="text-foreground">
                          {format(new Date(tx.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-foreground capitalize">{tx.tier}</TableCell>
                        <TableCell className="text-foreground">${tx.amount_usd.toFixed(2)}</TableCell>
                        <TableCell className="text-green-400 font-medium">+{tx.credits_purchased}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              tx.status === "completed"
                                ? "bg-green-500/20 border-green-500 text-green-300"
                                : tx.status === "pending"
                                ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                                : "bg-red-500/20 border-red-500 text-red-300"
                            }
                          >
                            {tx.status === "completed" && <Check className="h-3 w-3 mr-1" />}
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Helpful Notes */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    Credits never expire - use them whenever you want
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    No monthly subscription required
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    1 credit = 1 AI photo | 10 credits = 1 AI video
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    Unused credits roll over forever
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <PayPalCheckoutModal isOpen={isPayPalOpen} onClose={handlePayPalClose} />
    </AppLayout>
  );
};

export default Billing;
