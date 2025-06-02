import { cn } from "@/lib/utils";
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
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [emailPasswordLogin, setEmailPasswordLogin] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginWithEmailPassword = async () => {
    setLoading(true);
    const data = await authClient.signIn.email({
      email: emailPasswordLogin.email,
      password: emailPasswordLogin.email,
    });
    if (data.error) {
      const data = await authClient.signUp.email({
        email: emailPasswordLogin.email,
        password: emailPasswordLogin.email,
        name: emailPasswordLogin.email.split("@")[0],
      });
      if (data.error) {
        toast(data.error.message);
        setLoading(false);
        return;
      }
    }

    toast("Logged in successfully!");
    router.refresh();

    setLoading(false);
  };

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    const data = await authClient.signIn.social({
      provider: "google",
    });
    if (data.error) {
      toast(data.error.message);
    } else {
      toast("Logged in successfully!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login or Register with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginWithEmailPassword();
            }}
          >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  loading={loading}
                  onClick={handleLoginWithGoogle}
                >
                  <IconBrandGoogle size={40} className="px-2" />
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailPasswordLogin.email}
                    onChange={(e) =>
                      setEmailPasswordLogin({
                        ...emailPasswordLogin,
                        email: e.target.value,
                      })
                    }
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={emailPasswordLogin.password}
                    onChange={(e) =>
                      setEmailPasswordLogin({
                        ...emailPasswordLogin,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  disabled={
                    emailPasswordLogin.email == "" ||
                    emailPasswordLogin.password == ""
                  }
                  loading={loading}
                  type="submit"
                  className="w-full"
                >
                  Login / Register
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </Card>
    </div>
  );
}
