"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, User, Mail, Shield, MapPin, Lock, Save, ArrowRight } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth-context";
import { useAuthMutate } from "@/lib/use-auth-swr";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const authMutate = useAuthMutate();
  
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast.error("الرجاء إدخال الاسم الكامل");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await authMutate(buildApiUrl(API_ENDPOINTS.profile.update), {
        method: "PUT",
        body: JSON.stringify({ fullName }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "فشل تحديث الملف الشخصي");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء التحديث");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast.error("الرجاء إدخال كلمة المرور الحالية");
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await authMutate(buildApiUrl(API_ENDPOINTS.profile.update), {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "فشل تحديث كلمة المرور");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("تم تحديث كلمة المرور بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء التحديث");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "مدير النظام",
    USER: "مستخدم",
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">نظام الرعاية الاجتماعية</h1>
                  <p className="text-sm text-muted-foreground">الملف الشخصي</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link href="/institutions">
                  <Button variant="outline" className="gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span className="hidden sm:inline">العودة للمؤسسات</span>
                  </Button>
                </Link>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {/* User Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                معلومات الحساب
              </CardTitle>
              <CardDescription>معلومات حسابك الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">الصلاحية</p>
                  <p className="font-medium">{roleLabels[user?.role || ""] || user?.role}</p>
                </div>
              </div>

              {user?.regionName && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الجهة / الإقليم</p>
                    <p className="font-medium">
                      {user.regionName}
                      {user.prefectureName && ` - ${user.prefectureName}`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Update Profile Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>تعديل الملف الشخصي</CardTitle>
              <CardDescription>قم بتحديث اسمك الكامل</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <Button type="submit" disabled={isUpdatingProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isUpdatingProfile ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Update Password Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription>قم بتحديث كلمة مرور حسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الحالية"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                  />
                </div>
                
                <Button type="submit" disabled={isUpdatingPassword} className="gap-2">
                  <Lock className="h-4 w-4" />
                  {isUpdatingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
