import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/Themes/ThemeContext";

import { cookies } from "next/headers";

export async function AppLayout({
  children,
  query,
  currPath,
}: PropsWithChildren<{ query?: string; currPath?: string }>) {
  const theme = (await cookies()).get("theme")?.value as "light" | "dark" | undefined;

  return (
    <ThemeProvider initialTheme={theme}>
      <SidebarProvider>
        <LeftMenu currPath={currPath} />
        <SidebarInset className="min-w-0">
          <Content>
            <TopMenu query={query} />
            {children}
          </Content>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
