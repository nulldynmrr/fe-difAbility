// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   LayoutDashboard,
//   Search,
//   FileText,
//   Bell,
//   MessageSquare,
//   Briefcase,
//   Users,
//   Building2,
// } from "lucide-react";

// import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
//   SidebarProvider,
// } from "@/components/ui/sidebar";

// import request, { getCurrentUser } from "@/utils/request";

// export const sidebarData = {
//   pencariKerja: {
//     user: {
//       name: "shadcn",
//       email: "m@example.com",
//       avatar: "/avatars/shadcn.jpg",
//     },
//     teams: [
//       {
//         name: "Pencari Kerja",
//         logo: "/assets/logo-humic-pesergi.png",
//         plan: "User",
//       },
//     ],
//     navMain: [
//       {
//         title: "Platform",
//         items: [
//           {
//             title: "Dashboard",
//             url: "/pencari/dashboard",
//             icon: LayoutDashboard,
//           },
//           { title: "Cari Lowongan", url: "/pencari/lowongan", icon: Search },
//           { title: "Lamaran Saya", url: "/pencari/lamaran", icon: FileText },
//           { title: "Notifikasi", url: "/pencari/notifikasi", icon: Bell },
//         ],
//       },
//       {
//         title: "Approved Job",
//         items: [
//           { title: "Chat HRD", url: "/pencari/chat", icon: MessageSquare },
//         ],
//       },
//     ],
//   },

//   company: {
//     user: {
//       name: "shadcn",
//       email: "m@example.com",
//       avatar: "/avatars/shadcn.jpg",
//     },
//     teams: [
//       {
//         name: "Pemberi Kerja",
//         logo: "/assets/logo-humic-pesergi.png",
//         plan: "Employer",
//       },
//     ],
//     navMain: [
//       {
//         title: "Platform",
//         items: [
//           {
//             title: "Dashboard",
//             url: "/company/dashboard",
//             icon: LayoutDashboard,
//           },
//           {
//             title: "Daftar Lowongan",
//             url: "/company/job-posting",
//             icon: Briefcase,
//           },
//           {
//             title: "Daftar Pelamar",
//             url: "/company/see-applicants",
//             icon: Users,
//           },
//           {
//             title: "Profile Perusahaan",
//             url: "/company/profile",
//             icon: Building2,
//           },
//         ],
//       },
//     ],
//   },

//   employer: {
//     user: {
//       name: "shadcn",
//       email: "m@example.com",
//       avatar: "/avatars/shadcn.jpg",
//     },
//     teams: [
//       {
//         name: "Pemberi Kerja",
//         logo: "/assets/logo-humic-pesergi.png",
//         plan: "Employer",
//       },
//     ],
//     navMain: [
//       {
//         title: "Platform",
//         items: [
//           {
//             title: "Dashboard",
//             url: "/employer/dashboard",
//             icon: LayoutDashboard,
//           },
//           {
//             title: "Daftar Lowongan",
//             url: "/employer/job-posting",
//             icon: Briefcase,
//           },
//           {
//             title: "Daftar Pelamar",
//             url: "/employer/see-applicants",
//             icon: Users,
//           },
//           {
//             title: "Profile Perusahaan",
//             url: "/employer/profile",
//             icon: Building2,
//           },
//         ],
//       },
//     ],
//   },
// };

// export function SidebarPencariKerja(props) {
//   const data = sidebarData.pencariKerja;
//   const [user, setUser] = React.useState(null);

//   React.useEffect(() => {
//     const currentUser = getCurrentUser();
//     setUser(currentUser);
//   }, []);

//   console.log("Current User in SidebarPencariKerja:", user);

//   return (
//     <SidebarProvider>
//       <Sidebar
//         collapsible="icon"
//         {...props}
//         className="border-r bg-bg-card border-primary-50 dark:border-primary-100 backdrop-blur-md"
//       >
//         <SidebarHeader className="px-4 pt-4">
//           <TeamSwitcher teams={data.teams} />
//         </SidebarHeader>

//         <SidebarContent className="px-2">
//           <NavMain items={data.navMain} />
//         </SidebarContent>

//         <SidebarFooter className="px-4 pb-4">
//           <NavUser user={user || data.user} />
//         </SidebarFooter>

//         <SidebarRail className="bg-bg-card border-l border-primary-50 dark:border-primary-100" />
//       </Sidebar>
//     </SidebarProvider>
//   );
// }

// export function SidebarPemberiKerja(props) {
//   const data = sidebarData.company;
//   const [user, setUser] = React.useState(null);

//   const [company, setCompanny] = useState([]);
//   const [loading, setloading] = useState(true);

//   const fetchUser = useCallback(async () => {
//     setloading(true);
//     try {
//       const jobsRes = await request.get("/auth/me");
//       setCompanny(jobsRes.data || []);
//     } catch (error) {
//       toast.error("Gagal mengambil data perusahaan");
//     } finally {
//       setloading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   console.log("CHELLLLLLLLL", company);

