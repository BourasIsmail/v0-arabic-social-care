"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Home, LayoutDashboard, Users, FileText, Plus } from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/institutions", label: "المؤسسات", icon: <Building2 className="h-4 w-4" /> },
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="h-4 w-4" />, adminOnly: true },
  { href: "/users", label: "المستخدمين", icon: <Users className="h-4 w-4" />, adminOnly: true },
];

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showAddButton?: boolean;
  addButtonHref?: string;
  addButtonLabel?: string;
  actions?: React.ReactNode;
}

export function AppHeader({
  title = "نظام الرعاية الاجتماعية",
  subtitle,
  showAddButton = false,
  addButtonHref = "/diagnostic",
  addButtonLabel = "إضافة مؤسسة",
  actions,
}: AppHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {actions}
            {showAddButton && (
              <Link href={addButtonHref}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{addButtonLabel}</span>
                </Button>
              </Link>
            )}
            <UserMenu />
          </div>
        </div>

        {/* Navigation Row */}
        <nav className="flex items-center gap-1 pb-2 overflow-x-auto">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
        </nav>
      </div>
    </header>
  );
}
