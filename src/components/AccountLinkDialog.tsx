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

interface AccountLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingMethod: 'google' | 'password';
  newMethod: 'google' | 'password';
  onConfirm: () => void;
}

export function AccountLinkDialog({ 
  open, 
  onOpenChange, 
  existingMethod, 
  newMethod,
  onConfirm 
}: AccountLinkDialogProps) {
  const getMethodName = (method: 'google' | 'password') => {
    return method === 'google' ? 'Google Sign-In' : 'Email/Password';
  };

  const getMessage = () => {
    if (existingMethod === 'password' && newMethod === 'google') {
      return "This email is already registered with password login. Would you like to link your Google account to your existing account? You'll be able to sign in with either method.";
    } else {
      return "This email is already registered with Google Sign-In. Would you like to add password login to your account? You'll be able to sign in with either method.";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Link Accounts?</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {getMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-dicey-azure hover:bg-dicey-azure/90"
          >
            Link Accounts
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
