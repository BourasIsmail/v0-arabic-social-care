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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="w-32 h-20 md:w-36 md:h-24 flex items-center justify-center p-2 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={100}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
