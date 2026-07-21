'use client'

import { Calendar, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  SignOutButton,
  SignInButton
} from "@/components/ui/sidebar";
import { NavLinkDashboard } from "./ui/nav-link-dashboard";
import { authClient } from "@/lib/auth/auth-client";

export function AppSidebarDashboard() {

  const {data: session } = authClient.useSession()
  const user = session?.user.name

  return (
    <Sidebar>
      <SidebarHeader className="px-5 pt-6 pb-2">
        <p className="font-third text-xl leading-none text-white">{user}</p>
      </SidebarHeader>

      <SidebarSeparator className="bg-border/60 m-0" />

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
               <SidebarMenuItem>
                <NavLinkDashboard href="/dashboard" icon={Calendar}>
                Calendrier
                </NavLinkDashboard>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLinkDashboard href="/dashboard/users" icon={User}>
                Users
                </NavLinkDashboard>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator className="mx-1 mb-2 bg-border/60" />
        {user ? <SignOutButton /> : <SignInButton /> }
      </SidebarFooter>
    </Sidebar>
  );
}