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
  TrendingUp, Globe, Building, GraduationCap, XCircle
} from "lucide-react";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("global");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("all");

  // Redirect non-admin/non-view-only users
  useEffect(() => {
    if (!isAuthLoading && user && user.role !== "ADMIN" && user.role !== "VIEW_ONLY") {
      router.push("/institutions");
    }
  }, [user, isAuthLoading, router]);

  // Fetch dashboard stats from backend - this is the ONLY data source
  const { data: stats, isLoading, error } = useAuthSWR<DashboardStats>(
    (user?.role === "ADMIN" || user?.role === "VIEW_ONLY") 
      ? buildApiUrl(API_ENDPOINTS.statistics.dashboard) 
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

  if (error) {
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

  if (!stats) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN", "VIEW_ONLY"]}>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <div className="container mx-auto p-6" dir="rtl">
            <Card>
              <CardHeader>
                <CardTitle>لا توجد بيانات</CardTitle>
                <CardDescription>لم يتم العثور على إحصائيات</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Get filtered stats based on region/prefecture selection
  const getFilteredStats = () => {
    if (selectedRegion === "all") {
      return {
        totalInstitutions: stats.totalInstitutions,
        totalCapacity: stats.totalCapacity,
        totalBeneficiaries: stats.totalBeneficiaries,
      };
    }
    
    const regionId = Number(selectedRegion);
    const regionStats = stats.byRegion?.find(r => r.regionId === regionId);
    
    if (selectedPrefecture !== "all") {
      const prefId = Number(selectedPrefecture);
      const prefStats = stats.byPrefecture?.find(p => p.prefectureId === prefId);
      if (prefStats) {
        return {
          totalInstitutions: prefStats.count,
          totalCapacity: prefStats.capacity,
          totalBeneficiaries: prefStats.beneficiaries || 0,
        };
      }
    }
    
    if (regionStats) {
      return {
        totalInstitutions: regionStats.count,
        totalCapacity: regionStats.capacity,
        totalBeneficiaries: regionStats.beneficiaries || 0,
      };
    }
    
    return {
      totalInstitutions: stats.totalInstitutions,
      totalCapacity: stats.totalCapacity,
      totalBeneficiaries: stats.totalBeneficiaries,
    };
  };

  const filteredStats = getFilteredStats();

  // Calculate percentages for distributions
  const total = stats.totalInstitutions || 1;
  
  const typeData = [
    { name: "دار الطالب", value: stats.darTalibCount, color: "bg-blue-500" },
    { name: "دار الطالبة", value: stats.darTalibaCount, color: "bg-pink-500" },
    { name: "دار الطالب والطالبة", value: stats.mixedCount, color: "bg-purple-500" },
  ];

  const milieuData = [
    { name: "حضري", value: stats.urbanCount, color: "bg-amber-500" },
    { name: "قروي", value: stats.ruralCount, color: "bg-green-500" },
  ];

  const statusData = [
    { name: "مرخصة", value: stats.licensedCount, color: "bg-emerald-500" },
    { name: "غير مرخصة", value: stats.unlicensedCount, color: "bg-red-500" },
  ];

  // Stats Card Component
  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description,
    color = "text-primary",
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType;
    description?: string;
    color?: string;
  }) => (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  // Distribution Card Component
  const DistributionCard = ({ 
    title, 
    data, 
    icon: Icon,
    description,
  }: { 
    title: string; 
    data: { name: string; value: number; color: string }[];
    icon: React.ElementType;
    description?: string;
  }) => {
    const cardTotal = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((item, idx) => {
            const percentage = cardTotal > 0 ? (item.value / cardTotal) * 100 : 0;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.value.toLocaleString()}</Badge>
                    <span className="text-muted-foreground w-14 text-left">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  // Stats Table Component
  const StatsTable = ({ 
    data, 
    title, 
    description 
  }: { 
    data: { name: string; count: number; capacity: number; beneficiaries?: number }[];
    title: string;
    description?: string;
  }) => (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b">
                <th className="text-right py-2 px-2 font-medium">الاسم</th>
                <th className="text-center py-2 px-2 font-medium">المؤسسات</th>
                <th className="text-center py-2 px-2 font-medium">الطاقة</th>
                <th className="text-center py-2 px-2 font-medium">المستفيدون</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-2 px-2">{item.name}</td>
                  <td className="text-center py-2 px-2">
                    <Badge variant="outline">{item.count}</Badge>
                  </td>
                  <td className="text-center py-2 px-2">{item.capacity.toLocaleString()}</td>
                  <td className="text-center py-2 px-2">{item.beneficiaries?.toLocaleString() || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Summary Cards Component
  const SummaryCards = ({ data }: { data: typeof filteredStats }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="إجمالي المؤسسات"
        value={data.totalInstitutions}
        icon={Building2}
        color="text-blue-500"
        description="مؤسسة مسجلة"
      />
      <StatCard
        title="الطاقة الاستيعابية"
        value={data.totalCapacity}
        icon={Users}
        color="text-green-500"
        description={`متوسط ${stats.averageCapacity?.toFixed(0) || Math.round(data.totalCapacity / (data.totalInstitutions || 1))} لكل مؤسسة`}
      />
      <StatCard
        title="المستفيدون"
        value={data.totalBeneficiaries}
        icon={GraduationCap}
        color="text-purple-500"
        description="مستفيد حالي"
      />
      <StatCard
        title="الموظفون"
        value={stats.totalStaffCount || "—"}
        icon={Users}
        color="text-orange-500"
        description="موظف في المؤسسات"
      />
    </div>
  );

  // Services Cards
  const ServicesCards = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base">خدمة الإيواء</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">المؤسسات التي توفر الإيواء</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.institutionsWithHousing?.toLocaleString() || "—"}</span>
              {stats.institutionsWithHousing && (
                <Badge variant="secondary">
                  {((stats.institutionsWithHousing / total) * 100).toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">خدمة الإطعام</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">المؤسسات التي توفر الإطعام</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.institutionsWithMeals?.toLocaleString() || "—"}</span>
              {stats.institutionsWithMeals && (
                <Badge variant="secondary">
                  {((stats.institutionsWithMeals / total) * 100).toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Region data for table
  const regionTableData = (stats.byRegion || [])
    .map(r => ({
      name: r.regionName || `جهة ${r.regionId}`,
      count: r.count,
      capacity: r.capacity,
      beneficiaries: r.beneficiaries,
    }))
    .sort((a, b) => b.count - a.count);

  // Prefecture data for table
  const prefectureTableData = (stats.byPrefecture || [])
    .filter(p => {
      if (selectedRegion === "all") return true;
      // Filter by selected region's prefectures
      const regionPrefIds = prefectures?.map(pf => pf.id) || [];
      return regionPrefIds.includes(p.prefectureId);
    })
    .map(p => ({
      name: p.prefectureName || `إقليم ${p.prefectureId}`,
      count: p.count,
      capacity: p.capacity,
      beneficiaries: p.beneficiaries,
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
            <Badge variant="outline" className="text-sm">
              آخر تحديث: {new Date().toLocaleDateString("ar-MA")}
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="global">عام</TabsTrigger>
              <TabsTrigger value="region">حسب الجهة</TabsTrigger>
              <TabsTrigger value="prefecture">حسب الإقليم</TabsTrigger>
            </TabsList>

            {/* Global Tab */}
            <TabsContent value="global" className="space-y-6">
              <SummaryCards data={stats} />
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DistributionCard
                  title="توزيع حسب النوع"
                  description="أنواع المؤسسات"
                  icon={Building}
                  data={typeData}
                />

                <DistributionCard
                  title="توزيع حسب الوسط"
                  description="حضري / قروي"
                  icon={MapPin}
                  data={milieuData}
                />

                <DistributionCard
                  title="الوضعية القانونية"
                  description="مرخصة / غير مرخصة"
                  icon={CheckCircle}
                  data={statusData}
                />
              </div>

              <ServicesCards />

              <div className="grid gap-4 md:grid-cols-2">
                <StatsTable
                  title="التوزيع حسب الجهات"
                  description="إحصائيات كل جهة"
                  data={regionTableData}
                />

                <StatsTable
                  title="أكبر الأقاليم"
                  description="الأقاليم الأكثر مؤسسات"
                  data={prefectureTableData.slice(0, 15)}
                />
              </div>
            </TabsContent>

            {/* Region Tab */}
            <TabsContent value="region" className="space-y-6">
              <div className="flex items-center gap-4">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="اختر الجهة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الجهات</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <SummaryCards data={filteredStats} />

              <StatsTable
                title="التوزيع حسب الجهات"
                description="إحصائيات المؤسسات في كل جهة"
                data={regionTableData}
              />
            </TabsContent>

            {/* Prefecture Tab */}
            <TabsContent value="prefecture" className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="اختر الجهة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الجهات</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedRegion !== "all" && prefectures && (
                  <Select value={selectedPrefecture} onValueChange={setSelectedPrefecture}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="اختر الإقليم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقاليم</SelectItem>
                      {prefectures.map((pref) => (
                        <SelectItem key={pref.id} value={String(pref.id)}>
                          {pref.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <SummaryCards data={filteredStats} />

              <StatsTable
                title="التوزيع حسب الأقاليم"
                description={selectedRegion !== "all" ? "أقاليم الجهة المختارة" : "جميع الأقاليم"}
                data={prefectureTableData}
              />
            </TabsContent>
          </Tabs>

          {/* Note about extended KPIs */}
          <Card className="border-border/50 bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                للحصول على إحصائيات أكثر تفصيلاً (التمويل، الموارد البشرية، المستفيدين حسب المستوى...)، 
                يرجى تحديث واجهة برمجة التطبيقات الخلفية لتوفير هذه البيانات في نقطة النهاية الإحصائية.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
