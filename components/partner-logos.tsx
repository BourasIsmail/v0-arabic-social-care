"use client";

import Image from "next/image";

const partners = [
  {
    name: "وزارة التضامن والإدماج الاجتماعي والأسرة",
    logo: "/images/logos/msisf-logo.png",
  },
  {
    name: "وزارة الداخلية",
    logo: "/images/logos/logo-int.jpeg",
  },
  {
    name: "وزارة التربية الوطنية والتعليم الأولي والرياضة",
    logo: "/images/logos/logo-ed.png",
  },
  {
    name: "التعاون الوطني",
    logo: "/images/logos/logo-en.png",
  },
  {
    name: "المبادرة الوطنية للتنمية البشرية",
    logo: "/images/logos/logo-indh.png",
  },
  {
    name: "وزارة الاقتصاد والمالية",
    logo: "/images/logos/logo-finance.png",
  },
];

export function PartnerLogos() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold text-center text-muted-foreground mb-8">
          الشركاء المؤسساتيون
        </h3>
        <div className="flex items-center justify-center gap-6 lg:gap-10 overflow-x-auto">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex-shrink-0 w-24 h-16 relative grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
