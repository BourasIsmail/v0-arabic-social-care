"use client";

import Link from "next/link";
import { Building2, FileText, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/layout/app-header";
import { PartnerLogos } from "@/components/partner-logos";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader subtitle="الصفحة الرئيسية" />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                استمارة تشخيص مؤسسات الرعاية الاجتماعية
              </h2>
              <p className="text-lg text-muted-foreground text-balance">
                نظام متكامل لجمع وإدارة بيانات دور الطالب والطالبة ومؤسسات الرعاية الاجتماعية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/diagnostic">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <FileText className="h-5 w-5" />
                    بدء استمارة جديدة
                  </Button>
                </Link>
                <Link href="/institutions">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <Building2 className="h-5 w-5" />
                    عرض المؤسسات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <PartnerLogos />

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-12">مميزات النظام</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>استمارة شاملة</CardTitle>
                  <CardDescription>
                    استمارة تشخيصية تغطي جميع جوانب المؤسسة من معلومات أساسية وبناية وتمويل
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>إدارة المؤسسات</CardTitle>
                  <CardDescription>
                    عرض وإدارة جميع المؤسسات المسجلة مع إمكانية البحث والفلترة والتعديل
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>تتبع المستفيدين</CardTitle>
                  <CardDescription>
                    متابعة أعداد المستفيدين حسب المواسم الدراسية والفئات المختلفة
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>إحصائيات متقدمة</CardTitle>
                  <CardDescription>
                    لوحة تحكم شاملة مع إحصائيات ورسوم بيانية تفاعلية
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>نظام إدارة مؤسسات الرعاية الاجتماعية</p>
              <p className="mt-2">جميع الحقوق محفوظة</p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
