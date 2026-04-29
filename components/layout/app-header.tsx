"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Users, Plus, Home } from "lucide-react";
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
  { href: "/", label: "الرئيسية", icon: <Home className="h-4 w-4" /> },
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
  const isAdmin = user?.role === "ADMIN" || user?.role === "VIEW_ONLY";

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Partners Logo Row - Centered */}
        <div className="flex items-center justify-center py-4 border-b border-border/30">
          <Image
            src="/images/partners-banner.png"
            alt="الشركاء المؤسساتيون"
            width={900}
            height={90}
            className="object-contain h-14 md:h-20 w-auto"
            priority
          />
        </div>

        {/* Main Header Row */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {navItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/" && pathname.startsWith(item.href));
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2 rounded-lg transition-all",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
            </nav>

            {actions}
            {showAddButton && (
              <Link href={addButtonHref}>
                <Button className="gap-2 rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{addButtonLabel}</span>
                </Button>
              </Link>
            )}
            <UserMenu />
          </div>
        </div>

        {/* Navigation - Mobile */}
        <nav className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 rounded-lg whitespace-nowrap",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground"
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
