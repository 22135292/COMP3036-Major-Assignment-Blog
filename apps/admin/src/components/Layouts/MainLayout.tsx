import { AppSidebar } from "@/components/Layouts/AppSideBar";
import { TopMenu } from "@/components/Layouts/TopMenu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { isLoggedIn } from "@/utils/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function MainLayout({
  children,
  query,
  tag,
  date,
  active,
}: PropsWithChildren<{ query?: string; tag?: string; date?: string; active?: string }>) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-[#f5f6f8]">
        <TopMenu query={query} tag={tag} date={date} active={active} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
