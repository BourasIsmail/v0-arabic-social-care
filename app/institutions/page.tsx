"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Plus, Search, Filter, Eye, Pencil, Trash2, Download } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR, useAuthMutate } from "@/lib/use-auth-swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  InstitutionType,
  institutionTypeLabels,
} from "@/lib/types";
import type { InstitutionSummary, PageResponse } from "@/lib/types";
import { toast } from "sonner";

export default function InstitutionsPage() {
  const [search, setSearch] = useState("");
  const [institutionType, setInstitutionType] = useState<string>("all");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const authFetch = useAuthMutate();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Check if user is USER role (not ADMIN) - they can only see their region's institutions
  // Note: InstitutionSummary only has regionId, not prefectureId, so we filter by region
  const isUserRole = user?.role === "USER";
  const userRegionId = user?.regionId;
  
  // For USER role, wait until user data is loaded before fetching
  // This prevents fetching all data before we know the user's region
  const isUserDataReady = !isAuthLoading && user !== null;
  const shouldFetch = isUserRole ? (isUserDataReady && !!userRegionId) : isUserDataReady;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: pageSize.toString(),
  });

  if (search) {
    queryParams.set("search", search);
  }
  if (institutionType && institutionType !== "all") {
    queryParams.set("institutionType", institutionType);
  }
  // Filter by region for USER role
  if (isUserRole && userRegionId) {
    queryParams.set("regionId", userRegionId.toString());
  }

  // Only fetch when user data is ready (prevents race condition for USER role)
  const { data: rawData, error, isLoading: isDataLoading, mutate } = useAuthSWR<PageResponse<InstitutionSummary>>(
    shouldFetch ? `/api/institutions?${queryParams.toString()}` : null
  );
  
  // Combined loading state (auth loading OR data loading)
  const isLoading = isAuthLoading || isDataLoading;
  
  // Client-side filtering for USER role (in case backend doesn't support regionId filter)
  // Use String() for comparison to handle string/number type mismatch
  const data = rawData && isUserRole && userRegionId
    ? {
        ...rawData,
        content: rawData.content.filter(
          (inst) => String(inst.regionId) === String(userRegionId)
        ),
        totalElements: rawData.content.filter(
          (inst) => String(inst.regionId) === String(userRegionId)
        ).length,
      }
    : rawData;

  // Calculate stats from filtered data (client-side)
  const stats = data?.content
    ? {
        total: data.content.length,
        DAR_TALIB: data.content.filter((i) => i.institutionType === "DAR_TALIB").length,
        DAR_TALIBA: data.content.filter((i) => i.institutionType === "DAR_TALIBA").length,
        MIXED: data.content.filter((i) => i.institutionType === "MIXED").length,
      }
    : null;

  const handleDelete = async (id: number) => {
    try {
      const response = await authFetch(`/api/institutions/${id}`, {
        method: "DELETE",
      });

      // 204 No Content or 200 OK are both success
      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete");
      }

      toast.success("تم حذف المؤسسة بنجاح");
      mutate();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleExport = async () => {
    try {
      const response = await authFetch("/api/institutions/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "institutions.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("تم تصدير البيانات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
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
                  <p className="text-sm text-muted-foreground">قائمة المؤسسات</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">تصدير CSV</span>
                </Button>
                <Link href="/diagnostic">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">مؤسسة جديدة</span>
                  </Button>
                </Link>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">إجمالي المؤسسات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.total ?? data?.totalElements ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">دور الطالب</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats?.DAR_TALIB ?? "-"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">دور الطالبة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{stats?.DAR_TALIBA ?? "-"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">مختلطة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.MIXED ?? "-"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث ع�� مؤسسة..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="pr-10"
                />
              </div>
              <Select
                value={institutionType}
                onValueChange={(value) => {
                  setInstitutionType(value);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="نوع المؤسسة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {Object.entries(institutionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                حدث خطأ أثناء تحميل البيانات
              </div>
            ) : data?.content && data.content.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المؤسسة</TableHead>
                        <TableHead>الجمعية</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الجهة</TableHead>
                        <TableHead>الطاقة</TableHead>
                        <TableHead>تاريخ الإنشاء</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.content.map((institution) => (
                        <TableRow key={institution.id}>
                          <TableCell className="font-medium">
                            {institution.institutionName}
                          </TableCell>
                          <TableCell>{institution.associationName}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                              {institutionTypeLabels[institution.institutionType]}
                            </span>
                          </TableCell>
                          <TableCell>{institution.regionName || "-"}</TableCell>
                          <TableCell>{institution.totalCapacity || "-"}</TableCell>
                          <TableCell>
                            {new Date(institution.createdAt).toLocaleDateString("ar-MA")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Link href={`/institutions/${institution.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/institutions/${institution.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف هذه المؤسسة؟ لا يمكن التراجع عن هذا
                                      الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(institution.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    عرض {data.content.length} من {data.totalElements} مؤسسة
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={data.first}
                    >
                      السابق
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      ص��حة {data.number + 1} من {data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={data.last}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد مؤسسات</h3>
                <p className="text-muted-foreground mb-4">
                  لم يتم العثور على أي مؤسسات مسجلة
                </p>
                <Link href="/diagnostic">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة مؤسسة جديدة
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      </div>
    </ProtectedRoute>
  );
}
