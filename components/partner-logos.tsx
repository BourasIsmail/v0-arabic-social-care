"use client";

import Image from "next/image";

const partners = [
  {
    name: "وزارة التضامن والإدماج الاجتماعي والأسرة",
    logo: "/images/logos/msisf-logo.png",
    width: 200,
    height: 80,
  },
  {
    name: "وزارة الداخلية",
    logo: "/images/logos/logo-int.jpeg",
    width: 140,
    height: 80,
  },
  {
    name: "وزارة التربية الوطنية والتعليم الأولي والرياضة",
    logo: "/images/logos/logo-ed.png",
    width: 120,
    height: 80,
  },
  {
    name: "التعاون الوطني",
    logo: "/images/logos/logo-en.png",
    width: 180,
    height: 60,
  },
  {
    name: "المبادرة الوطنية للتنمية البشرية",
    logo: "/images/logos/logo-indh.png",
    width: 140,
    height: 60,
  },
  {
    name: "وزارة الاقتصاد والمالية",
    logo: "/images/logos/logo-finance.png",
    width: 140,
    height: 60,
  },
];

export function PartnerLogos() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold text-center text-muted-foreground mb-8">
          الشركاء المؤسساتيون
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="object-contain max-h-16 md:max-h-20 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
