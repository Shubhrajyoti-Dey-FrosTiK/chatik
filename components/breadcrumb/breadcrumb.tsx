import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getServerSideURL } from "@/lib/url";
import { pageName } from "./page-name";

export function getPagename(path: string) {
  return pageName[path] ?? path;
}

async function Breadcrumb() {
  const url = await getServerSideURL();
  const parts = ["", ...url.pathname.split("/").filter((p) => p != "")];
  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {parts.map((part, partIdx) => {
          const link = parts.slice(0, partIdx + 1).join("/");
          return (
            <div key={`BreadcrumbPart_${partIdx}`}>
              {partIdx > 0 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
              <BreadcrumbItem className="hidden md:block">
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
