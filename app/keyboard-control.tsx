"use client";
import { useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function KeyboardControl(props: Props) {
  const router = useRouter();
  useHotkeys([
    [
      "mod+H",
      () => {
        console.log("Captured");
        router.push("/");
      },
    ],
  ]);

  return props.children;
}
