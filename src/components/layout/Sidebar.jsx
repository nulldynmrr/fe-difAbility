"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  MessageSquare,
  Briefcase,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";

export const sidebarData = {
  pencariKerja: {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Pencari Kerja",
        logo: "/assets/logo-humic-pesergi.png",
        plan: "User",
      },
    ],
    navMain: [
      {
        title: "Platform",
        items: [
          {
            title: "Dashboard",
            url: "/pencari/dashboard",
            icon: LayoutDashboard,
          },
          { title: "Cari Lowongan", url: "/pencari/lowongan", icon: Search },
          { title: "Lamaran Saya", url: "/pencari/lamaran", icon: FileText },
          { title: "Notifikasi", url: "/pencari/notifikasi", icon: Bell },
        ],
      },
      {
        title: "Approved Job",
        items: [
          { title: "Chat HRD", url: "/pencari/chat", icon: MessageSquare },
        ],
      },
    ],
  },

  pemberiKerja: {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Pemberi Kerja",
        logo: "/assets/logo-humic-pesergi.png",
        plan: "Employer",
      },
    ],
    navMain: [
      {
        title: "Platform",
        items: [
          {
            title: "Dashboard",
            url: "/pemberi/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Posting Lowongan Baru",
            url: "/pemberi/posting",
            icon: Briefcase,
          },
          {
            title: "Daftar Kandidat Saya",
            url: "/pemberi/kandidat",
            icon: Users,
          },
          { title: "Notifikasi", url: "/pemberi/notifikasi", icon: Bell },
        ],
      },
    ],
  },
};

export function SidebarPencariKerja(props) {
  const data = sidebarData.pencariKerja;

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        {...props}
        className="border-r bg-bg-card border-primary-50 dark:border-primary-100 backdrop-blur-md"
      >
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail className="bg-bg-card border-l border-primary-50 dark:border-primary-100" />
      </Sidebar>
    </SidebarProvider>
  );
}

export function SidebarPemberiKerja(props) {
  const data = sidebarData.pemberiKerja;

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        {...props}
        className="border-r bg-bg-card border-primary-50 dark:border-primary-100 backdrop-blur-md"
      >
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail className="bg-bg-card border-l border-primary-50 dark:border-primary-100" />
      </Sidebar>
    </SidebarProvider>
  );
}
