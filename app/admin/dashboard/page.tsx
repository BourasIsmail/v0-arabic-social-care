"use client";

import { useEffect } from "react";
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
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
// Note: ChartContainer used for bar chart, custom legends for pie charts
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import type { DashboardStats } from "@/lib/types";
import { Building2, Users, MapPin, CheckCircle, Home, Loader2, UserCog, Utensils, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Chart colors - computed values, not CSS variables
const COLORS = {
  primary: "#2563eb",
  secondary: "#16a34a", 
  accent: "#dc2626",
  muted: "#6b7280",
  urban: "#3b82f6",
  rural: "#22c55e",
  licensed: "#10b981",
  unlicensed: "#ef4444",
  darTalib: "#2563eb",
  darTaliba: "#ec4899",
  mixed: "#8b5cf6",
};

export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Redirect non-admin users
  useEffect(() => {
    if (!isAuthLoading && user && user.role !== "ADMIN") {
      router.push("/institutions");
    }
  }, [user, isAuthLoading, router]);

  const { data: stats, isLoading, error } = useAuthSWR<DashboardStats>(
    user?.role === "ADMIN" ? "/api/api/v1/statistics/dashboard" : null
  );

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

  // Prepare chart data
  const typeDistributionData = [
    { name: "دار الطالب", value: stats?.darTalibCount || 0, fill: COLORS.darTalib },
    { name: "دار الطالبة", value: stats?.darTalibaCount || 0, fill: COLORS.darTaliba },
    { name: "مختلطة", value: stats?.mixedCount || 0, fill: COLORS.mixed },
  ];

  const milieuData = [
    { name: "حضري", value: stats?.urbanCount || 0, fill: COLORS.urban },
    { name: "قروي", value: stats?.ruralCount || 0, fill: COLORS.rural },
  ];

  const legalStatusData = [
    { name: "مرخصة", value: stats?.licensedCount || 0, fill: COLORS.licensed },
    { name: "غير مرخصة", value: stats?.unlicensedCount || 0, fill: COLORS.unlicensed },
  ];

  const regionData = (stats?.byRegion || [])
    .slice(0, 10)
    .map((r) => ({
      name: r.regionName?.substring(0, 15) || `جهة ${r.regionId}`,
      count: r.count,
      capacity: r.capacity,
    }));

  const chartConfig = {
    count: { label: "عدد المؤسسات", color: COLORS.primary },
    capacity: { label: "الطاقة الاستيعابية", color: COLORS.secondary },
  };

  const pieChartConfig = {
    darTalib: { label: "دار الطالب", color: COLORS.darTalib },
    darTaliba: { label: "دار الطالبة", color: COLORS.darTaliba },
    mixed: { label: "مختلطة", color: COLORS.mixed },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background" dir="rtl">
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
                  <MapPin className="h-6 w-6" />
                  لوحة التحكم
                </h1>
                <p className="text-muted-foreground">
                  إحصائيات المؤسسات
                </p>
              </div>
            </div>
          </div>
          {/* Summary Cards - Row 1 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  إجمالي المؤسسات
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalInstitutions || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  الطاقة الاستيعابية
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalCapacity?.toLocaleString() || 0}</div>
                {stats?.averageCapacity !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    معدل {stats.averageCapacity.toLocaleString()} لكل مؤسسة
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  المستفيدون
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalBeneficiaries?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  المؤسسات المرخصة
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats?.licensedCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  من أصل {stats?.totalInstitutions || 0} مؤسسة
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards - Row 2 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  إجمالي الموظفين
                </CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalStaffCount?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  مؤسسات بالإيواء
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.institutionsWithHousing || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalInstitutions ? Math.round((stats.institutionsWithHousing || 0) / stats.totalInstitutions * 100) : 0}% من المؤسسات
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  مؤسسات بالإطعام
                </CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.institutionsWithMeals || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalInstitutions ? Math.round((stats.institutionsWithMeals || 0) / stats.totalInstitutions * 100) : 0}% من المؤسسات
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  غير مرخصة
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats?.unlicensedCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalInstitutions ? Math.round((stats.unlicensedCount || 0) / stats.totalInstitutions * 100) : 0}% تحتاج ترخيص
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Type Distribution Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="border-r-4 border-r-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">دور الطالب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats?.darTalibCount || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-pink-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">دور الطالبة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-600">{stats?.darTalibaCount || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">مختلطة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats?.mixedCount || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Institution Type Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع المؤسسات حسب النوع</CardTitle>
                <CardDescription>دار الطالب، دار الطالبة، ومختلطة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {typeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-2 text-sm">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-muted-foreground">{data.value} مؤسسة</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {typeDistributionData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milieu Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب الوسط</CardTitle>
                <CardDescription>حضري وقروي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={milieuData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {milieuData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-2 text-sm">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-muted-foreground">{data.value} مؤسسة</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {milieuData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legal Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>الوضع القانوني</CardTitle>
                <CardDescription>مرخصة وغير مرخصة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={legalStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {legalStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-2 text-sm">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-muted-foreground">{data.value} مؤسسة</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {legalStatusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Region Bar Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>المؤسسات حسب الجهة</CardTitle>
              <CardDescription>
                عدد المؤسسات والطاقة الاستيعابية في كل جهة (أعلى 10)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="count"
                      name="عدد المؤسسات"
                      fill={COLORS.primary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Prefecture Table */}
          {stats?.byPrefecture && stats.byPrefecture.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>المؤسسات حسب الإقليم</CardTitle>
                <CardDescription>تفاصيل المؤسسات في كل إقليم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-medium">الإقليم</th>
                        <th className="text-right py-3 px-4 font-medium">عدد المؤسسات</th>
                        <th className="text-right py-3 px-4 font-medium">الطاقة الاستيعابية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.byPrefecture.slice(0, 15).map((pref) => (
                        <tr key={pref.prefectureId} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{pref.prefectureName}</td>
                          <td className="py-3 px-4">{pref.count}</td>
                          <td className="py-3 px-4">{pref.capacity?.toLocaleString() || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
