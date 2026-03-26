import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiagnosticFormWizard } from "@/components/form/diagnostic-form-wizard";

export default function DiagnosticPage() {
  return (
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
                <p className="text-sm text-muted-foreground">استمارة تشخيص المؤسسات</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">استمارة التشخيص</h2>
            <p className="text-muted-foreground mt-2">
              أكمل جميع الخطوات لتسجيل بيانات المؤسسة
            </p>
          </div>

          <DiagnosticFormWizard />
        </div>
      </main>
    </div>
  );
}
