"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Brain,
  ChartBar,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  MessageCircle,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  FileText,
  Mic,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { User } from "next-auth";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarUserNav } from "./sidebar-user-nav";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Create New Bot",
      url: "/create-new-bot",
      icon: Bot,
    },
    {
      title: "Personalization",
      url: "/personalization",
      icon: Brain,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartBar,
    },
    {
      title: "Created Bots",
      url: "/created-bots",
      icon: Bot,
    },
    {
      title: "Playground",
      url: "/playground",
      icon: SquareTerminal,
    },
    {
      title: "Models",
      url: "/models",
      icon: Bot,
    },
    {
      title: "Bot Documents",
      url: "/bot-documents",
      icon: FileText,
    },
    {
      title: "Bot Templates",
      url: "/bot-templates",
      icon: Bot,
    },
    {
      title: "Live Audio Chat",
      url: `/live-audio-chat`,
      icon: Mic,
    },

    {
      title: "Chat Record",
      url: "/chat-record",
      icon: MessageCircle,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export function DashboardSidebar({ user }: { user: User }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "cursor-pointer",
                    isActive(item.url) && "bg-sidebar-accent"
                  )}
                  onClick={() => router.push(item.url)}
                >
                  {item.icon && <item.icon className="" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
