"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Plus, Search, Filter, Eye, Pencil, Trash2, Download } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR, useAuthMutate } from "@/lib/use-auth-swr";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
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
import { cn } from "@/lib/utils";
import type { InstitutionSummary, PageResponse } from "@/lib/types";
import { toast } from "sonner";

export default function InstitutionsPage() {
  const [search, setSearch] = useState("");
  const [institutionType, setInstitutionType] = useState<string>("all");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const authFetch = useAuthMutate();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Check if user is USER role (not ADMIN) - they can only see their prefecture's institutions
  const isUserRole = user?.role === "USER";
  const userPrefectureId = user?.prefectureId;
  
  // For USER role, wait until user data is loaded before fetching
  // This prevents fetching all data before we know the user's prefecture
  const isUserDataReady = !isAuthLoading && user !== null;
  
  // Fetch communes for user's prefecture FIRST (for USER role filtering)
  // Since backend doesn't return prefectureId in institution data, we filter by communeId
  const { data: prefectureCommunes, isLoading: isCommunesLoading } = useAuthSWR<Array<{ id: number; name: string }>>(
    isUserRole && userPrefectureId ? buildApiUrl(API_ENDPOINTS.geo.communesByPrefecture(userPrefectureId)) : null
  );
  
  const prefectureCommuneIds = prefectureCommunes?.map(c => c.id) || [];
  
  // For USER role, wait for communes to be loaded before fetching institutions
  const shouldFetch = isUserRole 
    ? (isUserDataReady && !!userPrefectureId && !isCommunesLoading && prefectureCommuneIds.length > 0) 
    : isUserDataReady;

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

  // Only fetch when user data is ready (prevents race condition for USER role)
  // For USER role, we fetch all and filter client-side since backend doesn't support prefectureId filter
  const { data: rawData, error, isLoading: isDataLoading, mutate } = useAuthSWR<PageResponse<InstitutionSummary>>(
    shouldFetch ? `${buildApiUrl(API_ENDPOINTS.institutions.list)}?${queryParams.toString()}` : null
  );
  
  // Fetch statistics from API for ADMIN (total counts, not paginated)
  const { data: statsData } = useAuthSWR<{
    totalInstitutions: number;
    darTalibCount: number;
    darTalibaCount: number;
    mixedCount: number;
  }>(
    shouldFetch && !isUserRole ? buildApiUrl(API_ENDPOINTS.statistics.dashboard) : null
  );

  // Fetch ALL institutions for USER role to calculate stats and display (no pagination)
  const { data: allUserInstitutions } = useAuthSWR<{ content: InstitutionSummary[] }>(
    shouldFetch && isUserRole ? buildApiUrl(`${API_ENDPOINTS.institutions.list}?size=1000`) : null
  );

  // Combined loading state (auth loading OR data loading OR communes loading for USER)
  const isLoading = isAuthLoading || isDataLoading || (isUserRole && isCommunesLoading);
  
  // Client-side filtering for USER role by communeId and institutionType
  // Filter institutions whose communeId is in the user's prefecture communes list
  const filteredUserContent = allUserInstitutions?.content?.filter((inst) => {
    // Filter by prefecture communes
    const matchesCommune = prefectureCommuneIds.includes(inst.communeId as number);
    // Filter by institution type if selected
    const matchesType = !institutionType || institutionType === "all" || inst.institutionType === institutionType;
    // Filter by search term if provided
    const matchesSearch = !search || 
      inst.institutionName?.toLowerCase().includes(search.toLowerCase()) ||
      inst.associationName?.toLowerCase().includes(search.toLowerCase());
    return matchesCommune && matchesType && matchesSearch;
  }) || [];
  
  // For USER role, use filtered data from allUserInstitutions; for ADMIN, use rawData
  const data = isUserRole && allUserInstitutions
    ? {
        content: filteredUserContent.slice(page * pageSize, (page + 1) * pageSize),
        totalElements: filteredUserContent.length,
        totalPages: Math.ceil(filteredUserContent.length / pageSize),
        number: page,
        first: page === 0,
        last: (page + 1) * pageSize >= filteredUserContent.length,
      }
    : rawData;

  // Calculate stats: For ADMIN use API stats, for USER calculate from prefecture data (not filtered by type)
  // Stats should always show total counts for the user's prefecture, not affected by type filter
  const prefectureInstitutions = allUserInstitutions?.content?.filter(
    (inst) => prefectureCommuneIds.includes(inst.communeId as number)
  ) || [];
  
  const stats = isUserRole
    ? {
        total: prefectureInstitutions.length,
        DAR_TALIB: prefectureInstitutions.filter((i) => i.institutionType === "DAR_TALIB").length,
        DAR_TALIBA: prefectureInstitutions.filter((i) => i.institutionType === "DAR_TALIBA").length,
        DAR_TALIB_TALIBA: prefectureInstitutions.filter((i) => i.institutionType === "DAR_TALIB_TALIBA").length,
      }
    : statsData
    ? {
        total: statsData.totalInstitutions,
        DAR_TALIB: statsData.darTalibCount,
        DAR_TALIBA: statsData.darTalibaCount,
        DAR_TALIB_TALIBA: statsData.mixedCount,
      }
    : null;

  const handleDelete = async (id: number) => {
    try {
      const response = await authFetch(buildApiUrl(API_ENDPOINTS.institutions.delete(id)), {
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
      const response = await authFetch(buildApiUrl(API_ENDPOINTS.institutions.exportCsv));
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
          <Card className="card-hover relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary to-primary/50" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المؤسسات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats?.total ?? "-"}</p>
            </CardContent>
          </Card>
          <Card className="card-hover relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">دور الطالب</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats?.DAR_TALIB ?? "-"}</p>
            </CardContent>
          </Card>
          <Card className="card-hover relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">دور الطالبة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{stats?.DAR_TALIBA ?? "-"}</p>
            </CardContent>
          </Card>
          <Card className="card-hover relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary to-accent" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">دار الطالب والطالبة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.DAR_TALIB_TALIBA ?? "-"}</p>
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
                  placeholder="البحث عن مؤسسة..."
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
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[20%] text-right">اسم المؤسسة</TableHead>
                        <TableHead className="w-[18%] text-right">الجمعية</TableHead>
                        <TableHead className="w-[12%] text-right">النوع</TableHead>
                        <TableHead className="w-[15%] text-right">الجهة</TableHead>
                        <TableHead className="w-[10%] text-center">الطاقة</TableHead>
                        <TableHead className="w-[12%] text-center">تاريخ الإنشاء</TableHead>
                        <TableHead className="w-[13%] text-left"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.content.map((institution) => (
                        <TableRow key={institution.id}>
                          <TableCell className="font-medium text-right">
                            {institution.institutionName}
                          </TableCell>
                          <TableCell className="text-right">{institution.associationName}</TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                              institution.institutionType === "DAR_TALIB" && "bg-primary/10 text-primary",
                              institution.institutionType === "DAR_TALIBA" && "bg-accent/10 text-accent",
                              institution.institutionType === "DAR_TALIB_TALIBA" && "bg-secondary text-secondary-foreground"
                            )}>
                              {institutionTypeLabels[institution.institutionType]}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{institution.regionName || "-"}</TableCell>
                          <TableCell className="text-center">{institution.totalCapacity || "-"}</TableCell>
                          <TableCell className="text-center">
                            {new Date(institution.createdAt).toLocaleDateString("ar-MA")}
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="flex items-center justify-end gap-1">
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
                      صفحة {data.number + 1} من {data.totalPages}
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
