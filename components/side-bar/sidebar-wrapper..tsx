"use client";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useElementSize } from "@mantine/hooks";
import { Session, User } from "better-auth";
import { ReactNode } from "react";
import Breadcrumb from "../breadcrumb/breadcrumb";
import { AppSidebar } from "./app-sidebar";

interface Props {
  children: ReactNode;
  session: Session;
  user: User;
}

function SidebarWrapper(props: Props) {
  const topnav = useElementSize();

  return (
    <SidebarProvider className="relative">
      <AppSidebar {...props} />
      <SidebarInset
        style={{
          paddingTop: `${topnav.height}px`,
        }}
      >
        <div
          ref={topnav.ref}
          className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 absolute top-0 left-0 px-5 w-full dark:bg-black bg-white`}
        >
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb />
        </div>
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SidebarWrapper;
