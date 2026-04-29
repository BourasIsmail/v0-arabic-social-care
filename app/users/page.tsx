"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useAuthFetcher, useAuthMutate } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CascadeGeoSelect } from "@/components/form/cascade-geo-select";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  ArrowRight,
  Shield,
  User as UserIcon,
} from "lucide-react";
import type { User } from "@/lib/auth-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://enfance.entraide.ma/api";

interface UserWithDetails extends User {
  regionName?: string;
  prefectureName?: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const fetcher = useAuthFetcher();
  const authMutate = useAuthMutate();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN" | "VIEW_ONLY";
    regionId: number | "";
    prefectureId: number | "";
  }>({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
    regionId: "",
    prefectureId: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher(`${API_BASE_URL}/api/v1/users`);
      setUsers(data);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل المستخدمين");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      regionId: "",
      prefectureId: "",
    });
    setEditingUser(null);
  };

  const openEditDialog = (user: UserWithDetails) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      regionId: user.regionId || "",
      prefectureId: user.prefectureId || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Update existing user
        const updateData: Record<string, unknown> = {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          regionId: formData.regionId || null,
          prefectureId: formData.prefectureId || null,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await authMutate(`${API_BASE_URL}/api/v1/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(updateData),
        });
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        toast.success("تم تحديث المستخدم بنجاح");
      } else {
        // Create new user
        const response = await authMutate(`${API_BASE_URL}/api/v1/users`, {
          method: "POST",
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            regionId: formData.regionId || null,
            prefectureId: formData.prefectureId || null,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        toast.success("تم إنشاء المستخدم بنجاح");
      }

      setIsDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(
        editingUser
          ? "حدث خطأ أثناء تحديث المستخدم"
          : "حدث خطأ أثناء إنشاء المستخدم"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await authMutate(`${API_BASE_URL}/api/v1/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      toast.success("تم حذف المستخدم بنجاح");
      loadUsers();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المستخدم");
    }
  };

  // VIEW_ONLY users can see user list but cannot add/edit/delete
  const canModify = currentUser?.role === "ADMIN";

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-primary">
                <Building2 className="h-6 w-6" />
                <span className="font-bold text-lg hidden sm:inline">
                  نظام الرعاية الاجتماعية
                </span>
              </Link>
            </div>
            <UserMenu />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Back button and title */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  الرئيسية
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  إدارة المستخدمين
                </h1>
                <p className="text-muted-foreground">
                  {canModify ? "إضافة وتعديل وحذف المستخدمين" : "عرض المستخدمين"}
                </p>
              </div>
            </div>

            {canModify && <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة مستخدم
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "قم بتعديل بيانات المستخدم"
                      : "أدخل بيانات المستخدم الجديد"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      كلمة المرور {editingUser ? "(اتركها فارغة للإبقاء)" : "*"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">الدور *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "USER" | "ADMIN" | "VIEW_ONLY") =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">مستخدم</SelectItem>
                        <SelectItem value="ADMIN">مدير</SelectItem>
                        <SelectItem value="VIEW_ONLY">للقراءة فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.role === "USER" && (
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        حدد الجهة والإقليم للمستخدم (إلزامي للمستخدم العادي)
                      </p>
                      <CascadeGeoSelect
                        regionId={formData.regionId}
                        prefectureId={formData.prefectureId}
                        communeId=""
                        onRegionChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            regionId: value,
                            prefectureId: "",
                          }));
                        }}
                        onPrefectureChange={(value) =>
                          setFormData((prev) => ({ ...prev, prefectureId: value }))
                        }
                        onCommuneChange={() => {}}
                        hideCommune
                      />
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : editingUser ? (
                        "تحديث"
                      ) : (
                        "إضافة"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>}
          </div>

          {/* Users table */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة المستخدمين</CardTitle>
              <CardDescription>
                جميع المستخدمين المسجلين في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  لا يوجد مستخدمين
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">
                          البريد الإلكتروني
                        </TableHead>
                        <TableHead className="text-right">الدور</TableHead>
                        <TableHead className="text-right">الجهة</TableHead>
                        <TableHead className="text-right">الإقليم</TableHead>
                        <TableHead className="text-right w-[100px]">
                          الإجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.fullName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "ADMIN" ? "default" : user.role === "VIEW_ONLY" ? "outline" : "secondary"
                              }
                              className="gap-1"
                            >
                              {user.role === "ADMIN" ? (
                                <Shield className="h-3 w-3" />
                              ) : (
                                <UserIcon className="h-3 w-3" />
                              )}
                              {user.role === "ADMIN" ? "مدير" : user.role === "VIEW_ONLY" ? "للقراءة فقط" : "مستخدم"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.regionName || user.regionId || "-"}
                          </TableCell>
                          <TableCell>
                            {user.prefectureName || user.prefectureId || "-"}
                          </TableCell>
                          <TableCell>
                            {canModify ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>

                                {user.id !== currentUser?.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          تأكيد الحذف
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          هل أنت متأكد من حذف المستخدم &quot;
                                          {user.fullName}&quot;؟ لا يمكن التراجع
                                          عن هذا الإجراء.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(user.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          حذف
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
