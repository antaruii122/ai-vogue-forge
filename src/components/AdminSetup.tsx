import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle, UserCog } from "lucide-react";
import { createAuthenticatedClient } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";

export function AdminSetup() {
  const { userId, getToken } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleCopy = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("User ID copied to clipboard");
    }
  };

  const handleMakeAdmin = async () => {
    if (!userId) {
      toast.error("No user ID found");
      return;
    }

    setIsAdding(true);
    try {
      // Get Clerk token for authenticated request
      const clerkToken = await getToken({ template: 'supabase' });
      const supabase = createAuthenticatedClient(clerkToken);
      
      // Call the create_first_admin function
      const { error } = await supabase.rpc('create_first_admin', {
        _user_id: userId
      });

      if (error) {
        if (error.message.includes('already exist')) {
          toast.error("Admin users already exist. Contact an existing admin.");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully added as admin! Refresh the page to see admin features.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add admin role");
    } finally {
      setIsAdding(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <Card className="border-orange-500/50 bg-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-orange-500" />
          Admin Setup
        </CardTitle>
        <CardDescription>
          First time here? Make yourself an admin to access the admin panel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Your Clerk User ID:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted px-3 py-2 rounded text-xs break-all">
              {userId}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
          onClick={handleMakeAdmin}
          disabled={isAdding}
          className="w-full"
        >
          {isAdding ? "Adding..." : "Make Me Admin"}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will insert your user ID into the user_roles table with admin privileges.
        </p>
      </CardContent>
    </Card>
  );
}
