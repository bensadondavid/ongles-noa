// components/nav-link.tsx
'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function NavLinkDashboard({
  href, icon: Icon, children,
}: { href: string; icon: LucideIcon; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="h-11 gap-3 rounded-full px-4 font-primary text-[15px] tracking-wide text-foreground/80 transition-colors hover:bg-white/40 hover:text-foreground data-[active=true]:bg-white/60 data-[active=true]:font-medium data-[active=true]:text-foreground"
    >
      <Link href={href} onClick={()=>{setOpenMobile(false)}
      }>
        <Icon className="size-4.5 opacity-70" />
        <span>{children}</span>
      </Link>
    </SidebarMenuButton>
  );
}