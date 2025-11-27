import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/clerk-react";
import { User, Mail } from "lucide-react";

const Profile = () => {
  const { user, isLoaded } = useUser();

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0a0118] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          {!isLoaded ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Your account details managed by Clerk
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.primaryEmailAddress?.emailAddress || ""}
                      disabled
                      className="bg-gray-800/50"
                    />
                  </div>
                  
                  {user?.fullName && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={user.fullName}
                        disabled
                        className="bg-gray-800/50"
                      />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    To update your account details, use the user menu in the top right corner.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
