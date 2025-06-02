"use client";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { pageName } from "./page-name";

export function getPagename(path: string) {
  return pageName[path] ?? path;
}

function Breadcrumb() {
  const pathname = usePathname();
  const parts = ["", ...pathname.split("/").filter((p) => p != "")];
  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {parts.map((part, partIdx) => {
          let link = parts.slice(0, partIdx + 1).join("/");
          if (link == "") link = "/";
          return (
            <div
              key={`BreadcrumbPart_${partIdx}`}
              className="flex gap-2 items-center"
            >
              {partIdx > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink href={link}>{getPagename(part)}</BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}

export default Breadcrumb;