//   React.useEffect(() => {
//     const currentUser = getCurrentUser();
//     setUser(currentUser);
//   }, []);

//   return (
//     <SidebarProvider>
//       <Sidebar
//         collapsible="icon"
//         {...props}
//         className="border-r bg-bg-card border-primary-50 dark:border-primary-100 backdrop-blur-md"
//       >
//         <SidebarHeader className="px-4 pt-4">
//           <TeamSwitcher teams={data.teams} />
//         </SidebarHeader>

//         <SidebarContent className="px-2">
//           <NavMain items={data.navMain} />
//         </SidebarContent>

//         <SidebarFooter className="px-4 pb-4">
//           <NavUser user={user || data.user} />
//         </SidebarFooter>

//         <SidebarRail className="bg-bg-card border-l border-primary-50 dark:border-primary-100" />
//       </Sidebar>
//     </SidebarProvider>
//   );
// }

// export function SidebarEmployer(props) {
//   const data = sidebarData.employer;
//   const [user, setUser] = React.useState(null);

//   React.useEffect(() => {
//     const currentUser = getCurrentUser();
//     setUser(currentUser);
//   }, []);

//   console.log("Current User in Sidebarcompany:", user);

//   return (
//     <SidebarProvider>
//       <Sidebar
//         collapsible="icon"
//         {...props}
//         className="border-r bg-bg-card border-primary-50 dark:border-primary-100 backdrop-blur-md"
//       >
//         <SidebarHeader className="px-4 pt-4">
//           <TeamSwitcher teams={data.teams} />
//         </SidebarHeader>

//         <SidebarContent className="px-2">
//           <NavMain items={data.navMain} />
//         </SidebarContent>

//         <SidebarFooter className="px-4 pb-4">
//           <NavUser user={user || data.user} />
//         </SidebarFooter>

//         <SidebarRail className="bg-bg-card border-l border-primary-50 dark:border-primary-100" />
//       </Sidebar>
//     </SidebarProvider>
//   );
// }

"use client";

import React from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  MessageSquare,
  Briefcase,
  Users,
  Building2,
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

import { useAuthMe } from "@/hooks/useAuthMe";

export const sidebarData = {
  pencariKerja: {
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
            url: "/job-seeker/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Cari Lowongan",
            url: "/job-seeker/dashboard",
            icon: Search,
          },
          // { title: "Lamaran Saya", url: "/pencari/lamaran", icon: FileText },
          // { title: "Notifikasi", url: "/pencari/notifikasi", icon: Bell },
        ],
      },
      {
        title: "Approved Job",
        items: [{ title: "Chat HRD", url: "/chat", icon: MessageSquare }],
      },
    ],
  },

  company: {
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
            url: "/company/dashboard",
            icon: LayoutDashboard,
          },
          // {
          //   title: "Data Karyawan",
          //   url: "/company/employer",
          //   icon: Briefcase,
          // },
          // {
          //   title: "Daftar Pelamar",
          //   url: "/company/see-applicants",
          //   icon: Users,
          // },
          {
            title: "Profile Perusahaan",
            url: "/company/profile",
            icon: Building2,
          },
        ],
      },
    ],
  },

  admin: {
    teams: [
      {
        name: "Administrator",
        logo: "/assets/logo-humic-pesergi.png",
        plan: "Admin",
      },
    ],
    navMain: [
      {
        title: "Admin Panel",
        items: [
          {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Akun",
            url: "/admin/account",
            icon: Users,
          },
        ],
      },
    ],
  },

  employer: {
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
            url: "/employer/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Daftar Lowongan",
            url: "/employer/job-posting",
            icon: Briefcase,
          },
          // {
          //   title: "Daftar Pelamar",
          //   url: "/employer/see-applicants",
          //   icon: Users,
          // },
          {
            title: "Profile Perusahaan",
            url: "/employer/profile",
            icon: Building2,
          },
        ],
      },
    ],
  },
};
export function SidebarPencariKerja(props) {
  const { user, loading } = useAuthMe();
  const data = sidebarData.pencariKerja;

  return (
    <SidebarProvider>
      <Sidebar {...props} collapsible="icon" className="border-r bg-bg-card">
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          {!loading && <NavUser user={user} />}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
export function SidebarPemberiKerja(props) {
  const { user, loading } = useAuthMe();
  const data = sidebarData.company;

  return (
    <SidebarProvider>
      <Sidebar {...props} collapsible="icon" className="border-r bg-bg-card">
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          {!loading && <NavUser user={user} />}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
export function SidebarEmployer(props) {
  const { user, loading } = useAuthMe();
  const data = sidebarData.employer;

  return (
    <SidebarProvider>
      <Sidebar {...props} collapsible="icon" className="border-r bg-bg-card">
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          {!loading && <NavUser user={user} />}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}

export function SidebarAdmin(props) {
  const { user, loading } = useAuthMe();
  const data = sidebarData.admin;

  return (
    <SidebarProvider>
      <Sidebar {...props} collapsible="icon" className="border-r bg-bg-card">
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          {!loading && <NavUser user={user} />}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
