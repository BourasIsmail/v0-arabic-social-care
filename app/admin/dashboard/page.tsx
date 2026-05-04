"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, useAuthFetch } from "@/lib/auth-context";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/layout/app-header";
import type { DashboardStats, InstitutionSummary, InstitutionResponse, PageResponse, StaffMemberDTO } from "@/lib/types";
import { 
  Building2, Users, MapPin, CheckCircle, Home, Loader2, Utensils, 
  TrendingUp, Globe, Map, Building, GraduationCap, Heart, DollarSign,
  Briefcase, UserCheck, School, Hammer, Settings, Wallet, ChefHat, Bed,
  AlertCircle, FileCheck, XCircle, Clock
} from "lucide-react";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const staffTypeLabels: Record<string, string> = {
  DIRECTOR: "مدير(ة)",
  FINANCIAL_MANAGER: "مسير(ة) مالي",
  GENERAL_GUARD: "حارس عام",
  SOCIAL_WORKER: "مساعد(ة) اجتماعي",
  DOCTOR: "طبيب(ة)",
  NURSE: "ممرض(ة)",
  PSYCHOLOGIST: "أخصائي نفسي",
  EDUCATORS: "مربين",
  KITCHEN_MANAGER: "مسؤول المطبخ",
  KITCHEN_AGENTS: "عمال المطبخ",
  STORAGE_MANAGER: "مسؤول المخزن",
  SECURITY: "الحراسة",
  SERVICE_AGENTS: "عمال الخدمة",
  OTHER: "آخرون",
};

const mealServiceLabels: Record<string, string> = {
  INSTITUTION_KITCHEN: "إعداد الوجبات في مطبخ المؤسسة",
  READY_MEALS: "وجبات جاهزة",
  OTHER: "آخر",
};

