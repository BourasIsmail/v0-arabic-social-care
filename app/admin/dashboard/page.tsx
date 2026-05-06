"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/layout/app-header";
import type { DashboardStats, Region, Prefecture } from "@/lib/types";
import { 
  Building2, Users, MapPin, CheckCircle, Home, Loader2, Utensils, 
  TrendingUp, Globe, Building, GraduationCap, XCircle, Banknote,
  UserCog, Briefcase, BookOpen
} from "lucide-react";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("all");

  // Redirect non-admin/non-view-only users
  useEffect(() => {
    if (!isAuthLoading && user && user.role !== "ADMIN" && user.role !== "VIEW_ONLY") {
      router.push("/institutions");
    }
  }, [user, isAuthLoading, router]);

  // Fetch dashboard stats from backend with region/prefecture filters
  const { data: stats, isLoading, error } = useAuthSWR<DashboardStats>(
    (user?.role === "ADMIN" || user?.role === "VIEW_ONLY") 
      ? buildApiUrl(API_ENDPOINTS.statistics.dashboard(selectedRegion, selectedPrefecture)) 
      : null
  );

  // Fetch regions for filter dropdown
  const { data: regions } = useAuthSWR<Region[]>(
    (user?.role === "ADMIN" || user?.role === "VIEW_ONLY") 
      ? buildApiUrl(API_ENDPOINTS.regions.list) 
      : null
  );

  // Fetch prefectures based on selected region
  const { data: prefectures } = useAuthSWR<Prefecture[]>(
    selectedRegion && selectedRegion !== "all"
      ? buildApiUrl(API_ENDPOINTS.prefectures.byRegion(Number(selectedRegion)))
      : null
  );

  // Reset prefecture when region changes
  useEffect(() => {
    setSelectedPrefecture("all");
  }, [selectedRegion]);

  if (isAuthLoading || isLoading) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN", "VIEW_ONLY"]}>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">جاري تحميل البيانات...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !stats) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN", "VIEW_ONLY"]}>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <div className="container mx-auto p-6" dir="rtl">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">خطأ في تحميل البيانات</CardTitle>
                <CardDescription>حدث خطأ أثناء تحميل إحصائيات لوحة التحكم</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const formatNumber = (n?: number | null) => {
    if (n === undefined || n === null) return "0";
    return n.toLocaleString("ar-MA");
  };
  const formatCurrency = (n?: number | null) => {
    if (n === undefined || n === null || n === 0) return "—";
    return `${n.toLocaleString("ar-MA")} درهم`;
  };
  const getPercent = (part?: number, total?: number) => {
    if (!total || !part) return 0;
    return Math.round((part / total) * 100);
  };

  const total = stats.totalInstitutions || 1;

  // Region data for table
  const regionTableData = (stats.byRegion || [])
    .map(r => ({
      name: r.regionName || `جهة ${r.regionId}`,
      count: r.count,
      capacity: r.capacity || 0,
      beneficiaries: r.beneficiaries || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Prefecture data for table
  const prefectureTableData = (stats.byPrefecture || [])
    .filter(p => {
      if (selectedRegion === "all") return true;
      const regionPrefIds = prefectures?.map(pf => pf.id) || [];
      return regionPrefIds.includes(p.prefectureId);
    })
    .map(p => ({
      name: p.prefectureName || `إقليم ${p.prefectureId}`,
      count: p.count,
      capacity: p.capacity || 0,
      beneficiaries: p.beneficiaries || 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "VIEW_ONLY"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">لوحة التحكم</h1>
              <p className="text-muted-foreground">
                مرحباً {user?.firstName}، إليك نظرة عامة على المؤسسات
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedRegion} onValueChange={(v) => { setSelectedRegion(v); setSelectedPrefecture("all"); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر الجهة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الجهات</SelectItem>
                  {regions?.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedRegion !== "all" && (
                <Select value={selectedPrefecture} onValueChange={setSelectedPrefecture}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر الإقليم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقاليم</SelectItem>
                    {prefectures?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المؤسسات</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalInstitutions)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats.licensedCount)} مرخصة • {formatNumber(stats.unlicensedCount)} غير مرخصة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">الطاقة الاستيعابية</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalCapacity)}</div>
                <p className="text-xs text-muted-foreground">
                  متوسط {formatNumber(stats.averageCapacity)} لكل مؤسسة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">المستفيدون 2025-2026</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.beneficiaries?.season2526?.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats.beneficiaries?.season2526?.male)} ذكور • {formatNumber(stats.beneficiaries?.season2526?.female)} إناث
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">الموارد البشرية</CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.humanResources?.totalStaff)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats.humanResources?.totalWithCnss)} مسجل بـ CNSS
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="types">حسب النوع</TabsTrigger>
              <TabsTrigger value="levels">الأسلاك التعليمية</TabsTrigger>
              <TabsTrigger value="beneficiaries">المستفيدون</TabsTrigger>
              <TabsTrigger value="meals">الإطعام</TabsTrigger>
              <TabsTrigger value="building">البناية</TabsTrigger>
              <TabsTrigger value="financing">التمويل</TabsTrigger>
              <TabsTrigger value="hr">الموارد البشرية</TabsTrigger>
              <TabsTrigger value="regions">الجهات</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Type Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      توزيع المؤسسات حسب النوع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>دار الطالب</span>
                        <span>{formatNumber(stats.darTalibCount)} ({getPercent(stats.darTalibCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.darTalibCount, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>دار الطالبة</span>
                        <span>{formatNumber(stats.darTalibaCount)} ({getPercent(stats.darTalibaCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.darTalibaCount, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>دار الطالب والطالبة</span>
                        <span>{formatNumber(stats.mixedCount)} ({getPercent(stats.mixedCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.mixedCount, total)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Milieu Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      توزيع المؤسسات حسب الوسط
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>حضري</span>
                        <span>{formatNumber(stats.urbanCount)} ({getPercent(stats.urbanCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.urbanCount, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>قروي</span>
                        <span>{formatNumber(stats.ruralCount)} ({getPercent(stats.ruralCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.ruralCount, total)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Legal Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      الوضعية القانونية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          مرخصة
                        </span>
                        <span>{formatNumber(stats.licensedCount)} ({getPercent(stats.licensedCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.licensedCount, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-3 w-3 text-red-500" />
                          غير مرخصة
                        </span>
                        <span>{formatNumber(stats.unlicensedCount)} ({getPercent(stats.unlicensedCount, total)}%)</span>
                      </div>
                      <Progress value={getPercent(stats.unlicensedCount, total)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      الخدمات المقدمة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">مؤسسات توفر الإيواء</span>
                      <Badge variant="secondary">{formatNumber(stats.institutionsWithHousing)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">مؤسسات توفر الإطعام</span>
                      <Badge variant="secondary">{formatNumber(stats.institutionsWithMeals)}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Levels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      المستويات المستهدفة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ابتدائي</span>
                        <span>{formatNumber(stats.targetLevels?.primary)}</span>
                      </div>
                      <Progress value={getPercent(stats.targetLevels?.primary, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>إعدادي</span>
                        <span>{formatNumber(stats.targetLevels?.middleSchool)}</span>
                      </div>
                      <Progress value={getPercent(stats.targetLevels?.middleSchool, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ثانوي</span>
                        <span>{formatNumber(stats.targetLevels?.highSchool)}</span>
                      </div>
                      <Progress value={getPercent(stats.targetLevels?.highSchool, total)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Meal Service */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      خدمة الإطعام
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>مطبخ المؤسسة</span>
                        <span>{formatNumber(stats.mealService?.institutionKitchen)}</span>
                      </div>
                      <Progress value={getPercent(stats.mealService?.institutionKitchen, total)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>��جبات جاهزة</span>
                        <span>{formatNumber(stats.mealService?.readyMeals)}</span>
                      </div>
                      <Progress value={getPercent(stats.mealService?.readyMeals, total)} className="h-2" />
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm font-medium">
                        <span>إجمالي المستفيدين</span>
                        <span>{formatNumber(stats.mealService?.totalMealBeneficiaries)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Types Tab */}
            <TabsContent value="types" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Dar Talib */}
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      دار الطالب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{formatNumber(stats.typeStats?.darTalib?.total)}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">مرخصة</p>
                        <p className="font-medium text-green-600">{formatNumber(stats.typeStats?.darTalib?.licensed)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">غير مرخصة</p>
                        <p className="font-medium text-red-600">{formatNumber(stats.typeStats?.darTalib?.unlicensed)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">حضري</p>
                        <p className="font-medium">{formatNumber(stats.typeStats?.darTalib?.urban)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">قروي</p>
                        <p className="font-medium">{formatNumber(stats.typeStats?.darTalib?.rural)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dar Taliba */}
                <Card className="border-pink-200 dark:border-pink-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500" />
                      دار الطالبة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{formatNumber(stats.typeStats?.darTaliba?.total)}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">مرخصة</p>
                        <p className="font-medium text-green-600">{formatNumber(stats.typeStats?.darTaliba?.licensed)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">غير مرخصة</p>
                        <p className="font-medium text-red-600">{formatNumber(stats.typeStats?.darTaliba?.unlicensed)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">حضري</p>
                        <p className="font-medium">{formatNumber(stats.typeStats?.darTaliba?.urban)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">قروي</p>
                        <p className="font-medium">{formatNumber(stats.typeStats?.darTaliba?.rural)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mixed */}
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      دار الطالب والطالبة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{formatNumber(stats.typeStats?.mixed?.total)}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">مرخصة</p>
                        <p className="font-medium text-green-600">{formatNumber(stats.typeStats?.mixed?.licensed)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">غير مرخصة</p>
                        <p className="font-medium text-red-600">{formatNumber(stats.typeStats?.mixed?.unlicensed)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">حضري</p>
                        <p className="font-medium">{formatNumber(stats.typeStats?.mixed?.urban)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">قروي</p>
                        <p className="font-medium">{formatNumber(stats.typeStats?.mixed?.rural)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Target Levels Tab */}
            <TabsContent value="levels" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ابتدائي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(stats.targetLevels?.primary)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getPercent(stats.targetLevels?.primary, total)}% من المؤسسات
                    </p>
                    <Progress value={getPercent(stats.targetLevels?.primary, total)} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">إعدادي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(stats.targetLevels?.middleSchool)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getPercent(stats.targetLevels?.middleSchool, total)}% من المؤسسات
                    </p>
                    <Progress value={getPercent(stats.targetLevels?.middleSchool, total)} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ثانوي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(stats.targetLevels?.highSchool)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getPercent(stats.targetLevels?.highSchool, total)}% من المؤسسات
                    </p>
                    <Progress value={getPercent(stats.targetLevels?.highSchool, total)} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">آخر</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(stats.targetLevels?.other)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getPercent(stats.targetLevels?.other, total)}% من المؤسسات
                    </p>
                    <Progress value={getPercent(stats.targetLevels?.other, total)} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Beneficiaries Tab */}
            <TabsContent value="beneficiaries" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Season 2023-2024 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">الموسم 2023-2024</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{formatNumber(stats.beneficiaries?.season2324?.total)}</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">ذكور</p>
                        <p className="font-medium">{formatNumber(stats.beneficiaries?.season2324?.male)}</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">إناث</p>
                        <p className="font-medium">{formatNumber(stats.beneficiaries?.season2324?.female)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>ابتدائي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2324?.primary)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>إعدادي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2324?.middle)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ثانوي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2324?.high)}</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>آخر</span>
                        <Badge variant="outline">{formatNumber(stats.beneficiaries?.season2324?.orphans)}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ذوي الاحتياجات الخاصة</span>
                        <Badge variant="outline">{formatNumber(stats.beneficiaries?.season2324?.disabled)}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Season 2024-2025 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">الموسم 2024-2025</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{formatNumber(stats.beneficiaries?.season2425?.total)}</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">ذكور</p>
                        <p className="font-medium">{formatNumber(stats.beneficiaries?.season2425?.male)}</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground">إناث</p>
                        <p className="font-medium">{formatNumber(stats.beneficiaries?.season2425?.female)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>ابتدائي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2425?.primary)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>إعدادي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2425?.middle)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ثانوي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2425?.high)}</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>آخر</span>
                        <Badge variant="outline">{formatNumber(stats.beneficiaries?.season2425?.orphans)}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ذوي الاحتياجات الخاصة</span>
                        <Badge variant="outline">{formatNumber(stats.beneficiaries?.season2425?.disabled)}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Season 2025-2026 */}
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      الموسم 2025-2026
                      <Badge>الحالي</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-primary">{formatNumber(stats.beneficiaries?.season2526?.total)}</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-primary/10 rounded">
                        <p className="text-muted-foreground">ذكور</p>
                        <p className="font-medium">{formatNumber(stats.beneficiaries?.season2526?.male)}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded">
                        <p className="text-muted-foreground">إناث</p>
                        <p className="font-medium">{formatNumber(stats.beneficiaries?.season2526?.female)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>ابتدائي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2526?.primary)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>إعدادي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2526?.middle)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ثانوي</span>
                        <span>{formatNumber(stats.beneficiaries?.season2526?.high)}</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>آخر</span>
                        <Badge variant="outline">{formatNumber(stats.beneficiaries?.season2526?.orphans)}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ذوي الاحتياجات الخاصة</span>
                        <Badge variant="outline">{formatNumber(stats.beneficiaries?.season2526?.disabled)}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Meals Tab */}
            <TabsContent value="meals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      كيفية تقديم الوجبات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>مطبخ المؤسسة</span>
                      <Badge variant="secondary">{formatNumber(stats.mealService?.institutionKitchen)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>وجبات جاهزة</span>
                      <Badge variant="secondary">{formatNumber(stats.mealService?.readyMeals)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>أخرى</span>
                      <Badge variant="secondary">{formatNumber(stats.mealService?.other)}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">المستفيدون من الإطعام</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <div className="text-4xl font-bold text-primary">{formatNumber(stats.mealService?.totalMealBeneficiaries)}</div>
                      <p className="text-muted-foreground mt-2">مستفيد من خدمة الإطعام 2025-2026</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* New KPIs for Meals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">المستفيدون من منحة كاملة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatNumber(stats.mealService?.fullGrantBeneficiaries)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">المستفيدون من نصف منحة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{formatNumber(stats.mealService?.halfGrantBeneficiaries)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">المستفيدون من الجمعية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{formatNumber(stats.mealService?.associationMealBeneficiaries)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">المستفيدون من التربية الوطنية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{formatNumber(stats.mealService?.educationMealBeneficiaries)}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Building Tab */}
            <TabsContent value="building" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Building Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      وضعية البناية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>إيجار</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.rental)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.rental, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ملكية</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.owned)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.owned, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>وضع رهن إشارة المؤسسة</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.atDisposal)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.atDisposal, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>آخر</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.statusOther)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.statusOther, stats.totalInstitutions)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Building Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">الحالة العامة للبناية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>جيدة</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">{formatNumber(stats.buildingStats?.good)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.good, stats.totalInstitutions)} className="h-2 bg-green-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>بعض علامات التدهور</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">{formatNumber(stats.buildingStats?.someDegradation)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.someDegradation, stats.totalInstitutions)} className="h-2 bg-amber-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>متردية</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700">{formatNumber(stats.buildingStats?.bad)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.bad, stats.totalInstitutions)} className="h-2 bg-red-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>آخر</span>
                        <Badge variant="outline">{formatNumber(stats.buildingStats?.conditionOther)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.conditionOther, stats.totalInstitutions)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Renovation Capacity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">إمكانية الترميم</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>سهلة</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">{formatNumber(stats.buildingStats?.easy)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.easy, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>صعبة</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">{formatNumber(stats.buildingStats?.difficult)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.difficult, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>تتطلب إعادة البناء</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700">{formatNumber(stats.buildingStats?.needsReconstruction)}</Badge>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.needsReconstruction, stats.totalInstitutions)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">نوع المالك</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الملك العام للدولة</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.stateDomain)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.stateDomain, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>جماعي</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.communal)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.communal, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ملك خصوصي</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.privateOwner)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.privateOwner, stats.totalInstitutions)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>آخر</span>
                        <span className="font-medium">{formatNumber(stats.buildingStats?.ownerOther)}</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.ownerOther, stats.totalInstitutions)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Partnership Agreement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">اتفاقية شراكة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="text-2xl font-bold text-green-600">{formatNumber(stats.buildingStats?.hasPartnership)}</div>
                        <p className="text-sm text-muted-foreground mt-1">نعم</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <div className="text-2xl font-bold text-red-600">{formatNumber(stats.buildingStats?.noPartnership)}</div>
                        <p className="text-sm text-muted-foreground mt-1">لا</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>نسبة التوفر على اتفاقية</span>
                        <span className="font-medium">{getPercent(stats.buildingStats?.hasPartnership, (stats.buildingStats?.hasPartnership || 0) + (stats.buildingStats?.noPartnership || 0))}%</span>
                      </div>
                      <Progress value={getPercent(stats.buildingStats?.hasPartnership, (stats.buildingStats?.hasPartnership || 0) + (stats.buildingStats?.noPartnership || 0))} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financing Tab */}
            <TabsContent value="financing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Building Financing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      تمويل بناء المؤسسة
                    </CardTitle>
                    <CardDescription>عدد المؤسسات حسب مصدر التمويل</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>وزارة التضامن</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.solidarityMinistry)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>التعاون الوطني</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.nationalEntraide)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>المبادرة الوطنية للتنمية البشرية</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.indh)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>الجماعة</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.commune)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>مؤسسة محمد الخامس للتضامن</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.fondationMohammed5)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>الإنعاش الوطني</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.nationalRevival)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>الجمعية</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.association)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>أخرى</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.buildingFinancing?.other)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">إجمالي تكلفة البناء</p>
                      <p className="text-lg font-bold">{formatCurrency(stats.buildingFinancing?.totalCost)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Financing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      تمويل تجهيز المؤسسة
                    </CardTitle>
                    <CardDescription>عدد المؤسسات حسب مصدر التمويل</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>وزارة التضامن</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.solidarityMinistry)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>التعاون الوطني</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.nationalEntraide)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>المبادرة الوطنية للتنمية البشرية</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.indh)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>الجماعة</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.commune)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>مؤسسة محمد الخامس للتضامن</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.fondationMohammed5)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>الجمعية</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.association)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>أخرى</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.equipmentFinancing?.other)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Operating Financing Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      مصادر تمويل التسيير
                    </CardTitle>
                    <CardDescription>عدد المؤسسات حسب مصدر التمويل</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>المبادرة الوطنية للتنمية البشرية</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.indh)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>التعاون الوطني</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.nationalEntraide)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>وزارة التربية الوطنية</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.nationalEducation)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>الجماعة</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.commune)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>مساهمات أولياء الأمور</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.parentContributions)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>المتبرعون</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.donors)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>موارد الجمعية الخاصة</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.associationOwnSources)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>أخرى</TableCell>
                          <TableCell className="text-left font-medium">{formatNumber(stats.operatingFinancing?.other)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Operating Costs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      تكاليف التسيير
                    </CardTitle>
                    <CardDescription>إجمالي التكاليف السنوية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">تكلفة التسيير السنوية</p>
                        <p className="text-sm font-bold">{formatCurrency(stats.operatingFinancing?.annualManagementCost)}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">تكلفة الموارد البشرية</p>
                        <p className="text-sm font-bold">{formatCurrency(stats.operatingFinancing?.annualHRCost)}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">تكلفة الإطعام</p>
                        <p className="text-sm font-bold">{formatCurrency(stats.operatingFinancing?.annualMealsCost)}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">تكلفة الفرد السنوية</p>
                        <p className="text-sm font-bold">{formatCurrency(stats.operatingFinancing?.individualAnnualCost)}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">متوسط حصة الجمعية</span>
                        <Badge>{stats.operatingFinancing?.averageAssociationShare ?? 0}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">متوسط حصة التربية الوطنية</span>
                        <Badge variant="secondary">{stats.operatingFinancing?.averageEducationShare ?? 0}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">متوسط حصص أخرى</span>
                        <Badge variant="outline">{stats.operatingFinancing?.averageOtherShare ?? 0}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* HR Tab */}
            <TabsContent value="hr" className="space-y-4">
              {/* HR Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">إجمالي الموظفين</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{formatNumber(stats.humanResources?.totalStaff)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">مسجلون في CNSS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{formatNumber(stats.humanResources?.totalWithCnss)}</div>
                    <p className="text-xs text-muted-foreground">
                      {getPercent(stats.humanResources?.totalWithCnss, stats.humanResources?.totalStaff)}% من الإجمالي
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">يتقاضون SMIG</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{formatNumber(stats.humanResources?.totalWithSmig)}</div>
                    <p className="text-xs text-muted-foreground">
                      {getPercent(stats.humanResources?.totalWithSmig, stats.humanResources?.totalStaff)}% من الإجمالي
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">التكلفة الشهرية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats.humanResources?.totalMonthlyCost)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">التكلفة السنوية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.humanResources?.totalAnnualCost)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed HR Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">تفاصيل الموارد البشرية حسب الفئة</CardTitle>
                  <CardDescription>توزيع الموظفين حسب نوع التوظيف والفئة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">الفئة</TableHead>
                          <TableHead className="text-center">الإجمالي</TableHead>
                          <TableHead className="text-center">الجمعية</TableHead>
                          <TableHead className="text-center">ملحقون</TableHead>
                          <TableHead className="text-center">متطوعون</TableHead>
                          <TableHead className="text-center">CNSS</TableHead>
                          <TableHead className="text-center">SMIG</TableHead>
                          <TableHead className="text-center">التكلفة الشهرية</TableHead>
                          <TableHead className="text-center">التكلفة السنوية</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">المديرون</TableCell>
                          <TableCell className="text-center font-bold">{formatNumber(stats.humanResources?.directors?.total)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.directors?.association)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.directors?.deployed)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.directors?.volunteers)}</TableCell>
                          <TableCell className="text-center text-green-600">{formatNumber(stats.humanResources?.directors?.cnss)}</TableCell>
                          <TableCell className="text-center text-blue-600">{formatNumber(stats.humanResources?.directors?.smig)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.directors?.monthlyCost)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.directors?.annualCost)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">المربون</TableCell>
                          <TableCell className="text-center font-bold">{formatNumber(stats.humanResources?.educators?.total)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.educators?.association)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.educators?.deployed)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.educators?.volunteers)}</TableCell>
                          <TableCell className="text-center text-green-600">{formatNumber(stats.humanResources?.educators?.cnss)}</TableCell>
                          <TableCell className="text-center text-blue-600">{formatNumber(stats.humanResources?.educators?.smig)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.educators?.monthlyCost)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.educators?.annualCost)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">الطباخون</TableCell>
                          <TableCell className="text-center font-bold">{formatNumber(stats.humanResources?.cooks?.total)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.cooks?.association)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.cooks?.deployed)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.cooks?.volunteers)}</TableCell>
                          <TableCell className="text-center text-green-600">{formatNumber(stats.humanResources?.cooks?.cnss)}</TableCell>
                          <TableCell className="text-center text-blue-600">{formatNumber(stats.humanResources?.cooks?.smig)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.cooks?.monthlyCost)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.cooks?.annualCost)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">الحراس</TableCell>
                          <TableCell className="text-center font-bold">{formatNumber(stats.humanResources?.guards?.total)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.guards?.association)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.guards?.deployed)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.guards?.volunteers)}</TableCell>
                          <TableCell className="text-center text-green-600">{formatNumber(stats.humanResources?.guards?.cnss)}</TableCell>
                          <TableCell className="text-center text-blue-600">{formatNumber(stats.humanResources?.guards?.smig)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.guards?.monthlyCost)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.guards?.annualCost)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">آخرون</TableCell>
                          <TableCell className="text-center font-bold">{formatNumber(stats.humanResources?.other?.total)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.other?.association)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.other?.deployed)}</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.other?.volunteers)}</TableCell>
                          <TableCell className="text-center text-green-600">{formatNumber(stats.humanResources?.other?.cnss)}</TableCell>
                          <TableCell className="text-center text-blue-600">{formatNumber(stats.humanResources?.other?.smig)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.other?.monthlyCost)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.other?.annualCost)}</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50 font-bold">
                          <TableCell>المجموع</TableCell>
                          <TableCell className="text-center">{formatNumber(stats.humanResources?.totalStaff)}</TableCell>
                          <TableCell className="text-center">{formatNumber(
                            (stats.humanResources?.directors?.association || 0) +
                            (stats.humanResources?.educators?.association || 0) +
                            (stats.humanResources?.cooks?.association || 0) +
                            (stats.humanResources?.guards?.association || 0) +
                            (stats.humanResources?.other?.association || 0)
                          )}</TableCell>
                          <TableCell className="text-center">{formatNumber(
                            (stats.humanResources?.directors?.deployed || 0) +
                            (stats.humanResources?.educators?.deployed || 0) +
                            (stats.humanResources?.cooks?.deployed || 0) +
                            (stats.humanResources?.guards?.deployed || 0) +
                            (stats.humanResources?.other?.deployed || 0)
                          )}</TableCell>
                          <TableCell className="text-center">{formatNumber(
                            (stats.humanResources?.directors?.volunteers || 0) +
                            (stats.humanResources?.educators?.volunteers || 0) +
                            (stats.humanResources?.cooks?.volunteers || 0) +
                            (stats.humanResources?.guards?.volunteers || 0) +
                            (stats.humanResources?.other?.volunteers || 0)
                          )}</TableCell>
                          <TableCell className="text-center text-green-600">{formatNumber(stats.humanResources?.totalWithCnss)}</TableCell>
                          <TableCell className="text-center text-blue-600">{formatNumber(stats.humanResources?.totalWithSmig)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.totalMonthlyCost)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(stats.humanResources?.totalAnnualCost)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* HR Distribution Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Staff by Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">توزيع الموظفين حسب الفئة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المديرون</span>
                        <span className="font-medium">{formatNumber(stats.humanResources?.directors?.total)}</span>
                      </div>
                      <Progress value={getPercent(stats.humanResources?.directors?.total, stats.humanResources?.totalStaff)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المربون</span>
                        <span className="font-medium">{formatNumber(stats.humanResources?.educators?.total)}</span>
                      </div>
                      <Progress value={getPercent(stats.humanResources?.educators?.total, stats.humanResources?.totalStaff)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الطباخون</span>
                        <span className="font-medium">{formatNumber(stats.humanResources?.cooks?.total)}</span>
                      </div>
                      <Progress value={getPercent(stats.humanResources?.cooks?.total, stats.humanResources?.totalStaff)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الحراس</span>
                        <span className="font-medium">{formatNumber(stats.humanResources?.guards?.total)}</span>
                      </div>
                      <Progress value={getPercent(stats.humanResources?.guards?.total, stats.humanResources?.totalStaff)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>آخرون</span>
                        <span className="font-medium">{formatNumber(stats.humanResources?.other?.total)}</span>
                      </div>
                      <Progress value={getPercent(stats.humanResources?.other?.total, stats.humanResources?.totalStaff)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Staff by Employment Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">توزيع الموظفين حسب نوع التوظيف</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">موظفو الجمعية</p>
                        <p className="text-xl font-bold text-blue-600">{formatNumber(
                          (stats.humanResources?.directors?.association || 0) +
                          (stats.humanResources?.educators?.association || 0) +
                          (stats.humanResources?.cooks?.association || 0) +
                          (stats.humanResources?.guards?.association || 0) +
                          (stats.humanResources?.other?.association || 0)
                        )}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">الملحقون</p>
                        <p className="text-xl font-bold text-green-600">{formatNumber(
                          (stats.humanResources?.directors?.deployed || 0) +
                          (stats.humanResources?.educators?.deployed || 0) +
                          (stats.humanResources?.cooks?.deployed || 0) +
                          (stats.humanResources?.guards?.deployed || 0) +
                          (stats.humanResources?.other?.deployed || 0)
                        )}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">المتطوعون</p>
                        <p className="text-xl font-bold text-purple-600">{formatNumber(
                          (stats.humanResources?.directors?.volunteers || 0) +
                          (stats.humanResources?.educators?.volunteers || 0) +
                          (stats.humanResources?.cooks?.volunteers || 0) +
                          (stats.humanResources?.guards?.volunteers || 0) +
                          (stats.humanResources?.other?.volunteers || 0)
                        )}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="text-xs text-muted-foreground">نسبة التسجيل في CNSS</p>
                          <p className="text-xl font-bold text-green-600">
                            {getPercent(stats.humanResources?.totalWithCnss, stats.humanResources?.totalStaff)}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-xs text-muted-foreground">نسبة التقاضي SMIG</p>
                          <p className="text-xl font-bold text-blue-600">
                            {getPercent(stats.humanResources?.totalWithSmig, stats.humanResources?.totalStaff)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Regions Tab */}
            <TabsContent value="regions" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Regions Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      إحصائيات الجهات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الجهة</TableHead>
                            <TableHead className="text-center">المؤسسات</TableHead>
                            <TableHead className="text-center">الطاقة</TableHead>
                            <TableHead className="text-center">المستفيدون</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {regionTableData.map((region, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{region.name}</TableCell>
                              <TableCell className="text-center">{formatNumber(region.count)}</TableCell>
                              <TableCell className="text-center">{formatNumber(region.capacity)}</TableCell>
                              <TableCell className="text-center">{formatNumber(region.beneficiaries)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Prefectures Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      إحصائيات الأقاليم
                    </CardTitle>
                    <CardDescription>أعلى 20 إقليم</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الإقليم</TableHead>
                            <TableHead className="text-center">المؤسسات</TableHead>
                            <TableHead className="text-center">الطاقة</TableHead>
                            <TableHead className="text-center">المستفيدون</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prefectureTableData.slice(0, 20).map((pref, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{pref.name}</TableCell>
                              <TableCell className="text-center">{formatNumber(pref.count)}</TableCell>
                              <TableCell className="text-center">{formatNumber(pref.capacity)}</TableCell>
                              <TableCell className="text-center">{formatNumber(pref.beneficiaries)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
