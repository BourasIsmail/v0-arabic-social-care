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
import { useAuth } from "@/lib/auth-context";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import type { DashboardStats } from "@/lib/types";
import { Building2, Users, MapPin, CheckCircle, Home, Loader2 } from "lucide-react";

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
    user?.role === "ADMIN" ? "/api/statistics/dashboard" : null
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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">لوحة التحكم</h1>
              <span className="text-sm text-muted-foreground">إحصائيات المؤسسات</span>
            </div>
            <UserMenu />
          </div>
        </header>

        <main className="container py-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
                <ChartContainer config={pieChartConfig} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {typeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Milieu Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب الوسط</CardTitle>
                <CardDescription>حضري وقروي</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    urban: { label: "حضري", color: COLORS.urban },
                    rural: { label: "قروي", color: COLORS.rural },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={milieuData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {milieuData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Legal Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>الوضع القانوني</CardTitle>
                <CardDescription>مرخصة وغير مرخصة</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    licensed: { label: "مرخصة", color: COLORS.licensed },
                    unlicensed: { label: "غير مرخصة", color: COLORS.unlicensed },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={legalStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {legalStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
