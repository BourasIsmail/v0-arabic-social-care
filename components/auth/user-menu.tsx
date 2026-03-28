"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Users, LayoutDashboard } from "lucide-react";

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>الملف الشخصي</span>
          </DropdownMenuItem>
        </Link>
        {user.role === "ADMIN" && (
          <>
            <Link href="/admin/dashboard">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <LayoutDashboard className="h-4 w-4" />
                <span>لوحة التحكم</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/users">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Users className="h-4 w-4" />
                <span>إدارة المستخدمين</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
