import { headers } from "next/headers";

export async function getServerSideURL(): Promise<URL> {
  const headersList = await headers();
  return new URL(headersList.get("referer") ?? "");
}
