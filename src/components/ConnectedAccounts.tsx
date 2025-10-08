import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FcGoogle } from 'react-icons/fc';
import { Mail, Unlink as UnlinkIcon } from 'lucide-react';
import { getLinkedAccounts, unlinkAuthMethod } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConnectedAccounts() {
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinkingMethod, setUnlinkingMethod] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLinkedAccounts();
  }, []);

  const loadLinkedAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await getLinkedAccounts();
      setLinkedAccounts(accounts);
    } catch (error) {
      console.error('Error loading linked accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (method: string) => {
    if (linkedAccounts.length <= 1) {
      toast({
        title: "Cannot unlink",
        description: "You must keep at least one sign-in method.",
        variant: "destructive"
      });
      return;
    }

    setUnlinkingMethod(method);
  };

  const confirmUnlink = async () => {
    if (!unlinkingMethod) return;

    try {
      const providerId = unlinkingMethod === 'google' ? 'google.com' : 'password';
      await unlinkAuthMethod(providerId);
      
      toast({
        title: "Account unlinked",
        description: `${unlinkingMethod === 'google' ? 'Google' : 'Email/Password'} sign-in has been removed.`,
      });
      
      await loadLinkedAccounts();
    } catch (error) {
      console.error('Unlink error:', error);
      toast({
        title: "Unlink failed",
        description: "Failed to unlink account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUnlinkingMethod(null);
    }
  };

  const getMethodDisplay = (method: string) => {
    if (method === 'google') {
      return {
        icon: <FcGoogle className="h-5 w-5" />,
        name: 'Google',
        description: 'Sign in with your Google account'
      };
    } else if (method === 'password') {
      return {
        icon: <Mail className="h-5 w-5 text-dicey-azure" />,
        name: 'Email/Password',
        description: 'Sign in with email and password'
      };
    }
    return { icon: null, name: method, description: '' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your sign-in methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {linkedAccounts.map((method) => {
            const display = getMethodDisplay(method);
            return (
              <div
                key={method}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  {display.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{display.name}</p>
                      <Badge variant="outline" className="text-xs bg-dicey-azure/10 text-dicey-azure border-dicey-azure/20">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{display.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnlink(method)}
                  disabled={linkedAccounts.length <= 1}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <UnlinkIcon className="h-4 w-4 mr-1" />
                  Unlink
                </Button>
              </div>
            );
          })}
          
          {linkedAccounts.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No connected accounts found</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!unlinkingMethod} onOpenChange={(open) => !open && setUnlinkingMethod(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {unlinkingMethod === 'google' ? 'Google' : 'Email/Password'} sign-in? 
              You'll no longer be able to sign in using this method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnlink}
              className="bg-red-600 hover:bg-red-700"
            >
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