export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const authFetch = useAuthFetch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("global");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("all");
  const [fullInstitutions, setFullInstitutions] = useState<InstitutionResponse[]>([]);
  const [isLoadingFull, setIsLoadingFull] = useState(false);

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

  // Fetch all institutions summary for basic analysis
  const { data: institutionsData } = useAuthSWR<PageResponse<InstitutionSummary>>(
    (user?.role === "ADMIN" || user?.role === "VIEW_ONLY") ? buildApiUrl(`${API_ENDPOINTS.institutions.list}?size=10000`) : null
  );

  const institutions = institutionsData?.content || [];

  // Fetch full institution data for detailed KPIs (only once)
  useEffect(() => {
    const fetchFullData = async () => {
      if (institutions.length > 0 && fullInstitutions.length === 0 && !isLoadingFull) {
        setIsLoadingFull(true);
        try {
          // Fetch in batches of 20 to avoid overwhelming the server
          const batchSize = 20;
          const allData: InstitutionResponse[] = [];
          
          for (let i = 0; i < institutions.length; i += batchSize) {
            const batch = institutions.slice(i, i + batchSize);
            const batchPromises = batch.map(async (inst) => {
              try {
                const response = await authFetch(buildApiUrl(`${API_ENDPOINTS.institutions.list}/${inst.id}`));
                if (response.ok) {
                  return await response.json();
                }
                return null;
              } catch {
                return null;
              }
            });
            
            const batchResults = await Promise.all(batchPromises);
            allData.push(...batchResults.filter(Boolean));
          }
          
          setFullInstitutions(allData);
        } catch (error) {
          console.error("Error fetching full institution data:", error);
        } finally {
          setIsLoadingFull(false);
        }
      }
    };
    
    fetchFullData();
  }, [institutions, fullInstitutions.length, isLoadingFull, authFetch]);

  // Filter institutions based on selection
  const filteredInstitutions = useMemo(() => {
    let filtered = fullInstitutions.length > 0 ? fullInstitutions : institutions as any[];
    if (selectedRegion !== "all") {
      filtered = filtered.filter(inst => inst.regionName === selectedRegion);
    }
    if (selectedPrefecture !== "all") {
      filtered = filtered.filter(inst => inst.prefectureName === selectedPrefecture);
    }
    return filtered as InstitutionResponse[];
  }, [institutions, fullInstitutions, selectedRegion, selectedPrefecture]);

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

  // Calculate comprehensive statistics from filtered data
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

    // Type by Legal Status (for detailed KPI)
    const typeByStatus = data.reduce((acc, inst) => {
      const type = inst.institutionType || "OTHER";
      const status = inst.legalStatus || "UNKNOWN";
      if (!acc[type]) {
        acc[type] = { LICENSED: 0, UNLICENSED: 0, IN_PROGRESS: 0, UNKNOWN: 0 };
      }
      acc[type][status] = (acc[type][status] || 0) + 1;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Type by Milieu
    const typeByMilieu = data.reduce((acc, inst) => {
      const type = inst.institutionType || "OTHER";
      const milieu = inst.milieu || "UNKNOWN";
      if (!acc[type]) {
        acc[type] = { URBAIN: 0, RURAL: 0, UNKNOWN: 0 };
      }
      acc[type][milieu] = (acc[type][milieu] || 0) + 1;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Target levels distribution
    const targetLevels = {
      primary: data.filter(i => i.primary).length,
      middleSchool: data.filter(i => i.middleSchool).length,
      highSchool: data.filter(i => i.highSchool).length,
      other: data.filter(i => i.other).length,
    };

    // Building financing sources
    const buildingFinancing = {
      solidarityMinistry: data.filter(i => i.financing?.solidarityMinistry).length,
      nationalEntraide: data.filter(i => i.financing?.nationalEntraide).length,
      indh: data.filter(i => i.financing?.indh).length,
      commune: data.filter(i => i.financing?.commune).length,
      fondationMohammed5: data.filter(i => i.financing?.fondationMohammed5).length,
      nationalRevival: data.filter(i => i.financing?.nationalRevival).length,
      association: data.filter(i => i.financing?.association).length,
      other: data.filter(i => i.financing?.otherConstruction).length,
    };

    // Equipment financing sources
    const equipmentFinancing = {
      solidarityMinistry: data.filter(i => i.financing?.equipmentSolidarityMinistry).length,
      nationalEntraide: data.filter(i => i.financing?.equipmentNationalEntraide).length,
      indh: data.filter(i => i.financing?.equipmentIndh).length,
      commune: data.filter(i => i.financing?.equipmentCommune).length,
      fondationMohammed5: data.filter(i => i.financing?.equipmentFondationMohammed5).length,
      association: data.filter(i => i.financing?.equipmentAssociation).length,
      other: data.filter(i => i.financing?.equipmentOther).length,
    };

    // Operating financing sources
    const operatingFinancing = {
      indh: data.filter(i => i.financing?.operatingIndh).length,
      nationalEntraide: data.filter(i => i.financing?.operatingNationalEntraide).length,
      nationalEducation: data.filter(i => i.financing?.operatingNationalEducation).length,
      commune: data.filter(i => i.financing?.operatingCommune).length,
      parentContributions: data.filter(i => i.financing?.operatingParentContributions).length,
      donors: data.filter(i => i.financing?.operatingDonors).length,
      associationOwnSources: data.filter(i => i.financing?.operatingAssociationOwnSources).length,
      other: data.filter(i => i.financing?.operatingOther).length,
    };

    // Meal service types
    const mealServiceTypes = data.reduce((acc, inst) => {
      const type = inst.housingMeals?.mealServiceType || "UNKNOWN";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Services provided
    const servicesProvided = {
      housing: data.filter(i => i.housing).length,
      meals: data.filter(i => i.meals).length,
      educationalSupport: data.filter(i => i.educationalSupport).length,
      culturalActivities: data.filter(i => i.culturalActivities).length,
      healthCare: data.filter(i => i.healthCare).length,
      insurance: data.filter(i => i.insurance).length,
      psychologicalSupport: data.filter(i => i.psychologicalSupport).length,
    };

    // Beneficiaries stats (2025-2026)
    const beneficiaryStats = {
      totalHousing: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.totalBeneficiaries || 0), 0),
      maleHousing: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.maleBeneficiaries || 0), 0),
      femaleHousing: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.femaleBeneficiaries || 0), 0),
      primaryHousing: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.primaryBeneficiaries || 0), 0),
      middleSchoolHousing: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.middleSchoolBeneficiaries || 0), 0),
      highSchoolHousing: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.highSchoolBeneficiaries || 0), 0),
      orphans: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.orphans || 0), 0),
      disabled: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.disabled || 0), 0),
      totalMeals: data.reduce((sum, i) => sum + (i.housingMeals?.totalMealBeneficiaries2526 || 0), 0),
    };

    // Previous seasons comparison
    const seasonComparison = {
      season2324: data.reduce((sum, i) => sum + (i.housingMeals?.season2324?.totalBeneficiaries || 0), 0),
      season2425: data.reduce((sum, i) => sum + (i.housingMeals?.season2425?.totalBeneficiaries || 0), 0),
      season2526: data.reduce((sum, i) => sum + (i.housingMeals?.season2526?.totalBeneficiaries || 0), 0),
    };

    // Human resources stats
    const hrStats = data.reduce((acc, inst) => {
      if (inst.staffMembers) {
        inst.staffMembers.forEach(staff => {
          const type = staff.staffType || "OTHER";
          if (!acc[type]) {
            acc[type] = { association: 0, deployed: 0, volunteers: 0, cnss: 0, smig: 0, totalCost: 0 };
          }
          acc[type].association += staff.nbAssociation || 0;
          acc[type].deployed += staff.nbDeployed || 0;
          acc[type].volunteers += staff.nbVolunteers || 0;
          acc[type].cnss += staff.nbCNSS || 0;
          acc[type].smig += staff.nbSMIG || 0;
          acc[type].totalCost += staff.annualCost || 0;
        });
      }
      return acc;
    }, {} as Record<string, { association: number; deployed: number; volunteers: number; cnss: number; smig: number; totalCost: number }>);

    const totalStaff = Object.values(hrStats).reduce((sum, s) => sum + s.association + s.deployed + s.volunteers, 0);
    const totalHRCost = Object.values(hrStats).reduce((sum, s) => sum + s.totalCost, 0);

    // Financial stats
    const financialStats = {
      totalConstructionCost: data.reduce((sum, i) => sum + (i.financing?.totalConstructionCost || 0), 0),
      annualManagementCost: data.reduce((sum, i) => sum + (i.financing?.annualManagementCost || 0), 0),
      annualHRCost: data.reduce((sum, i) => sum + (i.financing?.annualHRCost || 0), 0),
      annualMealsCost: data.reduce((sum, i) => sum + (i.financing?.annualMealsCost || 0), 0),
      avgIndividualCost: totalInstitutions > 0 
        ? data.reduce((sum, i) => sum + (i.financing?.individualAnnualCost || 0), 0) / data.filter(i => i.financing?.individualAnnualCost).length 
        : 0,
    };

    // By region stats
    const regionStats = data.reduce((acc, inst) => {
      const region = inst.regionName || "غير محدد";
      if (!acc[region]) {
        acc[region] = { count: 0, capacity: 0, beneficiaries: 0 };
      }
      acc[region].count += 1;
      acc[region].capacity += inst.totalCapacity || 0;
      acc[region].beneficiaries += inst.housingMeals?.season2526?.totalBeneficiaries || 0;
      return acc;
    }, {} as Record<string, { count: number; capacity: number; beneficiaries: number }>);

    // By prefecture stats
    const prefectureStats = data.reduce((acc, inst) => {
      const prefecture = inst.prefectureName || "غير محدد";
      if (!acc[prefecture]) {
        acc[prefecture] = { count: 0, capacity: 0, region: inst.regionName || "", beneficiaries: 0 };
      }
      acc[prefecture].count += 1;
      acc[prefecture].capacity += inst.totalCapacity || 0;
      acc[prefecture].beneficiaries += inst.housingMeals?.season2526?.totalBeneficiaries || 0;
      return acc;
    }, {} as Record<string, { count: number; capacity: number; region: string; beneficiaries: number }>);

    return {
      totalInstitutions,
      totalCapacity,
      typeDistribution,
      milieuDistribution,
      statusDistribution,
      typeByStatus,
      typeByMilieu,
      targetLevels,
      buildingFinancing,
      equipmentFinancing,
      operatingFinancing,
      mealServiceTypes,
      servicesProvided,
      beneficiaryStats,
      seasonComparison,
      hrStats,
      totalStaff,
      totalHRCost,
      financialStats,
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
    color = "text-primary",
    suffix = ""
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType;
    description?: string;
    color?: string;
    suffix?: string;
  }) => (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix && <span className="text-sm font-normal text-muted-foreground mr-1">{suffix}</span>}
        </div>
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
    const colors = ["bg-blue-500", "bg-pink-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-cyan-500", "bg-orange-500", "bg-red-500"];
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(data).filter(([_, v]) => v > 0).map(([key, value], index) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const label = labels[key] || key;
            return (
              <div key={key} className="space-y-1">
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

  // Type Detail Card - shows type breakdown by status and milieu
  const TypeDetailCard = () => {
    const types = Object.keys(calculatedStats.typeDistribution);
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">تفاصيل أنواع المؤسسات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {types.map(type => {
              const total = calculatedStats.typeDistribution[type] || 0;
              const byStatus = calculatedStats.typeByStatus[type] || {};
              const byMilieu = calculatedStats.typeByMilieu[type] || {};
              
              return (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">{typeLabels[type] || type}</span>
                    <Badge variant="secondary">{total} مؤسسة</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-2">حسب الترخيص:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1"><FileCheck className="h-3 w-3 text-green-500" /> مرخصة</span>
                          <span>{byStatus.LICENSED || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /> غير مرخصة</span>
                          <span>{byStatus.UNLICENSED || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-yellow-500" /> في الترخيص</span>
                          <span>{byStatus.IN_PROGRESS || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">حسب الوسط:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>حضري</span>
                          <span>{byMilieu.URBAIN || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>قروي</span>
                          <span>{byMilieu.RURAL || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Financing Sources Card
  const FinancingCard = ({ 
    title, 
    data, 
    icon: Icon 
  }: { 
    title: string; 
    data: Record<string, number>;
    icon: React.ElementType;
  }) => {
    const labels: Record<string, string> = {
      solidarityMinistry: "وزارة التضامن",
      nationalEntraide: "التعاون الوطني",
      indh: "المبادرة الوطنية للتنمية البشرية",
      commune: "الجماعة",
      fondationMohammed5: "مؤسسة محمد الخامس",
      nationalRevival: "الإنعاش الوطني",
      association: "الجمعية",
      nationalEducation: "التربية الوطنية",
      parentContributions: "مساهمات الآباء",
      donors: "المحسنين",
      associationOwnSources: "موارد الجمعية الذاتية",
      other: "مصادر أخرى",
    };
    
    const total = filteredInstitutions.length;
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(data).filter(([_, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([key, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return (
              <div key={key} className="flex justify-between items-center text-sm py-1 border-b border-border/30 last:border-0">
                <span>{labels[key] || key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{value}</span>
                  <Badge variant="outline" className="text-xs">{percentage.toFixed(0)}%</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  // Human Resources Card
  const HRCard = () => {
    const hrData = Object.entries(calculatedStats.hrStats)
      .filter(([_, stats]) => stats.association + stats.deployed + stats.volunteers > 0)
      .sort((a, b) => (b[1].association + b[1].deployed + b[1].volunteers) - (a[1].association + a[1].deployed + a[1].volunteers));
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            الموارد البشرية العاملة بالمؤسسات
          </CardTitle>
          <CardDescription>
            إجمالي الموظفين: {calculatedStats.totalStaff.toLocaleString()} | 
            التكلفة السنوية: {calculatedStats.totalHRCost.toLocaleString()} درهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b">
                  <th className="text-right py-2 font-medium">الفئة</th>
                  <th className="text-center py-2 font-medium">جمعية</th>
                  <th className="text-center py-2 font-medium">منتدب</th>
                  <th className="text-center py-2 font-medium">متطوع</th>
                  <th className="text-center py-2 font-medium">CNSS</th>
                  <th className="text-center py-2 font-medium">SMIG</th>
                  <th className="text-left py-2 font-medium">التكلفة</th>
                </tr>
              </thead>
              <tbody>
                {hrData.map(([type, stats]) => (
                  <tr key={type} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-2 font-medium">{staffTypeLabels[type] || type}</td>
                    <td className="text-center py-2">{stats.association}</td>
                    <td className="text-center py-2">{stats.deployed}</td>
                    <td className="text-center py-2">{stats.volunteers}</td>
                    <td className="text-center py-2">{stats.cnss}</td>
                    <td className="text-center py-2">{stats.smig}</td>
                    <td className="text-left py-2 text-muted-foreground">{stats.totalCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Beneficiaries Card
  const BeneficiariesCard = () => {
    const { beneficiaryStats, seasonComparison } = calculatedStats;
    
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            المستفيدون من خدمتي الإيواء والإطعام
          </CardTitle>
          <CardDescription>الموسم الدراسي 2025-2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Bed className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-2xl font-bold text-blue-600">{beneficiaryStats.totalHousing.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">إجمالي الإيواء</p>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <Utensils className="h-5 w-5 mx-auto mb-1 text-orange-500" />
              <p className="text-2xl font-bold text-orange-600">{beneficiaryStats.totalMeals.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">إجمالي الإطعام</p>
            </div>
            <div className="text-center p-3 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
              <Heart className="h-5 w-5 mx-auto mb-1 text-pink-500" />
              <p className="text-2xl font-bold text-pink-600">{beneficiaryStats.orphans.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">الأيتام</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <UserCheck className="h-5 w-5 mx-auto mb-1 text-purple-500" />
              <p className="text-2xl font-bold text-purple-600">{beneficiaryStats.disabled.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">ذوي الاحتياجات</p>
            </div>
          </div>
          
          {/* Gender breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">التوزيع حسب الجنس</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>ذكور</span>
                  <span className="font-medium">{beneficiaryStats.maleHousing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>إناث</span>
                  <span className="font-medium">{beneficiaryStats.femaleHousing.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">التوزيع حسب المستوى</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>ابتدائي</span>
                  <span className="font-medium">{beneficiaryStats.primaryHousing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>إعدادي</span>
                  <span className="font-medium">{beneficiaryStats.middleSchoolHousing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>تأهيلي</span>
                  <span className="font-medium">{beneficiaryStats.highSchoolHousing.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Season comparison */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">مقارنة المواسم</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>2023-2024</span>
                <span className="font-medium">{seasonComparison.season2324.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>2024-2025</span>
                <span className="font-medium">{seasonComparison.season2425.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>2025-2026</span>
                <span className="font-medium text-primary">{seasonComparison.season2526.toLocaleString()}</span>
              </div>
            </div>
          </div>
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
    data: Record<string, { count: number; capacity: number; region?: string; beneficiaries?: number }>; 
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
                  <th className="text-center py-2 font-medium">المستفيدون</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(([name, stats]) => (
                  <tr key={name} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-2">{name}</td>
                    {showRegion && <td className="py-2 text-muted-foreground text-xs">{stats.region}</td>}
                    <td className="text-center py-2 font-medium">{stats.count}</td>
                    <td className="text-center py-2 text-muted-foreground">{stats.capacity.toLocaleString()}</td>
                    <td className="text-center py-2 text-muted-foreground">{(stats.beneficiaries || 0).toLocaleString()}</td>
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
            <p className="text-muted-foreground">
              إحصائيات شاملة حول المؤسسات
              {isLoadingFull && (
                <span className="mr-2 text-primary">
                  <Loader2 className="h-4 w-4 inline animate-spin ml-1" />
                  جاري تحميل البيانات التفصيلية...
                </span>
              )}
            </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard 
                  title="إجمالي المؤسسات" 
                  value={calculatedStats.totalInstitutions} 
                  icon={Building2}
                  color="text-blue-500"
                />
                <StatCard 
                  title="الطاقة الاستيعابية" 
                  value={calculatedStats.totalCapacity} 
                  icon={Users}
                  color="text-green-500"
                />
                <StatCard 
                  title="المستفيدون (إيواء)" 
                  value={calculatedStats.beneficiaryStats.totalHousing} 
                  icon={Bed}
                  color="text-purple-500"
                />
                <StatCard 
                  title="المستفيدون (إطعام)" 
                  value={calculatedStats.beneficiaryStats.totalMeals} 
                  icon={Utensils}
                  color="text-orange-500"
                />
                <StatCard 
                  title="الموارد البشرية" 
                  value={calculatedStats.totalStaff} 
                  icon={Briefcase}
                  color="text-cyan-500"
                />
                <StatCard 
                  title="عدد الجهات" 
                  value={regions.length} 
                  icon={Map}
                  color="text-pink-500"
                />
              </div>

              {/* Type Details */}
              <TypeDetailCard />

              {/* Target Levels and Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">المستويات المستهدفة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span>ابتدائي</span>
                      <Badge>{calculatedStats.targetLevels.primary} مؤسسة</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span>ثانوي إعدادي</span>
                      <Badge>{calculatedStats.targetLevels.middleSchool} مؤسسة</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span>ثانوي تأهيلي</span>
                      <Badge>{calculatedStats.targetLevels.highSchool} مؤسسة</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span>آخر</span>
                      <Badge variant="outline">{calculatedStats.targetLevels.other} مؤسسة</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">الخدمات المقدمة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(calculatedStats.servicesProvided).map(([service, count]) => {
                      const labels: Record<string, string> = {
                        housing: "الإيواء",
                        meals: "الإطعام",
                        educationalSupport: "الدعم التربوي",
                        culturalActivities: "الأنشطة الثقافية",
                        healthCare: "الرعاية الصحية",
                        insurance: "التأمين",
                        psychologicalSupport: "الدعم النفسي",
                      };
                      const percentage = calculatedStats.totalInstitutions > 0 ? (count / calculatedStats.totalInstitutions) * 100 : 0;
                      return (
                        <div key={service} className="flex justify-between items-center text-sm">
                          <span>{labels[service]}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{count}</span>
                            <Badge variant="outline" className="text-xs">{percentage.toFixed(0)}%</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Financing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancingCard 
                  title="تمويل بناء المؤسسة" 
                  data={calculatedStats.buildingFinancing}
                  icon={Hammer}
                />
                <FinancingCard 
                  title="تمويل تجهيز المؤسسة" 
                  data={calculatedStats.equipmentFinancing}
                  icon={Settings}
                />
                <FinancingCard 
                  title="مصادر تمويل التسيير" 
                  data={calculatedStats.operatingFinancing}
                  icon={Wallet}
                />
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <StatCard 
                  title="تكلفة البناء الإجمالية" 
                  value={calculatedStats.financialStats.totalConstructionCost} 
                  icon={Hammer}
                  suffix="درهم"
                  color="text-blue-500"
                />
                <StatCard 
                  title="تكلفة التسيير السنوية" 
                  value={calculatedStats.financialStats.annualManagementCost} 
                  icon={Settings}
                  suffix="درهم"
                  color="text-green-500"
                />
                <StatCard 
                  title="تكلفة الموارد البشرية" 
                  value={calculatedStats.financialStats.annualHRCost} 
                  icon={Briefcase}
                  suffix="درهم"
                  color="text-purple-500"
                />
                <StatCard 
                  title="تكلفة الإطعام السنوية" 
                  value={calculatedStats.financialStats.annualMealsCost} 
                  icon={Utensils}
                  suffix="درهم"
                  color="text-orange-500"
                />
                <StatCard 
                  title="متوسط التكلفة للفرد" 
                  value={Math.round(calculatedStats.financialStats.avgIndividualCost)} 
                  icon={DollarSign}
                  suffix="درهم"
                  color="text-cyan-500"
                />
              </div>

              {/* Meal Service */}
              <DistributionCard 
                title="خدمة الإطعام" 
                data={calculatedStats.mealServiceTypes}
                labels={mealServiceLabels}
                icon={ChefHat}
              />

              {/* Beneficiaries */}
              <BeneficiariesCard />

              {/* Human Resources */}
              <HRCard />

              {/* Regional Tables */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  title="المستفيدون (إيواء)" 
                  value={calculatedStats.beneficiaryStats.totalHousing} 
                  icon={Bed}
                  color="text-purple-500"
                />
                <StatCard 
                  title="المستفيدون (إطعام)" 
                  value={calculatedStats.beneficiaryStats.totalMeals} 
                  icon={Utensils}
                  color="text-orange-500"
                />
                <StatCard 
                  title="الموارد البشرية" 
                  value={calculatedStats.totalStaff} 
                  icon={Briefcase}
                  color="text-cyan-500"
                />
                <StatCard 
                  title="عدد الأقاليم" 
                  value={Object.keys(calculatedStats.prefectureStats).length} 
                  icon={MapPin}
                  color="text-pink-500"
                />
              </div>

              {/* Type Details */}
              <TypeDetailCard />

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

              {/* Financing for region */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancingCard 
                  title="تمويل بناء المؤسسة" 
                  data={calculatedStats.buildingFinancing}
                  icon={Hammer}
                />
                <FinancingCard 
                  title="تمويل تجهيز المؤسسة" 
                  data={calculatedStats.equipmentFinancing}
                  icon={Settings}
                />
                <FinancingCard 
                  title="مصادر تمويل التسيير" 
                  data={calculatedStats.operatingFinancing}
                  icon={Wallet}
                />
              </div>

              {/* Beneficiaries for region */}
              <BeneficiariesCard />

              {/* HR for region */}
              <HRCard />

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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  title="المستفيدون (إيواء)" 
                  value={calculatedStats.beneficiaryStats.totalHousing} 
                  icon={Bed}
                  color="text-purple-500"
                />
                <StatCard 
                  title="المستفيدون (إطعام)" 
                  value={calculatedStats.beneficiaryStats.totalMeals} 
                  icon={Utensils}
                  color="text-orange-500"
                />
                <StatCard 
                  title="الموارد البشرية" 
                  value={calculatedStats.totalStaff} 
                  icon={Briefcase}
                  color="text-cyan-500"
                />
                <StatCard 
                  title="عدد الجماعات" 
                  value={[...new Set(filteredInstitutions.map(i => i.communeName).filter(Boolean))].length} 
                  icon={MapPin}
                  color="text-pink-500"
                />
              </div>

              {/* Type Details */}
              <TypeDetailCard />

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

              {/* Financing for prefecture */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancingCard 
                  title="تمويل بناء المؤسسة" 
                  data={calculatedStats.buildingFinancing}
                  icon={Hammer}
                />
                <FinancingCard 
                  title="تمويل تجهيز المؤسسة" 
                  data={calculatedStats.equipmentFinancing}
                  icon={Settings}
                />
                <FinancingCard 
                  title="مصادر تمويل التسيير" 
                  data={calculatedStats.operatingFinancing}
                  icon={Wallet}
                />
              </div>

              {/* Beneficiaries for prefecture */}
              <BeneficiariesCard />

              {/* HR for prefecture */}
              <HRCard />

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
                            <th className="text-center py-2 font-medium">المستفيدون</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInstitutions.map((inst) => (
                            <tr key={inst.id} className="border-b border-border/30 hover:bg-muted/30">
                              <td className="py-2">{inst.institutionName}</td>
                              <td className="py-2 text-muted-foreground">{typeLabels[inst.institutionType] || inst.institutionType}</td>
                              <td className="py-2 text-muted-foreground">{inst.communeName || "—"}</td>
                              <td className="text-center py-2 font-medium">{inst.totalCapacity || 0}</td>
                              <td className="text-center py-2 text-muted-foreground">{inst.housingMeals?.season2526?.totalBeneficiaries || 0}</td>
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
