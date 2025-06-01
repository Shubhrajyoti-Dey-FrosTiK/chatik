import { DialogDescription } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { LoginForm } from "./login-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function LoginDialog() {
  return (
    <DialogContent className="p-0">
      <VisuallyHidden>
        <DialogHeader>
          <DialogTitle>Sign in to ChaTiK!</DialogTitle>
          <DialogDescription>
            Sign in with your Google account or just sign in with email and
            password to start the blazing fast experience
          </DialogDescription>
        </DialogHeader>
      </VisuallyHidden>
      <LoginForm />
    </DialogContent>
  );
}

export default LoginDialog;
