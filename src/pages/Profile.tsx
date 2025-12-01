import { useState } from "react";
import { useUser, UserProfile } from "@clerk/clerk-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Palette, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
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
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - User Info */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                      {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {user?.fullName || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                    <div className="w-full pt-4 border-t border-gray-700 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="text-white">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Clerk Account Settings */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your profile, email, and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden">
                    <UserProfile 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-gray-800 border-gray-700 shadow-none",
                          navbar: "hidden",
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                        <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
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
                        <Label htmlFor="dark-mode" className="text-base font-medium cursor-pointer">
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
                        <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
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
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Profile;
