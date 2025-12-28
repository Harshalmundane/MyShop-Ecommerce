"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Receipt } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: Receipt,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-zinc-200 py-4">
        <div className="flex items-center gap-2 px-2 font-bold text-xl tracking-tight">
          <div className="bg-zinc-950 text-white p-1 rounded">E</div>
          <span className="group-data-[collapsible=icon]:hidden">Store Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="hover:bg-zinc-100 transition-colors"
                tooltip={item.title}
              >
                <Link href={item.url}>
                  <item.icon className="size-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-200 py-4">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-zinc-600 hover:text-red-600 hover:bg-red-50">
              <LogOut className="size-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
