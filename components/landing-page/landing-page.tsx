"use client";
import { LucideGithub } from "lucide-react";
import { useRouter } from "next/navigation";
import { HoverEffect } from "../acceternity/card-hover-effect";
import LoginDialog from "../login/login-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { features } from "./features";

function LandingPage() {
  const router = useRouter();

  return (
    <div>
      <div className="md:mt-60 mt-10">
        <h2 className="bg-clip-text text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl lg:text-7xl font-sans relative py-2 z-20 font-bold tracking-tight">
          ChaTiK
        </h2>
        <p className="max-w-xl mx-auto text-xl md:text-5xl text-neutral-700 dark:text-neutral-400 text-center">
          The fastest AI chat platform
        </p>
      </div>

      <div className="flex justify-center items-center my-10 gap-5">
        <Dialog>
          <DialogTrigger>
            <Button size="lg" variant="default">
              Try out!
            </Button>
          </DialogTrigger>
          <LoginDialog />
        </Dialog>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => {
            router.push(
              "https://github.com/Shubhrajyoti-Dey-FrosTiK/chatik.git",
            );
          }}
        >
          <LucideGithub />
          Github
        </Button>
      </div>

      <div>
        <HoverEffect items={features} />
      </div>
    </div>
  );
}

export default LandingPage;
