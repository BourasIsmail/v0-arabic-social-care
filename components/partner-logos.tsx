"use client";

import Image from "next/image";

export function PartnerLogos() {
  return (
    <section className="py-14 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-l from-border to-transparent" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              الشركاء المؤسساتيون
            </h3>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="flex items-center justify-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <Image
              src="/images/partners-banner.png"
              alt="الشركاء المؤسساتيون"
              width={1100}
              height={130}
              className="object-contain max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
