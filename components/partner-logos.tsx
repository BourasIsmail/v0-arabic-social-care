"use client";

import Image from "next/image";

export function PartnerLogos() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold text-center text-muted-foreground mb-8">
          الشركاء المؤسساتيون
        </h3>
        <div className="flex items-center justify-center">
          <Image
            src="/images/partners-banner.png"
            alt="الشركاء المؤسساتيون"
            width={1200}
            height={150}
            className="object-contain max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
