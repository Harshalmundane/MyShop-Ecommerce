import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-zinc-50/50">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 px-4 bg-white sticky top-0 z-10">
          <SidebarTrigger className="-ml-1 hover:bg-zinc-100" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-200" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/admin" className="text-sm font-serif text-zinc-400 hover:text-zinc-900 transition-colors">
                  Admin Dashboard
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
