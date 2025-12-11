import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Palette, AlertTriangle, Zap, ArrowRight, Mail, Link2, Calendar, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { credits, isLoading: creditsLoading } = useCredits();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [totalPurchased, setTotalPurchased] = useState(0);

  // Fetch total credits purchased
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("total_credits_purchased")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setTotalPurchased(data.total_credits_purchased);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "Account deletion is not available in this demo. Contact support for assistance.",
      variant: "destructive",
    });
  };

  const handleNotificationToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    toast({
      title: "Preferences updated",
      description: checked ? "Email notifications enabled" : "Email notifications disabled",
    });
  };

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleEditProfile = () => {
    // Open Clerk's user profile modal
    if (user) {
      window.open("https://accounts.clerk.dev/user", "_blank");
    }
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
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress;
  const connectedAccounts = user?.externalAccounts || [];
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "N/A";

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 md:p-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          {/* Credit Overview Card */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/50 mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Credit Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Current Balance</p>
                  <p className="text-3xl font-bold text-foreground">{currentCredits} credits</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Lifetime Purchased</p>
                  <p className="text-2xl font-semibold text-foreground">{totalPurchased} credits</p>
                </div>
                <Button
                  onClick={() => navigate("/billing")}
                  variant="outline"
                  className="border-purple-500/50 hover:bg-purple-500/20 text-foreground"
                >
                  View Billing <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your profile, email, and connected accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Section */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Profile</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-primary-foreground text-xl font-bold">
                        {user?.firstName?.charAt(0) || primaryEmail?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-foreground font-semibold text-lg">
                          {user?.fullName || "User"}
                        </p>
                        <p className="text-muted-foreground text-sm">{primaryEmail}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfile}
                      className="border-gray-600 hover:bg-gray-700 text-foreground"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Email Addresses Section */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Email Addresses</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-foreground">{primaryEmail}</p>
                        <p className="text-xs text-green-400">Primary</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditProfile}
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    >
                      + Add email
                    </Button>
                  </div>
                </div>
              </div>

              {/* Connected Accounts Section */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Connected Accounts</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  {connectedAccounts.length > 0 ? (
                    <div className="space-y-3">
                      {connectedAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Link2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-foreground capitalize">{account.provider}</p>
                              <p className="text-xs text-muted-foreground">{account.emailAddress}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            Disconnect
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">No connected accounts</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditProfile}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      >
                        + Connect account
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Member Since</p>
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <p>{memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Palette className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer text-foreground">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your projects
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="dark-mode" className="text-base font-medium cursor-pointer text-foreground">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-gradient-to-br from-red-900/20 to-gray-800 border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-foreground">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Profile;
