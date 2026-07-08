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
import { NavLink } from "@/components/ui/nav-link";
import { authClient } from "@/lib/auth/auth-client";

export function AppSidebar() {

  const {data: session } = authClient.useSession()
  const user = session?.user.name

  return (
    <Sidebar>
      <SidebarHeader className="px-5 pt-6 pb-2">
        <p className="font-third text-xl leading-none text-white">{user}</p>
      </SidebarHeader>

      <SidebarSeparator className="mx-4 bg-border/60" />

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <NavLink href="/profile" icon={User}>
                  Mes infos perso
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink href="/appointments" icon={Calendar}>
                  Mes RDV
                </NavLink>
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