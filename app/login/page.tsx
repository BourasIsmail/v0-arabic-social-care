"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Building2, Mail, Lock, Shield } from "lucide-react";
import type { LoginRequest } from "@/lib/auth-types";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const redirectingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated - deferred to avoid hydration issues
  useEffect(() => {
    if (mounted && isAuthenticated && !authLoading && !redirectingRef.current) {
      redirectingRef.current = true;
      requestAnimationFrame(() => {
        window.location.href = "/";
      });
    }
  }, [isAuthenticated, authLoading, mounted]);

  // Show loading during SSR and while checking auth
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("تم تسجيل الدخول بنجاح");
      window.location.href = "/";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل تسجيل الدخول"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Partners Banner */}
      <div className="relative z-10 flex justify-center py-6 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <Image
          src="/images/partners-banner.png"
          alt="الشركاء المؤسساتيون"
          width={700}
          height={70}
          className="object-contain h-12 md:h-16 w-auto"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md shadow-2xl shadow-primary/5 border-border/50">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
              <CardDescription className="mt-2 text-base">
                نظام تشخيص مؤسسات الرعاية الاجتماعية
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@social.ma"
                    className="pr-11 h-12 text-base rounded-xl border-border/60 focus:border-primary"
                    {...register("email", {
                      required: "البريد الإلكتروني مطلوب",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "البريد الإلكتروني غير صحيح",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="pr-11 h-12 text-base rounded-xl border-border/60 focus:border-primary"
                    {...register("password", {
                      required: "كلمة المرور مطلوبة",
                      minLength: {
                        value: 6,
                        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>اتصال آمن ومشفر</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-4 text-center border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          التعاون الوطني - جميع الحقوق محفوظة {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
