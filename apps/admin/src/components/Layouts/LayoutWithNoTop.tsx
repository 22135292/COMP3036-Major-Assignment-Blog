import { AppSidebar } from "@/components/Layouts/AppSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { isLoggedIn } from "@/utils/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function LayoutWithNoTop({
  children,
}: PropsWithChildren) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-[#f5f6f8]">
        <main className="min-h-screen p-5 lg:p-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
