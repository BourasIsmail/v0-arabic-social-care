"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  LineChart,
  Line,
  Legend,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/layout/app-header";
import type { DashboardStats, RegionStats, PrefectureStats, InstitutionSummary, PageResponse } from "@/lib/types";
import { 
  Building2, Users, MapPin, CheckCircle, Home, Loader2, UserCog, Utensils, 
  TrendingUp, Globe, Map, Building, BarChart3, PieChartIcon, AlertTriangle,
  GraduationCap, Heart, Stethoscope, BookOpen
} from "lucide-react";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";

// Chart colors
const COLORS = {
  primary: "#2563eb",
  secondary: "#16a34a", 
  accent: "#dc2626",
  muted: "#6b7280",
  urban: "#3b82f6",
  rural: "#22c55e",
  licensed: "#10b981",
  unlicensed: "#ef4444",
  inProgress: "#f59e0b",
  darTalib: "#2563eb",
  darTaliba: "#ec4899",
  mixed: "#8b5cf6",
  housing: "#06b6d4",
  meals: "#f97316",
  education: "#8b5cf6",
  health: "#ef4444",
  culture: "#14b8a6",
};

const CHART_COLORS = [
  "#2563eb", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", 
  "#06b6d4", "#ef4444", "#84cc16", "#6366f1", "#f43f5e"
];

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

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useAuthSWR<DashboardStats>(
    (user?.role === "ADMIN" || user?.role === "VIEW_ONLY") ? buildApiUrl(API_ENDPOINTS.statistics.dashboard) : null
  );

  // Fetch all institutions for detailed analysis
  const { data: institutionsData } = useAuthSWR<PageResponse<InstitutionSummary>>(
    (user?.role === "ADMIN" || user?.role === "VIEW_ONLY") ? buildApiUrl(`${API_ENDPOINTS.institutions.list}?size=10000`) : null
  );

  const institutions = institutionsData?.content || [];

  // Filter institutions based on selection
  const filteredInstitutions = useMemo(() => {
    let filtered = institutions;
    if (selectedRegion !== "all") {
      filtered = filtered.filter(inst => inst.regionName === selectedRegion);
    }
    if (selectedPrefecture !== "all") {
      filtered = filtered.filter(inst => inst.prefectureName === selectedPrefecture);
    }
    return filtered;
  }, [institutions, selectedRegion, selectedPrefecture]);

  // Get unique regions and prefectures
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(institutions.map(i => i.regionName).filter(Boolean))];
    return uniqueRegions.sort();
  }, [institutions]);

  const prefectures = useMemo(() => {
    let filtered = institutions;
    if (selectedRegion !== "all") {
      filtered = filtered.filter(inst => inst.regionName === selectedRegion);
    }
    const uniquePrefectures = [...new Set(filtered.map(i => i.prefectureName).filter(Boolean))];
    return uniquePrefectures.sort();
  }, [institutions, selectedRegion]);

  // Calculate statistics for filtered data
  const filteredStats = useMemo(() => {
    const data = filteredInstitutions;
    return {
      total: data.length,
      totalCapacity: data.reduce((sum, i) => sum + (i.totalCapacity || 0), 0),
      darTalib: data.filter(i => i.institutionType === "DAR_TALIB").length,
      darTaliba: data.filter(i => i.institutionType === "DAR_TALIBA").length,
      mixed: data.filter(i => i.institutionType === "DAR_TALIB_TALIBA").length,
      urban: data.filter(i => i.milieu === "URBAIN" || i.milieu === "URBAN").length,
      rural: data.filter(i => i.milieu === "RURAL").length,
      licensed: data.filter(i => i.legalStatus === "LICENSED").length,
      unlicensed: data.filter(i => i.legalStatus === "UNLICENSED").length,
      inProgress: data.filter(i => i.legalStatus === "IN_PROGRESS").length,
    };
  }, [filteredInstitutions]);

  // Prepare chart data for regions
  const regionChartData = useMemo(() => {
    const regionMap = new Map<string, { count: number; capacity: number }>();
    institutions.forEach(inst => {
      if (inst.regionName) {
        const existing = regionMap.get(inst.regionName) || { count: 0, capacity: 0 };
        regionMap.set(inst.regionName, {
          count: existing.count + 1,
          capacity: existing.capacity + (inst.totalCapacity || 0),
        });
      }
    });
    return Array.from(regionMap.entries())
      .map(([name, data]) => ({ name: name.substring(0, 20), fullName: name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [institutions]);

  // Prepare chart data for prefectures (filtered by region if selected)
  const prefectureChartData = useMemo(() => {
    const data = selectedRegion !== "all" 
      ? institutions.filter(i => i.regionName === selectedRegion)
      : institutions;
    
    const prefectureMap = new Map<string, { count: number; capacity: number }>();
    data.forEach(inst => {
      if (inst.prefectureName) {
        const existing = prefectureMap.get(inst.prefectureName) || { count: 0, capacity: 0 };
        prefectureMap.set(inst.prefectureName, {
          count: existing.count + 1,
          capacity: existing.capacity + (inst.totalCapacity || 0),
        });
      }
    });
    return Array.from(prefectureMap.entries())
      .map(([name, data]) => ({ name: name.substring(0, 18), fullName: name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [institutions, selectedRegion]);

  // Type distribution by region
  const typeByRegionData = useMemo(() => {
    const regionMap = new Map<string, { darTalib: number; darTaliba: number; mixed: number }>();
    institutions.forEach(inst => {
      if (inst.regionName) {
        const existing = regionMap.get(inst.regionName) || { darTalib: 0, darTaliba: 0, mixed: 0 };
        if (inst.institutionType === "DAR_TALIB") existing.darTalib++;
        else if (inst.institutionType === "DAR_TALIBA") existing.darTaliba++;
        else if (inst.institutionType === "DAR_TALIB_TALIBA") existing.mixed++;
        regionMap.set(inst.regionName, existing);
      }
    });
    return Array.from(regionMap.entries())
      .map(([name, data]) => ({ name: name.substring(0, 15), ...data }))
      .sort((a, b) => (b.darTalib + b.darTaliba + b.mixed) - (a.darTalib + a.darTaliba + a.mixed))
      .slice(0, 12);
  }, [institutions]);

  // Milieu distribution by region
  const milieuByRegionData = useMemo(() => {
    const regionMap = new Map<string, { urban: number; rural: number }>();
    institutions.forEach(inst => {
      if (inst.regionName) {
        const existing = regionMap.get(inst.regionName) || { urban: 0, rural: 0 };
        if (inst.milieu === "URBAIN" || inst.milieu === "URBAN") existing.urban++;
        else if (inst.milieu === "RURAL") existing.rural++;
        regionMap.set(inst.regionName, existing);
      }
    });
    return Array.from(regionMap.entries())
      .map(([name, data]) => ({ name: name.substring(0, 15), ...data }))
      .sort((a, b) => (b.urban + b.rural) - (a.urban + a.rural))
      .slice(0, 12);
  }, [institutions]);

  // Capacity comparison by region
  const capacityByRegionData = useMemo(() => {
    return regionChartData.slice(0, 12).map(r => ({
      name: r.name,
      capacity: r.capacity,
      avgCapacity: r.count > 0 ? Math.round(r.capacity / r.count) : 0,
    }));
  }, [regionChartData]);

  if (isAuthLoading || isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">خطأ في التحميل</CardTitle>
            </CardHeader>
            <CardContent>
              <p>حدث خطأ أثناء تحميل الإحصائيات. يرجى المحاولة مرة أخرى.</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Prepare pie chart data
  const typeDistributionData = [
    { name: "دار الطالب", value: filteredStats.darTalib, fill: COLORS.darTalib },
    { name: "دار الطالبة", value: filteredStats.darTaliba, fill: COLORS.darTaliba },
    { name: "دار الطالب والطالبة", value: filteredStats.mixed, fill: COLORS.mixed },
  ];

  const milieuData = [
    { name: "حضري", value: filteredStats.urban, fill: COLORS.urban },
    { name: "قروي", value: filteredStats.rural, fill: COLORS.rural },
  ];

  const legalStatusData = [
    { name: "مرخصة", value: filteredStats.licensed, fill: COLORS.licensed },
    { name: "غير مرخصة", value: filteredStats.unlicensed, fill: COLORS.unlicensed },
    { name: "في طور الترخيص", value: filteredStats.inProgress, fill: COLORS.inProgress },
  ].filter(d => d.value > 0);

  const chartConfig = {
    count: { label: "عدد المؤسسات", color: COLORS.primary },
    capacity: { label: "الطاقة الاستيعابية", color: COLORS.secondary },
    avgCapacity: { label: "متوسط الطاقة", color: COLORS.accent },
    darTalib: { label: "دار الطالب", color: COLORS.darTalib },
    darTaliba: { label: "دار الطالبة", color: COLORS.darTaliba },
    mixed: { label: "دار الطالب والطالبة", color: COLORS.mixed },
    urban: { label: "حضري", color: COLORS.urban },
    rural: { label: "قروي", color: COLORS.rural },
  };

  const renderStatCard = (
    title: string, 
    value: number | string, 
    icon: React.ReactNode, 
    color: string,
    subtitle?: string
  ) => (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-9 w-9 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const renderPieChart = (data: any[], title: string, description: string) => (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const total = data.reduce((sum, item) => sum + item.value, 0);
                    const percent = total > 0 ? ((d.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                        <p className="font-medium">{d.name}</p>
                        <p className="text-muted-foreground">{d.value} مؤسسة ({percent}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background" dir="rtl">
        <AppHeader subtitle="لوحة التحكم - إحصائيات المؤسسات" />

        <main className="container mx-auto px-4 py-6">
          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="global" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">عام</span>
                </TabsTrigger>
                <TabsTrigger value="region" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">حسب الجهة</span>
                </TabsTrigger>
                <TabsTrigger value="prefecture" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">حسب الإقليم</span>
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex gap-3 w-full sm:w-auto">
                {(activeTab === "region" || activeTab === "prefecture") && (
                  <Select value={selectedRegion} onValueChange={(val) => {
                    setSelectedRegion(val);
                    setSelectedPrefecture("all");
                  }}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="اختر الجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الجهات</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region!}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {activeTab === "prefecture" && (
                  <Select value={selectedPrefecture} onValueChange={setSelectedPrefecture}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="اختر الإقليم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقاليم</SelectItem>
                      {prefectures.map(prefecture => (
                        <SelectItem key={prefecture} value={prefecture!}>{prefecture}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Global View */}
            <TabsContent value="global" className="space-y-6">
              {/* Summary Cards Row 1 */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {renderStatCard(
                  "إجمالي المؤسسات",
                  stats?.totalInstitutions || 0,
                  <Building2 className="h-5 w-5 text-primary" />,
                  "bg-primary/10"
                )}
                {renderStatCard(
                  "الطاقة الاستيعابية",
                  stats?.totalCapacity || 0,
                  <Home className="h-5 w-5 text-green-600" />,
                  "bg-green-500/10",
                  `معدل ${stats?.averageCapacity?.toLocaleString() || 0} لكل مؤسسة`
                )}
                {renderStatCard(
                  "المستفيدون",
                  stats?.totalBeneficiaries || 0,
                  <Users className="h-5 w-5 text-blue-600" />,
                  "bg-blue-500/10"
                )}
                {renderStatCard(
                  "المؤسسات المرخصة",
                  stats?.licensedCount || 0,
                  <CheckCircle className="h-5 w-5 text-emerald-600" />,
                  "bg-emerald-500/10",
                  `${stats?.totalInstitutions ? Math.round((stats.licensedCount || 0) / stats.totalInstitutions * 100) : 0}% من المؤسسات`
                )}
              </div>

              {/* Summary Cards Row 2 */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {renderStatCard(
                  "إجمالي الموظفين",
                  stats?.totalStaffCount || 0,
                  <UserCog className="h-5 w-5 text-orange-600" />,
                  "bg-orange-500/10"
                )}
                {renderStatCard(
                  "مؤسسات بالإيواء",
                  stats?.institutionsWithHousing || 0,
                  <Home className="h-5 w-5 text-cyan-600" />,
                  "bg-cyan-500/10",
                  `${stats?.totalInstitutions ? Math.round((stats.institutionsWithHousing || 0) / stats.totalInstitutions * 100) : 0}% من المؤسسات`
                )}
                {renderStatCard(
                  "مؤسسات بالإطعام",
                  stats?.institutionsWithMeals || 0,
                  <Utensils className="h-5 w-5 text-amber-600" />,
                  "bg-amber-500/10",
                  `${stats?.totalInstitutions ? Math.round((stats.institutionsWithMeals || 0) / stats.totalInstitutions * 100) : 0}% من المؤسسات`
                )}
                {renderStatCard(
                  "غير مرخصة",
                  stats?.unlicensedCount || 0,
                  <AlertTriangle className="h-5 w-5 text-red-600" />,
                  "bg-red-500/10",
                  `${stats?.totalInstitutions ? Math.round((stats.unlicensedCount || 0) / stats.totalInstitutions * 100) : 0}% تحتاج ترخيص`
                )}
              </div>

              {/* Type Distribution Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm border-r-4 border-r-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">دور الطالب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats?.darTalibCount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.totalInstitutions ? Math.round((stats.darTalibCount || 0) / stats.totalInstitutions * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm border-r-4 border-r-pink-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">دور الطالبة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">{stats?.darTalibaCount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.totalInstitutions ? Math.round((stats.darTalibaCount || 0) / stats.totalInstitutions * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm border-r-4 border-r-violet-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">دار الطالب والطالبة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-violet-600">{stats?.mixedCount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.totalInstitutions ? Math.round((stats.mixedCount || 0) / stats.totalInstitutions * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {renderPieChart(typeDistributionData, "توزيع المؤسسات حسب النوع", "دار الطالب، دار الطالبة، ومختلطة")}
                {renderPieChart(milieuData, "التوزيع حسب الوسط", "حضري وقروي")}
                {renderPieChart(legalStatusData, "الوضع القانوني", "حالة الترخيص")}
              </div>

              {/* Region Bar Chart */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>المؤسسات حسب الجهة</CardTitle>
                  <CardDescription>عدد المؤسسات في كل جهة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <BarChart
                      data={regionChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                                <p className="font-medium">{d.fullName}</p>
                                <p className="text-muted-foreground">عدد المؤسسات: {d.count}</p>
                                <p className="text-muted-foreground">الطاقة الاستيعابية: {d.capacity?.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" name="عدد المؤسسات" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Type by Region Stacked Bar */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>توزيع أنواع المؤسسات حسب الجهة</CardTitle>
                  <CardDescription>مقارنة أنواع المؤسسات في كل جهة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <BarChart data={typeByRegionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="darTalib" name="دار الطالب" stackId="a" fill={COLORS.darTalib} />
                      <Bar dataKey="darTaliba" name="دار الطالبة" stackId="a" fill={COLORS.darTaliba} />
                      <Bar dataKey="mixed" name="دار الطالب والطالبة" stackId="a" fill={COLORS.mixed} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Milieu by Region */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>توزيع الوسط حسب الجهة</CardTitle>
                  <CardDescription>مقارنة المؤسسات الحضرية والقروية في كل جهة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <BarChart data={milieuByRegionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="urban" name="حضري" fill={COLORS.urban} />
                      <Bar dataKey="rural" name="قروي" fill={COLORS.rural} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Capacity by Region */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>الطاقة الاستيعابية حسب الجهة</CardTitle>
                  <CardDescription>إجمالي ومتوسط الطاقة الاستيعابية</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <BarChart data={capacityByRegionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="capacity" name="إجمالي الطاقة" fill={COLORS.primary} />
                      <Bar yAxisId="right" dataKey="avgCapacity" name="متوسط الطاقة" fill={COLORS.secondary} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Region View */}
            <TabsContent value="region" className="space-y-6">
              {/* Summary for selected region */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {renderStatCard(
                  "عدد المؤسسات",
                  filteredStats.total,
                  <Building2 className="h-5 w-5 text-primary" />,
                  "bg-primary/10"
                )}
                {renderStatCard(
                  "الطاقة الاستيعابية",
                  filteredStats.totalCapacity,
                  <Home className="h-5 w-5 text-green-600" />,
                  "bg-green-500/10",
                  filteredStats.total > 0 ? `معدل ${Math.round(filteredStats.totalCapacity / filteredStats.total)} لكل مؤسسة` : undefined
                )}
                {renderStatCard(
                  "مرخصة",
                  filteredStats.licensed,
                  <CheckCircle className="h-5 w-5 text-emerald-600" />,
                  "bg-emerald-500/10",
                  `${filteredStats.total > 0 ? Math.round(filteredStats.licensed / filteredStats.total * 100) : 0}%`
                )}
                {renderStatCard(
                  "غير مرخصة",
                  filteredStats.unlicensed,
                  <AlertTriangle className="h-5 w-5 text-red-600" />,
                  "bg-red-500/10",
                  `${filteredStats.total > 0 ? Math.round(filteredStats.unlicensed / filteredStats.total * 100) : 0}%`
                )}
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {renderPieChart(typeDistributionData, "توزيع المؤسسات حسب النوع", selectedRegion === "all" ? "جميع الجهات" : selectedRegion)}
                {renderPieChart(milieuData, "التوزيع حسب الوسط", "حضري وقروي")}
                {renderPieChart(legalStatusData, "الوضع القانوني", "حالة الترخيص")}
              </div>

              {/* Prefecture breakdown for selected region */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>المؤسسات حسب الإقليم</CardTitle>
                  <CardDescription>
                    {selectedRegion === "all" ? "جميع الأقاليم (أعلى 15)" : `أقاليم ${selectedRegion}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <BarChart
                      data={prefectureChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                                <p className="font-medium">{d.fullName}</p>
                                <p className="text-muted-foreground">عدد المؤسسات: {d.count}</p>
                                <p className="text-muted-foreground">الطاقة الاستيعابية: {d.capacity?.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                        />
                      <Bar dataKey="count" name="عدد المؤسسات" fill={COLORS.primary} radius={[0, 4, 4, 0]}>
                        {prefectureChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Prefecture Table */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>تفاصيل الأقاليم</CardTitle>
                  <CardDescription>جدول تفصيلي للمؤسسات في كل إقليم</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-right py-3 px-4 font-medium">الإقليم</th>
                          <th className="text-right py-3 px-4 font-medium">عدد المؤسسات</th>
                          <th className="text-right py-3 px-4 font-medium">الطاقة الاستيعابية</th>
                          <th className="text-right py-3 px-4 font-medium">متوسط الطاقة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prefectureChartData.map((pref, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{pref.fullName}</td>
                            <td className="py-3 px-4">{pref.count}</td>
                            <td className="py-3 px-4">{pref.capacity?.toLocaleString()}</td>
                            <td className="py-3 px-4">{pref.count > 0 ? Math.round(pref.capacity / pref.count) : 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prefecture View */}
            <TabsContent value="prefecture" className="space-y-6">
              {/* Summary for selected prefecture */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {renderStatCard(
                  "عدد المؤسسات",
                  filteredStats.total,
                  <Building2 className="h-5 w-5 text-primary" />,
                  "bg-primary/10"
                )}
                {renderStatCard(
                  "الطاقة الاستيعابية",
                  filteredStats.totalCapacity,
                  <Home className="h-5 w-5 text-green-600" />,
                  "bg-green-500/10"
                )}
                {renderStatCard(
                  "مرخصة",
                  filteredStats.licensed,
                  <CheckCircle className="h-5 w-5 text-emerald-600" />,
                  "bg-emerald-500/10"
                )}
                {renderStatCard(
                  "غير مرخصة",
                  filteredStats.unlicensed,
                  <AlertTriangle className="h-5 w-5 text-red-600" />,
                  "bg-red-500/10"
                )}
              </div>

              {/* Type breakdown cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm border-r-4 border-r-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">دور الطالب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{filteredStats.darTalib}</div>
                    <p className="text-xs text-muted-foreground">
                      {filteredStats.total > 0 ? Math.round(filteredStats.darTalib / filteredStats.total * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm border-r-4 border-r-pink-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">دور الطالبة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">{filteredStats.darTaliba}</div>
                    <p className="text-xs text-muted-foreground">
                      {filteredStats.total > 0 ? Math.round(filteredStats.darTaliba / filteredStats.total * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm border-r-4 border-r-violet-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">دار الطالب والطالبة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-violet-600">{filteredStats.mixed}</div>
                    <p className="text-xs text-muted-foreground">
                      {filteredStats.total > 0 ? Math.round(filteredStats.mixed / filteredStats.total * 100) : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {renderPieChart(typeDistributionData, "توزيع المؤسسات حسب النوع", selectedPrefecture === "all" ? (selectedRegion === "all" ? "جميع الأقاليم" : selectedRegion) : selectedPrefecture)}
                {renderPieChart(milieuData, "التوزيع حسب الوسط", "حضري وقروي")}
                {renderPieChart(legalStatusData, "الوضع القانوني", "حالة الترخيص")}
              </div>

              {/* Institutions List */}
              {filteredInstitutions.length > 0 && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>قائمة المؤسسات</CardTitle>
                    <CardDescription>
                      {selectedPrefecture !== "all" ? selectedPrefecture : (selectedRegion !== "all" ? selectedRegion : "جميع المؤسسات")} - {filteredInstitutions.length} مؤسسة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-right py-3 px-4 font-medium">اسم المؤسسة</th>
                            <th className="text-right py-3 px-4 font-medium">النوع</th>
                            <th className="text-right py-3 px-4 font-medium">الجماعة</th>
                            <th className="text-right py-3 px-4 font-medium">الطاقة</th>
                            <th className="text-right py-3 px-4 font-medium">الوضع القانوني</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInstitutions.slice(0, 20).map((inst) => (
                            <tr key={inst.id} className="border-b hover:bg-muted/30">
                              <td className="py-3 px-4 font-medium">{inst.institutionName}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                  inst.institutionType === "DAR_TALIB" ? "bg-blue-100 text-blue-700" :
                                  inst.institutionType === "DAR_TALIBA" ? "bg-pink-100 text-pink-700" :
                                  "bg-violet-100 text-violet-700"
                                }`}>
                                  {inst.institutionType === "DAR_TALIB" ? "دار الطالب" :
                                   inst.institutionType === "DAR_TALIBA" ? "دار الطالبة" : "دار الطالب والطالبة"}
                                </span>
                              </td>
                              <td className="py-3 px-4">{inst.communeName || "—"}</td>
                              <td className="py-3 px-4">{inst.totalCapacity || 0}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                  inst.legalStatus === "LICENSED" ? "bg-green-100 text-green-700" :
                                  inst.legalStatus === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {inst.legalStatus === "LICENSED" ? "مرخصة" :
                                   inst.legalStatus === "IN_PROGRESS" ? "في طور الترخيص" : "غير مرخصة"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredInstitutions.length > 20 && (
                        <p className="text-center text-muted-foreground py-4">
                          عرض أول 20 مؤسسة من أصل {filteredInstitutions.length}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
