"use client";

import Link from "next/link";
import { Building2, FileText, Users, BarChart3, ArrowLeft, CheckCircle2, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/layout/app-header";
import { PartnerLogos } from "@/components/partner-logos";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader subtitle="الصفحة الرئيسية" />

        {/* Hero Section - Modern Split Design */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/8 via-transparent to-accent/5" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">المملكة المغربية - وزارة التضامن والإدماج الاجتماعي والأسرة</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
                <span className="text-foreground">نظام تشخيص</span>
                <br />
                <span className="gradient-text">مؤسسات الرعاية الاجتماعية</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10 leading-relaxed">
                منصة رقمية متكاملة لجمع وإدارة وتحليل بيانات دور الطالب والطالبة 
                ومؤسسات الرعاية الاجتماعية على المستوى الوطني
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/diagnostic">
                  <Button size="lg" className="gap-3 h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    <FileText className="h-5 w-5" />
                    بدء استمارة جديدة
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/institutions">
                  <Button size="lg" variant="outline" className="gap-3 h-14 px-8 text-base border-2 hover:bg-secondary transition-all">
                    <Building2 className="h-5 w-5" />
                    استعراض المؤسسات
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">12</div>
                  <div className="text-sm text-muted-foreground">جهة</div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-1">75</div>
                  <div className="text-sm text-muted-foreground">إقليم وعمالة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">+1500</div>
                  <div className="text-sm text-muted-foreground">مؤسسة</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <PartnerLogos />

        {/* Features Section - Bento Grid Style */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">مميزات النظام</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                أدوات متطورة لإدارة البيانات بكفاءة عالية وأمان تام
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {/* Feature 1 - Large */}
              <Card className="card-hover md:col-span-2 lg:row-span-2 overflow-hidden group">
                <CardHeader className="pb-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <FileText className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl mb-2">استمارة تشخيصية شاملة</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    استمارة متكاملة تغطي جميع جوانب المؤسسة من المعلومات الأساسية والبنية التحتية 
                    إلى التمويل والموارد البشرية والخدمات المقدمة
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {["معلومات المؤسسة والجمعية", "البناية والتجهيزات", "التمويل والميزانية", "الموارد البشرية"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="card-hover group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">إدارة المؤسسات</CardTitle>
                  <CardDescription>
                    عرض وإدارة المؤسسات مع البحث المتقدم والفلترة
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="card-hover group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">تتبع المستفيدين</CardTitle>
                  <CardDescription>
                    متابعة أعداد المستفيدين حسب المواسم والفئات
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 4 */}
              <Card className="card-hover group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">إحصائيات متقدمة</CardTitle>
                  <CardDescription>
                    لوحة تحكم شاملة مع رسوم بيانية تفاعلية
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 5 */}
              <Card className="card-hover group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">تقارير PDF</CardTitle>
                  <CardDescription>
                    تصدير البيانات بصيغة PDF للطباعة والأرشفة
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer - Modern Design */}
        <footer className="border-t border-border bg-card">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">نظام الرعاية الاجتماعية</h3>
                  <p className="text-sm text-muted-foreground">وزارة التضامن والإدماج الاجتماعي والأسرة</p>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  جميع الحقوق محفوظة {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
