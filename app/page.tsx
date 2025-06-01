"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Spinner from "@/components/spinner/spinner";
import Markdown from "@/components/markdown/Markdown";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
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
    <main className="flex flex-col items-center justify-between">
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      <Button onClick={handleSignIn}>Sign In </Button>
      <Markdown
        markdown={
          "```js\nvar foo = function (bar) {\nreturn bar++;\n};\n\nconsole.log(foo(5));\n```"
        }
      />
    </main>
  );
}
