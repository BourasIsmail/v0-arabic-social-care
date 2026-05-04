"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/layout/app-header";
import type { DashboardStats, InstitutionSummary, PageResponse } from "@/lib/types";
import { 
  Building2, Users, MapPin, CheckCircle, Home, Loader2, Utensils, 
  TrendingUp, Globe, Map, Building, BarChart3, GraduationCap, Heart
} from "lucide-react";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
import { Progress } from "@/components/ui/progress";

// Type/Milieu/Status labels
const typeLabels: Record<string, string> = {
  DAR_TALIB: "دار الطالب",
  DAR_TALIBA: "دار الطالبة",
  DAR_TALIB_TALIBA: "دار الطالب والطالبة",
  DAR_ATFAL: "دار الأطفال",
};

const milieuLabels: Record<string, string> = {
  URBAN: "حضري",
  URBAIN: "حضري",
  RURAL: "قروي",
  SEMI_URBAN: "شبه حضري",
};

const statusLabels: Record<string, string> = {
  LICENSED: "مرخصة",
  UNLICENSED: "غير مرخصة",
  IN_PROGRESS: "في طور الترخيص",
};

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
  const { data: stats, isLoading } = useAuthSWR<DashboardStats>(
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

  // Calculate statistics from filtered data
  const calculatedStats = useMemo(() => {
    const data = filteredInstitutions;
    const totalInstitutions = data.length;
    const totalCapacity = data.reduce((sum, i) => sum + (i.totalCapacity || 0), 0);
    
    // Type distribution
    const typeDistribution = data.reduce((acc, inst) => {
      const type = inst.institutionType || "OTHER";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Milieu distribution
    const milieuDistribution = data.reduce((acc, inst) => {
      const milieu = inst.milieu || "UNKNOWN";
      acc[milieu] = (acc[milieu] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Legal status distribution
    const statusDistribution = data.reduce((acc, inst) => {
      const status = inst.legalStatus || "UNKNOWN";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // By region stats
    const regionStats = data.reduce((acc, inst) => {
      const region = inst.regionName || "غير محدد";
      if (!acc[region]) {
        acc[region] = { count: 0, capacity: 0 };
      }
      acc[region].count += 1;
      acc[region].capacity += inst.totalCapacity || 0;
      return acc;
    }, {} as Record<string, { count: number; capacity: number }>);

    // By prefecture stats
    const prefectureStats = data.reduce((acc, inst) => {
      const prefecture = inst.prefectureName || "غير محدد";
      if (!acc[prefecture]) {
        acc[prefecture] = { count: 0, capacity: 0, region: inst.regionName || "" };
      }
      acc[prefecture].count += 1;
      acc[prefecture].capacity += inst.totalCapacity || 0;
      return acc;
    }, {} as Record<string, { count: number; capacity: number; region: string }>);

    return {
      totalInstitutions,
      totalCapacity,
      typeDistribution,
      milieuDistribution,
      statusDistribution,
      regionStats,
      prefectureStats,
    };
  }, [filteredInstitutions]);

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

  // Stats Card Component
  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description,
    color = "text-primary"
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
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  // Distribution Card Component
  const DistributionCard = ({ 
    title, 
    data, 
    labels,
    icon: Icon 
  }: { 
    title: string; 
    data: Record<string, number>; 
    labels: Record<string, string>;
    icon: React.ElementType;
  }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = ["bg-blue-500", "bg-pink-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-cyan-500"];
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const label = labels[key] || key;
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-medium">{value} ({percentage.toFixed(1)}%)</span>
                </div>
                <Progress value={percentage} className={`h-2 ${colors[index % colors.length]}`} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  // Table Card Component for region/prefecture data
  const StatsTableCard = ({ 
    title, 
    data, 
    showRegion = false,
    icon: Icon 
  }: { 
    title: string; 
    data: Record<string, { count: number; capacity: number; region?: string }>; 
    showRegion?: boolean;
    icon: React.ElementType;
  }) => {
    const sortedData = Object.entries(data).sort((a, b) => b[1].count - a[1].count);
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b">
                  <th className="text-right py-2 font-medium">الاسم</th>
                  {showRegion && <th className="text-right py-2 font-medium">الجهة</th>}
                  <th className="text-center py-2 font-medium">العدد</th>
                  <th className="text-center py-2 font-medium">الطاقة</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(([name, stats]) => (
                  <tr key={name} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-2">{name}</td>
                    {showRegion && <td className="py-2 text-muted-foreground text-xs">{stats.region}</td>}
                    <td className="text-center py-2 font-medium">{stats.count}</td>
                    <td className="text-center py-2 text-muted-foreground">{stats.capacity.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "VIEW_ONLY"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">لوحة المعلومات</h1>
            <p className="text-muted-foreground">إحصائيات شاملة حول المؤسسات</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
            <TabsList className="mb-6">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                عام
              </TabsTrigger>
              <TabsTrigger value="region" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                حسب الجهة
              </TabsTrigger>
              <TabsTrigger value="prefecture" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                حسب الإقليم
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            {(activeTab === "region" || activeTab === "prefecture") && (
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">الجهة:</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="جميع الجهات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الجهات</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region!}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeTab === "prefecture" && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">الإقليم:</label>
                    <Select value={selectedPrefecture} onValueChange={setSelectedPrefecture}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="جميع الأقاليم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأقاليم</SelectItem>
                        {prefectures.map(pref => (
                          <SelectItem key={pref} value={pref!}>{pref}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Global Tab */}
            <TabsContent value="global" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="إجمالي المؤسسات" 
                  value={stats?.totalInstitutions || calculatedStats.totalInstitutions} 
                  icon={Building2}
                  color="text-blue-500"
                />
                <StatCard 
                  title="الطاقة الاستيعابية الإجمالية" 
                  value={stats?.totalCapacity || calculatedStats.totalCapacity} 
                  icon={Users}
                  color="text-green-500"
                />
                <StatCard 
                  title="عدد الجهات" 
                  value={regions.length} 
                  icon={Map}
                  color="text-purple-500"
                />
                <StatCard 
                  title="عدد الأقاليم" 
                  value={Object.keys(calculatedStats.prefectureStats).length} 
                  icon={MapPin}
                  color="text-orange-500"
                />
              </div>

              {/* Distribution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DistributionCard 
                  title="التوزيع حسب النوع" 
                  data={calculatedStats.typeDistribution}
                  labels={typeLabels}
                  icon={Building2}
                />
                <DistributionCard 
                  title="التوزيع حسب الوسط" 
                  data={calculatedStats.milieuDistribution}
                  labels={milieuLabels}
                  icon={Home}
                />
                <DistributionCard 
                  title="التوزيع حسب الوضعية القانونية" 
                  data={calculatedStats.statusDistribution}
                  labels={statusLabels}
                  icon={CheckCircle}
                />
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatsTableCard 
                  title="إحصائيات الجهات" 
                  data={calculatedStats.regionStats}
                  icon={Map}
                />
                <StatsTableCard 
                  title="أعلى 20 إقليم" 
                  data={Object.fromEntries(
                    Object.entries(calculatedStats.prefectureStats)
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 20)
                  )}
                  showRegion
                  icon={Building}
                />
              </div>
            </TabsContent>

            {/* Region Tab */}
            <TabsContent value="region" className="space-y-6">
              {/* Summary for selected region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="عدد المؤسسات" 
                  value={calculatedStats.totalInstitutions} 
                  icon={Building2}
                  description={selectedRegion === "all" ? "جميع الجهات" : selectedRegion}
                  color="text-blue-500"
                />
                <StatCard 
                  title="الطاقة الاستيعابية" 
                  value={calculatedStats.totalCapacity} 
                  icon={Users}
                  color="text-green-500"
                />
                <StatCard 
                  title="متوسط الطاقة لكل مؤسسة" 
                  value={calculatedStats.totalInstitutions > 0 
                    ? Math.round(calculatedStats.totalCapacity / calculatedStats.totalInstitutions) 
                    : 0} 
                  icon={TrendingUp}
                  color="text-purple-500"
                />
                <StatCard 
                  title="عدد الأقاليم" 
                  value={Object.keys(calculatedStats.prefectureStats).length} 
                  icon={MapPin}
                  color="text-orange-500"
                />
              </div>

              {/* Distribution Cards for selected region */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DistributionCard 
                  title="التوزيع حسب النوع" 
                  data={calculatedStats.typeDistribution}
                  labels={typeLabels}
                  icon={Building2}
                />
                <DistributionCard 
                  title="التوزيع حسب الوسط" 
                  data={calculatedStats.milieuDistribution}
                  labels={milieuLabels}
                  icon={Home}
                />
                <DistributionCard 
                  title="التوزيع حسب الوضعية" 
                  data={calculatedStats.statusDistribution}
                  labels={statusLabels}
                  icon={CheckCircle}
                />
              </div>

              {/* Prefecture breakdown for selected region */}
              <StatsTableCard 
                title="الأقاليم في الجهة المختارة" 
                data={calculatedStats.prefectureStats}
                showRegion={selectedRegion === "all"}
                icon={Building}
              />
            </TabsContent>

            {/* Prefecture Tab */}
            <TabsContent value="prefecture" className="space-y-6">
              {/* Summary for selected prefecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="عدد المؤسسات" 
                  value={calculatedStats.totalInstitutions} 
                  icon={Building2}
                  description={selectedPrefecture === "all" 
                    ? (selectedRegion === "all" ? "جميع الأقاليم" : `أقاليم ${selectedRegion}`)
                    : selectedPrefecture}
                  color="text-blue-500"
                />
                <StatCard 
                  title="الطاقة الاستيعابية" 
                  value={calculatedStats.totalCapacity} 
                  icon={Users}
                  color="text-green-500"
                />
                <StatCard 
                  title="متوسط الطاقة لكل مؤسسة" 
                  value={calculatedStats.totalInstitutions > 0 
                    ? Math.round(calculatedStats.totalCapacity / calculatedStats.totalInstitutions) 
                    : 0} 
                  icon={TrendingUp}
                  color="text-purple-500"
                />
                <StatCard 
                  title="عدد الجماعات" 
                  value={[...new Set(filteredInstitutions.map(i => i.communeName).filter(Boolean))].length} 
                  icon={MapPin}
                  color="text-orange-500"
                />
              </div>

              {/* Distribution Cards for selected prefecture */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DistributionCard 
                  title="التوزيع حسب النوع" 
                  data={calculatedStats.typeDistribution}
                  labels={typeLabels}
                  icon={Building2}
                />
                <DistributionCard 
                  title="التوزيع حسب الوسط" 
                  data={calculatedStats.milieuDistribution}
                  labels={milieuLabels}
                  icon={Home}
                />
                <DistributionCard 
                  title="التوزيع حسب الوضعية" 
                  data={calculatedStats.statusDistribution}
                  labels={statusLabels}
                  icon={CheckCircle}
                />
              </div>

              {/* Institution list for selected prefecture */}
              {selectedPrefecture !== "all" && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      قائمة المؤسسات في {selectedPrefecture}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-card">
                          <tr className="border-b">
                            <th className="text-right py-2 font-medium">اسم المؤسسة</th>
                            <th className="text-right py-2 font-medium">النوع</th>
                            <th className="text-right py-2 font-medium">الجماعة</th>
                            <th className="text-center py-2 font-medium">الطاقة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInstitutions.map((inst) => (
                            <tr key={inst.id} className="border-b border-border/30 hover:bg-muted/30">
                              <td className="py-2">{inst.institutionName}</td>
                              <td className="py-2 text-muted-foreground">{typeLabels[inst.institutionType] || inst.institutionType}</td>
                              <td className="py-2 text-muted-foreground">{inst.communeName || "—"}</td>
                              <td className="text-center py-2 font-medium">{inst.totalCapacity || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
