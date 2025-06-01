"use client";

import LandingPage from "@/components/landing-page/landing-page";
import Markdown from "@/components/markdown/Markdown";
import Spinner from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();

  const handleSignIn = async () => {
    const response = await authClient.signIn.email({
      email: "tosumandey77@gmail.com",
      password: "12345678",
    });

    if (response.error) {
      const response = await authClient.signUp.email({
        name: "Suman Dey",
        email: "tosumandey77@gmail.com",
        password: "12345678",
      });

      if (response.error) {
        toast(response.error.message);
        return;
      }
    }

    toast("Signed in successfully");
    router.refresh();
    console.log(response);
  };

  return (
    <main className="flex flex-col items-center justify-between h-full">
      {isPending ? (
        <div className="h-full flex items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full">
          {session ? (
            <div>
              {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
              <Button onClick={handleSignIn}>Sign In </Button>
              <Markdown
                markdown={
                  "```js\nvar foo = function (bar) {\nreturn bar++;\n};\n\nconsole.log(foo(5));\n```"
                }
              />
            </div>
          ) : (
            <LandingPage />
          )}
        </div>
      )}
    </main>
  );
}
