"use client";

import {
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Create New Post",
    url: "/posts/create",
    icon: PlusCircle,
  },
];

export function AppSidebar() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      // Clear the original password/JWT cookie.
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include",
      });

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  }

  return (
    <Sidebar className="border-r-0 bg-[#111827] text-white">
      <SidebarContent className="bg-[#111827] px-3">
        <SidebarGroup className="py-5">
          <SidebarGroupLabel className="mb-8 flex h-fit items-center gap-3 px-3 text-left text-white">
            <Image
              priority
              src="/wsulogo.png"
              alt="Logo"
              width={40}
              height={40}
              className="size-10 rounded-xl bg-white p-1.5"
            />

            <Link href="/" className="leading-tight">
              <span className="block font-bold">Full Stack Blog</span>
              <span className="text-xs font-medium text-slate-400">Content Studio</span>
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-[#dc3150]">
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#111827] p-4">
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="h-11 border-white/15 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
